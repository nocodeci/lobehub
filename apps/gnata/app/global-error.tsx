'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
                    <h2 className="mb-4 text-2xl font-bold text-foreground">Une erreur critique est survenue</h2>
                    <button
                        onClick={() => reset()}
                        className="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                        Réessayer
                    </button>
                </div>
            </body>
        </html>
    )
}
