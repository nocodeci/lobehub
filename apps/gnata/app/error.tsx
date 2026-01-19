'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Oups, une petite erreur s&apos;est produite !</h2>
            <p className="mb-8 text-muted-foreground">
                Ne vous inquiétez pas, Gnata AI est toujours là. Essayez de recharger la page.
            </p>
            <Button
                onClick={() => reset()}
                variant="default"
            >
                Réessayer
            </Button>
        </div>
    )
}
