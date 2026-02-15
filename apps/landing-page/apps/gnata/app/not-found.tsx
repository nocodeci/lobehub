import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Page introuvable</h2>
            <p className="mb-8 text-muted-foreground">
                Désolé, la page que vous cherchez n&apos;existe pas ou a été déplacée.
            </p>
            <Button asChild>
                <Link href="/">Retour à l&apos;accueil</Link>
            </Button>
        </div>
    )
}
