#!/usr/bin/env python3
"""
Test rapide des blocs gpt_analyze et sentiment via l'API
"""

import asyncio
import httpx
import json

async def test_blocks():
    print("=" * 60)
    print("🧪 TEST DES BLOCS ANALYSE INTENTION & SENTIMENT")
    print("=" * 60)
    
    # Messages de test
    test_cases = [
        ("C'est inadmissible ! 3 jours d'attente !!!", "plainte"),
        ("Bonjour, quel est le prix du forfait ?", "question_prix"),
        ("Merci beaucoup, vous êtes super !", "remerciement"),
    ]
    
    async with httpx.AsyncClient() as client:
        for message, expected_intent in test_cases:
            print(f"\n{'─' * 60}")
            print(f"📩 Message: \"{message}\"")
            print(f"📌 Intention attendue: {expected_intent}")
            
            # Test bloc gpt_analyze
            payload = {
                "nodes": [{
                    "id": "test_1",
                    "type": "gpt_analyze",
                    "name": "Test Analyse",
                    "config": "{}"
                }],
                "context": {
                    "lastUserMessage": message
                }
            }
            
            try:
                response = await client.post(
                    "http://localhost:8000/execute",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    output = result.get("results", [{}])[0].get("output", {})
                    print(f"\n✅ RÉSULTAT gpt_analyze:")
                    print(f"   • Intention: {output.get('intent', 'N/A')} ({output.get('intent_confidence', 0):.0%})")
                    print(f"   • Sentiment: {output.get('sentiment', 'N/A')} (score: {output.get('sentiment_score', 0):.2f})")
                    print(f"   • Urgence: {output.get('urgency', 'N/A')}/5")
                    print(f"   • Auto-résolvable: {'Oui' if output.get('auto_resolvable') else 'Non'}")
                    print(f"   • Action: {output.get('suggested_action', 'N/A')}")
                else:
                    print(f"❌ Erreur: {response.status_code}")
                    print(response.text)
                    
            except Exception as e:
                print(f"❌ Erreur: {e}")
            
            # Test bloc sentiment séparé
            payload_sentiment = {
                "nodes": [{
                    "id": "test_2",
                    "type": "sentiment",
                    "name": "Test Sentiment",
                    "config": json.dumps({"detectEmotions": True, "detectTone": True})
                }],
                "context": {
                    "lastUserMessage": message
                }
            }
            
            try:
                response = await client.post(
                    "http://localhost:8000/execute",
                    json=payload_sentiment,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    output = result.get("results", [{}])[0].get("output", {})
                    print(f"\n✅ RÉSULTAT sentiment:")
                    print(f"   • Sentiment: {output.get('sentiment', 'N/A')}")
                    print(f"   • Score: {output.get('sentiment_score', 0):.2f}")
                    print(f"   • Émotions: {', '.join(output.get('emotions', []))}")
                    print(f"   • Ton: {output.get('tone', 'N/A')}")
                else:
                    print(f"❌ Erreur sentiment: {response.status_code}")
                    
            except Exception as e:
                print(f"❌ Erreur sentiment: {e}")
    
    print(f"\n{'=' * 60}")
    print("✅ Tests terminés !")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_blocks())
