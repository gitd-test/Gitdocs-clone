import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';

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

        return response; // Return redirect response immediately
    } catch (error) {
        console.error('Middleware error:', error);

        // Redirect to error page if an error occurs
        return NextResponse.redirect(new URL('/error', req.url));
    }
}
