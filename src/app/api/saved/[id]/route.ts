import authOptions from "@/lib/auth-options";
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server"


export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const readmeId = params.id;
      if (!readmeId) {
        return NextResponse.json({ error: 'README ID is required' }, { status: 400 });
      }
      
      console.log("session user ID ", session.user.id)
      // Get the specified README
      const readme = await prisma.readme.findUnique({
        where: {
          id: readmeId,
          userId: session.user.id
        }
      });
  
      if (!readme) {
        return NextResponse.json({ error: 'README not found' }, { status: 404 });
      }
  
      return NextResponse.json(readme);
    } catch (error) {
      console.error('Error fetching README:', error);
      return NextResponse.json({ error: 'Failed to fetch README' }, { status: 500 });
    }
  }


export async function PATCH (req: Request , {params} : {params : {id : string}}) {
    try {
        const {readme} = await req.json()

        const data = await prisma.readme.update({
            where : {
                id : params.id
            },
            data : {
                markdown : readme
            }
        })

        return NextResponse.json({data : data},{status : 200})

    } catch (error) {
        console.log(error)
        return NextResponse.json({message : "Internal Server Error !!"},{status : 500})
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
      const session = await getServerSession(authOptions);
      if (!session || !session.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const readmeId = params.id;
      if (!readmeId) {
        return NextResponse.json({ error: 'README ID is required' }, { status: 400 });
      }
  
      // Ensure the README exists and belongs to the user
      const existingReadme = await prisma.readme.findUnique({
        where: {
          id: readmeId,
          userId: session.user.id
        }
      });
  
      if (!existingReadme) {
        return NextResponse.json({ error: 'README not found' }, { status: 404 });
      }
  
      // Delete the README
      await prisma.readme.delete({
        where: {
          id: readmeId
        }
      });
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error deleting README:', error);
      return NextResponse.json({ error: 'Failed to delete README' }, { status: 500 });
    }
  }