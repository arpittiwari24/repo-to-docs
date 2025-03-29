import { NextResponse } from 'next/server';

// whsec_31f0GPNOSgcIL9sKl9Hwjm

export async function POST(req: Request) {
    const payload = req.body;
    console.log(req);
    return NextResponse.json({ message: 'Webhook received' },{status: 200});
};