import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateSubscriptionStatus } from "../../auth/subscription/clientSubscriptionServices";
import { updateUser } from "../../auth/user/clientUserServicies";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
                            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
                            .update(body)
                            .digest('hex');

    if (signature !== expectedSignature) {
        return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;
        const subscription = await updateSubscriptionStatus(payment.notes.userId, payment.order_id, payment.id, "Active", payment.notes.subscriptionType, payment.notes.price);

        if (!subscription) {
            return NextResponse.json({ message: "Subscription not found" }, { status: 400 });
        }

        await updateUser(payment.notes.userId, { subscriptionType: payment.notes.subscriptionType });

        return NextResponse.json({ message: "Subscription updated" });
    } 

    else if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;
        const subscription = await updateSubscriptionStatus(payment.notes.userId, payment.order_id, payment.id, "Inactive", "", 0);

        if (!subscription) {
            return NextResponse.json({ message: "Subscription not found" }, { status: 400 });
        }

        return NextResponse.json({ message: "Subscription updated" });
    }

    return NextResponse.json({ message: "Webhook received" });
}