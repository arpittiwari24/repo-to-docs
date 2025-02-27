import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import crypto from 'crypto';
import authOptions from '@/lib/auth-options';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI("AIzaSyCKfOOuoAVSXz9CBr36JgznlCvTHMBvRRk");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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

    Based on the following repository files and their contents, generate a professional README.md markdown file that includes:

    1. Project Title and Description
    2. Features and Functionality
    3. Technology Stack
    4. Prerequisites
    5. Installation Instructions
    6. Usage Guide
    7. API Documentation (if applicable)
    8. Contributing Guidelines
    9. License Information
    10. Contact/Support Information

    Make the README practical, detailed, and specific to this codebase. Include actual file paths, commands, and configuration details found in the code.

    Here are all the repository files for analysis:

    ${fileAnalysis}

    Generate a README.md file striclty in markdown format ( without markdown written on the top of the code ) that accurately represents this specific project.`;

        const result = await model.generateContent(prompt);
        
        let readme = result.response.text();

        readme = readme.replace(/^```markdown\n/, '').replace(/\n```$/, '');

        // Store the generated README in the database
        const savedReadme = await prisma.readme.create({
            data: {
                id : crypto.randomUUID(),
                repo_name: repoName,
                repo_url: repoMetadata.html_url,
                markdown: readme,
                userId: session.user.id!
            }
        });

        return NextResponse.json({
            id: savedReadme.id,
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



export async function GET(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      
      // Add detailed logging to debug the session
      console.log("API Route Session:", 
        session ? {
          hasUser: !!session.user,
          userId: session.user?.id,
          email: session.user?.email
        } : "No session");
      
      if (!session || !session.user || !session.user.id) {
        console.error("Unauthorized access attempt - session details missing");
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      // Get the user's recent READMEs
      const readmes = await prisma.readme.findMany({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });
  
      console.log(`Successfully fetched ${readmes.length} readmes for user ${session.user.id}`);
      return NextResponse.json(readmes);
    } catch (error) {
      console.error('Error fetching READMEs:', error);
      return NextResponse.json({ 
        error: 'Failed to fetch READMEs', 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }
  }