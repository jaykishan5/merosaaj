
"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6 text-destructive">
                <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                We apologize for the inconvenience. Please try again later.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-sm hover:bg-accent transition-colors"
                >
                    Try Again
                </button>
                <button
                    onClick={() => window.location.href = '/'}
                    className="px-6 py-2 border border-border font-bold rounded-lg text-sm hover:bg-muted transition-colors"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
