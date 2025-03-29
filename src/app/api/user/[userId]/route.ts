import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request,{params} : {params : {userId : string}}) {

    const userId = params.userId;

    try {
        
        const premiumStatus = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                premium: true
            }
        });

        if (!premiumStatus) {
            console.error('User not found:', userId);
            return NextResponse.json("User not found", {status: 404});
        }

        console.log('User premium status:', premiumStatus);

        return NextResponse.json({premium : premiumStatus.premium}, {status: 200});

    } catch (error) {
        console.error('Error fetching user premium status:', error);
        return NextResponse.json("Internal Server Error", {status: 500});
    }

}