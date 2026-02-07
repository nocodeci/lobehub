import json
import re

class AutomationBase:
    """Socle Python pour les automatisations Connect (Économie d'IA)"""
    
    @staticmethod
    def extract_order_id(text):
        """Extrait un ID de commande type #12345 (Gratuit, pas besoin d'IA)"""
        match = re.search(r'#(\d{4,6})', text)
        return match.group(1) if match else None

    @staticmethod
    def calculate_price_with_discount(price, discount_pct):
        """Logique de calcul mathématique (Gratuit)"""
        return price * (1 - (discount_pct / 100))

    @staticmethod
    def match_keywords(text, keywords):
        """Détection de mots-clés optimisée (Gratuit)"""
        text = text.lower()
        return [kw for kw in keywords if kw.lower() in text]

    @staticmethod
    def format_money(amount, currency="FCFA"):
        """Formatage de réponse (Gratuit)"""
        return f"{amount:,.0f} {currency}".replace(",", " ")

# Simulation de base de données de produits
PRODUCTS = [
    {"id": 1, "name": "iPhone 15 Pro", "price": 599000},
    {"id": 2, "name": "MacBook Air M3", "price": 899000},
    {"id": 3, "name": "iPad Pro M4", "price": 750000}
]

def get_product_by_name(query):
    query = query.lower()
    for p in PRODUCTS:
        if query in p["name"].lower():
            return p
    return None
