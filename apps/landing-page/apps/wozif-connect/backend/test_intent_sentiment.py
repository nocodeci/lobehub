#!/usr/bin/env python3
"""
Script de test pour la détection d'intention et de sentiment
Wozif Connect - Automation Engine
"""

import asyncio
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")

# Initialisation du LLM
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)


async def analyze_message(message: str) -> dict:
    """
    Analyse un message client pour détecter:
    - L'intention (ce que le client veut)
    - Le sentiment (comment il se sent)
    - L'urgence
    - Si c'est auto-résolvable
    """
    
    prompt = ChatPromptTemplate.from_template("""
Tu es un expert en analyse de messages clients pour un service WhatsApp.
Analyse le message suivant et retourne UNIQUEMENT un JSON valide.

MESSAGE DU CLIENT:
"{message}"

RETOURNE UN JSON avec ces champs:
{{
    "intent": "salutation|question_prix|demande_produit|plainte|remerciement|demande_aide|commande|annulation|autre",
    "intent_confidence": 0.0 à 1.0,
    "sentiment": "très_positif|positif|neutre|négatif|très_négatif",
    "sentiment_score": -1.0 à 1.0,
    "urgency": 1 à 5,
    "emotions": ["joie", "frustration", "colère", "satisfaction", etc.],
    "auto_resolvable": true/false,
    "keywords": ["mot1", "mot2"],
    "suggested_action": "répondre poliment|transférer humain|proposer catalogue|etc.",
    "response_tone": "amical|formel|empathique|apologétique"
}}

JSON:""")
    
    chain = prompt | llm | JsonOutputParser()
    
    try:
        result = await chain.ainvoke({"message": message})
        return result
    except Exception as e:
        print(f"❌ Erreur parsing JSON: {e}")
        return {"error": str(e)}


async def generate_response(message: str, analysis: dict) -> str:
    """
    Génère une réponse adaptée basée sur l'analyse
    """
    
    prompt = ChatPromptTemplate.from_template("""
Tu es un assistant WhatsApp professionnel pour une entreprise.

MESSAGE DU CLIENT: "{message}"

ANALYSE:
- Intention: {intent}
- Sentiment: {sentiment} (score: {sentiment_score})
- Urgence: {urgency}/5
- Ton recommandé: {response_tone}
- Action suggérée: {suggested_action}

RÈGLES:
1. Sois concis (2-3 phrases max)
2. Utilise des emojis appropriés
3. Adapte ton ton au sentiment détecté
4. Si le sentiment est négatif, sois empathique
5. Si c'est urgent, montre que tu prends ça au sérieux

RÉPONSE WHATSAPP:""")
    
    chain = prompt | llm
    
    result = await chain.ainvoke({
        "message": message,
        "intent": analysis.get("intent", "autre"),
        "sentiment": analysis.get("sentiment", "neutre"),
        "sentiment_score": analysis.get("sentiment_score", 0),
        "urgency": analysis.get("urgency", 3),
        "response_tone": analysis.get("response_tone", "amical"),
        "suggested_action": analysis.get("suggested_action", "répondre")
    })
    
    return result.content


async def test_automation():
    """
    Test complet de l'automatisation intention + sentiment
    """
    
    print("=" * 60)
    print("🤖 WOZIF CONNECT - Test Détection Intention & Sentiment")
    print("=" * 60)
    
    # Messages de test variés
    test_messages = [
        "Bonjour ! Je cherche des informations sur vos produits",
        "C'est quoi le prix de votre forfait premium ?",
        "Merci beaucoup pour votre aide, vous êtes super !",
        "C'est inadmissible ! Ça fait 3 jours que j'attends ma commande et toujours rien !!!",
        "J'ai un problème avec mon compte, il ne fonctionne plus",
        "Ok parfait, je confirme ma commande",
        "Annulez tout, je ne veux plus rien",
        "Salut",
        "Je voudrais commander 5 unités du produit A stp"
    ]
    
    for i, message in enumerate(test_messages, 1):
        print(f"\n{'─' * 60}")
        print(f"📩 TEST {i}/{len(test_messages)}")
        print(f"{'─' * 60}")
        print(f"💬 Client: \"{message}\"")
        print()
        
        # 1. Analyse du message
        print("🔍 Analyse en cours...")
        analysis = await analyze_message(message)
        
        if "error" in analysis:
            print(f"❌ Erreur: {analysis['error']}")
            continue
        
        # Affichage des résultats
        print(f"📊 RÉSULTATS:")
        print(f"   • Intention: {analysis.get('intent', 'N/A')} ({analysis.get('intent_confidence', 0):.0%})")
        print(f"   • Sentiment: {analysis.get('sentiment', 'N/A')} (score: {analysis.get('sentiment_score', 0):.2f})")
        print(f"   • Urgence: {'🔴' * analysis.get('urgency', 1)}{'⚪' * (5 - analysis.get('urgency', 1))} ({analysis.get('urgency', 1)}/5)")
        print(f"   • Émotions: {', '.join(analysis.get('emotions', []))}")
        print(f"   • Auto-résolvable: {'✅ Oui' if analysis.get('auto_resolvable') else '❌ Non'}")
        print(f"   • Action: {analysis.get('suggested_action', 'N/A')}")
        print(f"   • Ton: {analysis.get('response_tone', 'N/A')}")
        print()
        
        # 2. Génération de la réponse
        print("💡 Génération de la réponse...")
        response = await generate_response(message, analysis)
        print(f"🤖 Bot: {response}")
    
    print(f"\n{'=' * 60}")
    print("✅ Tests terminés !")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_automation())
