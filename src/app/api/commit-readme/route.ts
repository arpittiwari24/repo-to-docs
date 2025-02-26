import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import authOptions from '@/lib/auth-options';

const prisma = new PrismaClient();

// Function to check if README.md exists and get its SHA
async function getReadmeSha(repoName: string, accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${repoName}/contents/README.md`, {
      headers: {
        Authorization: `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    });

    if (response.status === 404) {
      // README doesn't exist yet
      return null;
    }

    if (!response.ok) {
      console.error(`Failed to check README existence: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.sha;
  } catch (error) {
    console.error('Error checking README existence:', error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { accessToken, repoName, readmeContent, readmeId } = await req.json();
    
    if (!accessToken || !repoName || !readmeContent) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get current README.md SHA if it exists
    const readmeSha = await getReadmeSha(repoName, accessToken);
    
    // Prepare request body
    const requestBody: any = {
      message: 'Update README.md via PenAI',
      content: Buffer.from(readmeContent).toString('base64'),
    };
    
    // If README exists, we need to provide its SHA
    if (readmeSha) {
      requestBody.sha = readmeSha;
    }

    // Commit README to the repo
    const commitResponse = await fetch(`https://api.github.com/repos/${repoName}/contents/README.md`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!commitResponse.ok) {
      const errorData = await commitResponse.json();
      console.error('Failed to commit README:', errorData);
      return NextResponse.json({ 
        error: 'Failed to commit README to repository',
        details: errorData 
      }, { status: 500 });
    }

    const commitData = await commitResponse.json();

    // Update the README in the database if an ID was provided
    if (readmeId) {
      await prisma.readme.update({
        where: { id: readmeId },
        data: { markdown: readmeContent }
      });
    }

    return NextResponse.json({
      success: true,
      commitUrl: commitData.commit.html_url
    });

  } catch (error) {
    console.error('Error committing README:', error);
    return NextResponse.json({ error: 'Failed to commit README' }, { status: 500 });
  }
}