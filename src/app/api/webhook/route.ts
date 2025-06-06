import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("body received",body);

    const eventType = body.meta.event_name;

    console.log("eventType : ", eventType);

    // Check signature
    const secret = "jai_mata_di";
    console.log(secret);
    // const hmac = crypto.createHmac("sha256", secret);
    // const digest = hmac.update(req.rawBody).digest("hex");
    // const signature = req.headers["x-signature"];

    // if (!signature || digest !== signature) {
    //   throw new Error("Invalid signature.");
    // }

    // Logic according to event
    if (eventType === "order_created" || eventType === "order_updated") {
      console.log("Order created or updated event received");
      const user_id = body.meta.custom_data.user_id;
      await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          premium: true,
        },
      });
    }
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    // You can return a 500 error response if needed
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
