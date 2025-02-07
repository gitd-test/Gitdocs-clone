'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Loading() {
    const router = useRouter();

    useEffect(() => {
        // Simulate waiting time for processing (adjust based on your backend)
        const timeout = setTimeout(() => {
            router.push('/'); // Redirect to the final destination
        }, 1000); // 1-second delay, matching backend operation

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, [router]);

    return (
        <div className="flex items-center justify-center h-screen bg-[#0D0D0D]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            <p className="ml-4 text-lg text-[#5e5a5a]">Redirecting, please wait...</p>
        </div>
    );
}
