"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    ShoppingBag,
    Search,
    Filter,
    MoreHorizontal,
    Package,
    Tag,
    BarChart3,
    ArrowUpRight,
    ExternalLink,
    RefreshCw,
    Image as ImageIcon,
    AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const products = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        category: "Électronique",
        price: "1,299.00 €",
        stock: 42,
        status: "in_stock",
        sales: 124,
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=200",
        color: "emerald"
    },
    {
        id: 2,
        name: "MacBook Air M3",
        category: "Informatique",
        price: "1,499.00 €",
        stock: 15,
        status: "low_stock",
        sales: 85,
        image: "https://images.unsplash.com/photo-1517336712461-48114286229b?auto=format&fit=crop&q=80&w=200",
        color: "blue"
    },
    {
        id: 3,
        name: "AirPods Pro 2",
        category: "Accessoires",
        price: "279.00 €",
        stock: 89,
        status: "in_stock",
        sales: 320,
        image: "https://images.unsplash.com/photo-1588423770674-f2855ee82639?auto=format&fit=crop&q=80&w=200",
        color: "purple"
    },
    {
        id: 4,
        name: "Apple Watch Ultra",
        category: "Wearables",
        price: "899.00 €",
        stock: 0,
        status: "out_of_stock",
        sales: 45,
        image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=200",
        color: "orange"
    }
];

export default function ProductsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex h-screen bg-background text-white overflow-hidden font-sans">
            <DashboardSidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                <DashboardHeader />

                <div className="flex-1 overflow-y-auto custom-scrollbar md:p-8 p-4">
                    <div className="max-w-[1600px] mx-auto space-y-8">
                        {/* Hero Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                                    Gestion du <span className="text-primary">Catalogue</span>
                                </h1>
                                <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest opacity-60">
                                    Gérez votre inventaire et synchronisez vos produits avec votre boutique WhatsApp.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button className="bg-white/5 border border-white/10 hover:bg-white/10 text-white gap-2 h-11 px-6 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                                    <RefreshCw className="h-4 w-4" /> Sync Chariow
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-black gap-2 h-11 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                                    <Plus className="h-4.5 w-4.5" /> Ajouter un Produit
                                </Button>
                            </div>
                        </div>

                        {/* Inventory Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Produits", value: "1,240", icon: Package, color: "emerald" },
                                { label: "Catégories", value: "12", icon: Tag, color: "blue" },
                                { label: "Valeur Stock", value: "48.2k €", icon: BarChart3, color: "purple" },
                                { label: "Ruptures", value: "3", icon: AlertCircle, color: "orange" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="bg-[#171717] border-white/5 overflow-hidden group hover:border-primary/30 transition-all duration-500">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className={`p-2.5 rounded-xl ${stat.color === 'emerald' ? 'bg-emerald-400/10 text-emerald-400' :
                                                        stat.color === 'blue' ? 'bg-blue-400/10 text-blue-400' :
                                                            stat.color === 'purple' ? 'bg-purple-400/10 text-purple-400' : 'bg-orange-400/10 text-orange-400'
                                                    }`}>
                                                    <stat.icon className="h-5 w-5" />
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-50">{stat.label}</p>
                                                <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* Filters & Search */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Référence, nom du produit..."
                                    className="w-full bg-[#171717] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-[#171717] border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                                    <Filter className="h-4 w-4" /> Catégories
                                </button>
                                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-[#171717] border border-white/5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white hover:border-white/20 transition-all">
                                    Tri par prix
                                </button>
                            </div>
                        </div>

                        {/* Product Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + (i * 0.05) }}
                                    className="group"
                                >
                                    <Card className="bg-[#171717] border-white/5 hover:border-primary/20 transition-all duration-300 overflow-hidden h-full flex flex-col">
                                        <div className="relative aspect-square overflow-hidden bg-black/40">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                                            />
                                            <div className="absolute top-4 right-4">
                                                {product.status === 'in_stock' && (
                                                    <Badge className="bg-emerald-400 text-black border-none font-black text-[8px] uppercase tracking-widest">En Stock</Badge>
                                                )}
                                                {product.status === 'low_stock' && (
                                                    <Badge className="bg-amber-400 text-black border-none font-black text-[8px] uppercase tracking-widest">Stock Faible</Badge>
                                                )}
                                                {product.status === 'out_of_stock' && (
                                                    <Badge className="bg-red-500 text-white border-none font-black text-[8px] uppercase tracking-widest">Rupture</Badge>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <Button className="w-full bg-white text-black font-black uppercase text-[9px] tracking-widest h-9 rounded-xl">
                                                    Éditer le produit
                                                </Button>
                                            </div>
                                        </div>
                                        <CardContent className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest opacity-60">{product.category}</span>
                                                    <div className="flex items-center gap-1">
                                                        <ShoppingBag className="h-3 w-3 text-muted-foreground" />
                                                        <span className="text-[10px] font-bold text-muted-foreground">{product.sales} ventes</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-black text-sm uppercase tracking-tight text-white mb-2">{product.name}</h4>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-black">{product.price}</span>
                                                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">HT</span>
                                                </div>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter opacity-40">Stock actuel</span>
                                                    <span className={`text-[11px] font-black ${product.stock < 10 ? 'text-amber-400' : 'text-white'}`}>{product.stock} unités</span>
                                                </div>
                                                <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all">
                                                    <ExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <div className="h-20" />
                    </div>
                </div>
            </main>
        </div>
    );
}
