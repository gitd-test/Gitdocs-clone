import { NextRequest, NextResponse } from 'next/server';
import { currentUser, auth } from '@clerk/nextjs/server';
import connectMongo from '@/app/api/lib/db/connectMongo';
import User from '@/app/api/lib/models/User';

export async function GET(req: NextRequest) {

    const response = NextResponse.redirect(new URL('/loading', req.url));

    try {
        const { userId } = await auth();
        
        // Redirect to sign-in if no user is found
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        (async () => {
        // Perform database operations in the background
            try {
                const user = await currentUser();
                if (!user) {
                    return;
                }

                await connectMongo();
                const existingUser = await User.findOne({ clerkUid: userId });

                if (!existingUser) {
                    await User.create({
                        clerkUid: userId,
                        email: user.emailAddresses[0].emailAddress,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        subscriptionType: 'free',
                        signupDate: new Date(),
                        repositories: [],
                    });
                }

            } catch (error) {
                console.error('Background processing error:', error);
            }
        })();

        return response; // Immediate redirect to /loading
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.redirect(new URL('/error', req.url)); // Redirect to error page if something fails
    }
}
