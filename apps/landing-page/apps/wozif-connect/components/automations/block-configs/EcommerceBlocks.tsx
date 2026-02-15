"use client";

import React from "react";
import { BlockConfigProps, parseConfig } from "./types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Package, Grid } from "lucide-react";

// Bloc Show Catalog
export function ShowCatalogConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    category: "all",
    layout: "grid",
    maxProducts: 10,
    showPrices: true,
    currency: "XOF",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Grid className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Afficher Catalogue</h4>
            <p className="text-[10px] text-purple-400/60">Présenter les produits</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Catégorie
          </label>
          <select
            value={config.category}
            onChange={(e) => updateConfig({ ...config, category: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="all">Toutes les catégories</option>
            <option value="featured">Produits vedettes</option>
            <option value="new">Nouveautés</option>
            <option value="promo">En promotion</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Affichage
            </label>
            <select
              value={config.layout}
              onChange={(e) => updateConfig({ ...config, layout: e.target.value })}
              className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
            >
              <option value="grid">Grille</option>
              <option value="list">Liste</option>
              <option value="carousel">Carrousel</option>
            </select>
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Max produits
            </label>
            <Input
              type="number"
              min={1}
              max={50}
              value={config.maxProducts}
              onChange={(e) => updateConfig({ ...config, maxProducts: parseInt(e.target.value) || 10 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Afficher les prix</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showPrices}
              onChange={(e) => updateConfig({ ...config, showPrices: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-purple-500"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Add to Cart
export function AddToCartConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    productId: "",
    quantity: 1,
    variant: "",
    showConfirmation: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Ajouter au Panier</h4>
            <p className="text-[10px] text-emerald-400/60">Gérer le panier client</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID du produit
          </label>
          <Input
            value={config.productId}
            onChange={(e) => updateConfig({ ...config, productId: e.target.value })}
            placeholder="{{product_id}} ou ID fixe"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Quantité
            </label>
            <Input
              type="number"
              min={1}
              value={config.quantity}
              onChange={(e) => updateConfig({ ...config, quantity: parseInt(e.target.value) || 1 })}
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
          <div>
            <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
              Variante
            </label>
            <Input
              value={config.variant}
              onChange={(e) => updateConfig({ ...config, variant: e.target.value })}
              placeholder="Taille, couleur..."
              className="mt-1 bg-black/40 border-white/10 h-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Bloc Checkout
export function CheckoutConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    gateway: "moneroo",
    apiKey: "",
    successUrl: "",
    failureUrl: "",
    testMode: true,
    currency: "XOF",
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Paiement</h4>
            <p className="text-[10px] text-green-400/60">Traiter le paiement</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Passerelle de paiement
          </label>
          <select
            value={config.gateway}
            onChange={(e) => updateConfig({ ...config, gateway: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="moneroo">Moneroo</option>
            <option value="cinetpay">CinetPay</option>
            <option value="wave">Wave</option>
            <option value="orange_money">Orange Money</option>
            <option value="mtn_momo">MTN MoMo</option>
          </select>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Clé API
          </label>
          <Input
            type="password"
            value={config.apiKey}
            onChange={(e) => updateConfig({ ...config, apiKey: e.target.value })}
            placeholder="Votre clé API..."
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            Devise
          </label>
          <select
            value={config.currency}
            onChange={(e) => updateConfig({ ...config, currency: e.target.value })}
            className="w-full mt-1 bg-black/40 border border-white/10 rounded-xl h-10 text-xs px-3 text-white"
          >
            <option value="XOF">XOF (Franc CFA)</option>
            <option value="XAF">XAF (Franc CFA Central)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="USD">USD (Dollar)</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 rounded-xl bg-black/20">
          <span className="text-[10px] text-white/70">Mode test</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.testMode}
              onChange={(e) => updateConfig({ ...config, testMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-green-500"></div>
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Bloc Order Status
export function OrderStatusConfig({ node, updateConfig }: BlockConfigProps) {
  const config = parseConfig(node.config, {
    orderId: "{{order_id}}",
    includeTracking: true,
    includeItems: true,
  });

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Package className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Statut Commande</h4>
            <p className="text-[10px] text-blue-400/60">Vérifier une commande</p>
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold uppercase text-muted-foreground/60">
            ID de commande
          </label>
          <Input
            value={config.orderId}
            onChange={(e) => updateConfig({ ...config, orderId: e.target.value })}
            placeholder="{{order_id}}"
            className="mt-1 bg-black/40 border-white/10 h-10"
          />
        </div>

        <div className="space-y-2">
          {[
            { key: "includeTracking", label: "Inclure suivi livraison" },
            { key: "includeItems", label: "Lister les articles" },
          ].map((opt) => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-xl bg-black/20">
              <span className="text-[10px] text-white/70">{opt.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config[opt.key as keyof typeof config] as boolean}
                  onChange={(e) => updateConfig({ ...config, [opt.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-700 rounded-full peer peer-checked:bg-blue-500"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
