import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import User from '@/app/api/lib/models/User';
import Subscription from '@/app/api/lib/models/Subscription';
import connectMongoWithRetry from '@/app/api/lib/db/connectMongo';
export async function GET(req: NextRequest) {
    try {
        // Fetch authenticated user's ID
        const { userId } = await auth();
        
        if (!userId) {
            // Return 401 Unauthorized if no user ID is found
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await currentUser();

        if (!user) {
            // Return 401 Unauthorized if no user is found
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Immediately redirect user to /loading
        const response = NextResponse.redirect(new URL('/loading', req.url));

        // Perform database operations in the background
        (async () => {
            try {

                // Connect to the MongoDB database
                await connectMongoWithRetry();

                // Check if the user already exists in the database
                const existingUser = await User.findOne({ clerkUid: userId });

                if (!existingUser) {
                    // Create a new user if not found
                    await User.create({
                        clerkUid: userId,
                        email: user.emailAddresses[0].emailAddress, // Replace this with a method to fetch the email securely
                        firstName: user.firstName, // Replace with user's first name
                        lastName: user.lastName, // Replace with user's last name
                        subscriptionType: 'Free',
                        signupDate: new Date(),
                        repositories: [],
                    });

                    await Subscription.create({
                        userId: userId,
                        subscriptionType: 'Free',
                        subscriptionStatus: 'Inactive',
                        subscriptionStartDate: new Date(),
                        subscriptionEndDate: new Date(),
                        subscriptionPrice: 0,
                        leftOverTokens: 10000,
                        bonusTokens: 0,
                    });

                }
            } catch (error) {
                console.error('Background processing error:', error);
            }
        })();

        return response; // Return redirect response immediately
    } catch (error) {
        console.error('Middleware error:', error);

        // Redirect to error page if an error occurs
        return NextResponse.redirect(new URL('/error', req.url));
    }
}
