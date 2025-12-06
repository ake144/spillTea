import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Not Found</h2>
            <p className="text-muted-foreground mb-8">Could not find requested resource</p>
            <Link
                href="/"
                className="px-6 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
                Return Home
            </Link>
        </div>
    )
}
