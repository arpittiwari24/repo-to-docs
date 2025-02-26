import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"


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