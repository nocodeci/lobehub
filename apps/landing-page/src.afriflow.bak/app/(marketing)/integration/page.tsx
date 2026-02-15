"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, Code2, Terminal, Layers, Box } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const supportedTechs = [
    { name: "Node.js", icon: "/icons/nodejs.svg", color: "bg-green-500/10 text-green-500" },
    { name: "Python", icon: "/icons/python.svg", color: "bg-yellow-500/10 text-yellow-500" },
    { name: "PHP", icon: "/icons/php.svg", color: "bg-purple-500/10 text-purple-500" },
    { name: "Java", icon: "/icons/java.svg", color: "bg-red-500/10 text-red-500" },
    { name: "React", icon: "/icons/react.svg", color: "bg-sky-500/10 text-sky-500" },
    { name: "Flutter", icon: "/icons/flutter.svg", color: "bg-blue-500/10 text-blue-500" },
];

export default function IntegrationPage() {
    const [activeTab, setActiveTab] = useState("nodejs");

    return (
        <main className="bg-[#020202] min-h-screen selection:bg-primary selection:text-black font-sans">
            {/* Unified Header */}
            <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
                <div className="flex items-center justify-between gap-4 bg-black/60 backdrop-blur-xl border border-white/10 p-2 pl-6 rounded-full shadow-2xl w-full max-w-4xl">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center">
                                <Zap className="h-5 w-5 fill-current" />
                            </div>
                            <span className="text-sm font-bold text-white">AfriFlow</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-400">
                        <Link href="/pricing" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Tarification</Link>
                        <Link href="/docs" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Documentation</Link>
                        <Link href="/integration" className="px-4 py-1.5 rounded-full bg-white/10 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Intégration</Link>
                        <Link href="/coverage" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Couverture</Link>
                        <Link href="/contact" className="px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/20">Contact</Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="text-zinc-300 hover:text-white hover:bg-white/10 rounded-full h-10 px-6 hidden sm:flex">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button className="rounded-full bg-white text-black hover:bg-zinc-200 h-10 px-6 font-medium">
                                S'inscrire
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#020202]">
                    <div className="absolute top-[-100px] right-0 w-[600px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] opacity-20" />
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 mb-8">
                            <Code2 className="h-3 w-3" />
                            SDKs & API REST
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            Conçu pour les développeurs, <br />
                            par des développeurs.
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                            Intégrez AfriFlow en quelques lignes de code. Que vous utilisiez Node.js, Python, PHP ou nos plugins CMS, tout est prêt.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/docs">
                                <Button size="lg" className="rounded-full h-12 px-8 bg-white text-black hover:bg-zinc-200 font-bold">
                                    <Terminal className="mr-2 h-4 w-4" />
                                    Lire la documentation
                                </Button>
                            </Link>
                            <Link href="https://github.com/afriflow" target="_blank">
                                <Button variant="outline" size="lg" className="rounded-full h-12 px-8 border-white/10 text-white hover:bg-white/5">
                                    Voir sur GitHub
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Code Preview Section */}
            <section className="pb-32 relative z-10">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* Left: Interactive Tabs */}
                        <div className="w-full lg:w-1/3 space-y-4">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Choisissez votre stack
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                {supportedTechs.map((tech) => (
                                    <button
                                        key={tech.name}
                                        onClick={() => setActiveTab(tech.name.toLowerCase().replace(".", ""))}
                                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 text-left ${activeTab === tech.name.toLowerCase().replace(".", "")
                                                ? "bg-white/10 border-white/20 shadow-lg"
                                                : "bg-[#0A0A0A] border-white/5 hover:border-white/10 hover:bg-white/5"
                                            }`}
                                    >
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tech.color}`}>
                                            {/* Fallback icon if specific image fails, but using text for now or simple shapes */}
                                            <Box className="h-4 w-4" />
                                        </div>
                                        <span className="font-medium text-white">{tech.name}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm text-zinc-500 mt-4">
                                Également disponible pour: Ruby, Go, .NET, WooCommerce, Shopify, PrestaShop.
                            </p>
                        </div>

                        {/* Right: Code Block */}
                        <div className="w-full lg:w-2/3">
                            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <span className="ml-4 text-xs font-mono text-zinc-500">install-payment.ts</span>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <pre className="text-sm font-mono leading-relaxed">
                                        <code className="text-zinc-300">
                                            {activeTab === "nodejs" && `import { AfriFlow } from '@afriflow/node';

const client = new AfriFlow(process.env.AFRIFLOW_KEY);

// Initialiser un paiement
const payment = await client.payments.create({
  amount: 5000,
  currency: 'XOF',
  method: 'wave', // ou 'orange-money', 'mtn-momo'...
  customer: {
    phone: '+22507070707',
    email: 'client@email.com'
  }
});

console.log(payment.url); // Rediriger l'utilisateur ici`}

                                            {activeTab === "python" && `from afriflow import AfriFlow
import os

client = AfriFlow(os.getenv('AFRIFLOW_KEY'))

# Initialiser un paiement
payment = client.payments.create(
    amount=5000,
    currency='XOF',
    method='wave',
    customer={
        'phone': '+22507070707',
        'email': 'client@email.com'
    }
)

print(payment.url) # Rediriger l'utilisateur ici`}

                                            {activeTab === "php" && `use AfriFlow\\Client;

$client = new Client(getenv('AFRIFLOW_KEY'));

// Initialiser un paiement
$payment = $client->payments->create([
    'amount' => 5000,
    'currency' => 'XOF',
    'method' => 'wave',
    'customer' => [
        'phone' => '+22507070707',
        'email' => 'client@email.com'
    ]
]);

echo $payment->url; // Rediriger l'utilisateur ici`}

                                            {(!["nodejs", "python", "php"].includes(activeTab)) && `// Code example coming soon for ${activeTab}...
// Check our full documentation at docs.afriflow.com`}
                                        </code>
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="py-12 border-t border-white/5 relative bg-black">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-zinc-500 text-sm">
                    <p>© 2026 Wozif. Tous droits réservés.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
                        <a href="#" className="hover:text-white transition-colors">Conditions</a>
                        <a href="#" className="hover:text-white transition-colors">Twitter</a>
                    </div>
                </div>
            </footer>
        </main>
    );
}
