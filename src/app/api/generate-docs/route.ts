import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface FileContent {
    name: string;
    content: string;
    path: string;
}

async function fetchDirectoryContent(repoName: string, accessToken: string, path = ''): Promise<FileContent[]> {
    const response = await fetch(`https://api.github.com/repos/${repoName}/contents/${path}`, {
        headers: {
            Authorization: `token ${accessToken}`,
            'Accept': 'application/vnd.github.v3+json'
        },
    });

    if (!response.ok) {
        console.error(`Failed to fetch content for path: ${path}`);
        return [];
    }

    const contents = await response.json();
    const files: FileContent[] = [];

    for (const item of contents) {
        if (item.type === 'dir') {
            // Recursively fetch contents of subdirectories
            const subFiles = await fetchDirectoryContent(repoName, accessToken, item.path);
            files.push(...subFiles);
        } else if (item.type === 'file') {
            const isCodeFile = /\.(js|ts|jsx|tsx|go|py|java|rb|php|cpp|html|cs|swift|kt|rs|dart|vue|svelte)$/i.test(item.name) &&
                !item.name.includes('.min.') &&
                !item.name.includes('.config.') &&
                !item.name.includes('.test.') &&
                !item.name.includes('.spec.');

            if (isCodeFile) {
                const fileResponse = await fetch(item.download_url, {
                    headers: {
                        Authorization: `token ${accessToken}`,
                    },
                });

                if (fileResponse.ok) {
                    const content = await fileResponse.text();
                    files.push({
                        name: item.name,
                        content: content,
                        path: item.path
                    });
                }
            }
        }
    }

    return files;
}

export async function POST(req: Request) {
    try {
        const { accessToken, repoName } = await req.json();

        // Step 1: Fetch repo metadata
        const repoMetadataResponse = await fetch(`https://api.github.com/repos/${repoName}`, {
            headers: {
                Authorization: `token ${accessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            },
        });

        if (!repoMetadataResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch repository metadata' }, { status: 500 });
        }

        const repoMetadata = await repoMetadataResponse.json();

        // Step 2: Recursively fetch all files in the repository
        // Step 3: Fetch all code files
        const allFiles = await fetchDirectoryContent(repoName, accessToken);

        // Step 4: Analyze files and generate README
        const fileAnalysis = allFiles.map(file =>
            `File: ${file.path}\n\nContent:\n${file.content}\n\n---\n\n`
        ).join('');

        const prompt = `You are an expert developer tasked with creating a comprehensive README.md file for a GitHub repository. 
        
Repository Information:
Name: ${repoMetadata.name}
Description: ${repoMetadata.description || 'No description provided'}
URL: ${repoMetadata.html_url}
Default Branch: ${repoMetadata.default_branch}
License: ${repoMetadata.license?.name || 'Not specified'}

Based on the following repository files and their contents, generate a professional README.md file that includes:

1. Project Title and Description
2. Features and Functionality
3. Technology Stack
4. Project Structure
5. Prerequisites
6. Installation Instructions
7. Usage Guide
8. API Documentation (if applicable)
9. Contributing Guidelines
10. License Information
11. Contact/Support Information

Make the README practical, detailed, and specific to this codebase. Include actual file paths, commands, and configuration details found in the code.

Here are all the repository files for analysis:

${fileAnalysis}

Generate a README.md file in markdown format that accurately represents this specific project.`;

        const readmeResponse = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a technical documentation expert who specializes in creating clear, comprehensive README files for software projects.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 4000
        });

        const readme = readmeResponse.choices[0]?.message?.content || 'Failed to generate README';

        return NextResponse.json({
            readme,
            repositoryUrl: repoMetadata.html_url,
            repositoryName: repoMetadata.name,
            fileCount: allFiles.length
        });

    } catch (error) {
        console.error('Error generating docs:', error);
        return NextResponse.json({ error: 'Failed to generate documentation' }, { status: 500 });
    }
}