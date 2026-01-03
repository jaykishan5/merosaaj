
import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4 text-center">
            <h1 className="text-9xl font-black text-primary/10 tracking-tighter select-none">404</h1>
            <h2 className="text-3xl font-bold -mt-12 mb-4 relative z-10">Page Not Found</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-sm font-black uppercase tracking-widest hover:bg-accent transition-colors"
            >
                Return Home
            </Link>
        </div>
    )
}
