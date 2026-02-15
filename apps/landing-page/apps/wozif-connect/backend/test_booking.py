import asyncio
import sys
import os

# Ajouter le dossier parent au path pour l'import de app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.executor import WorkflowExecutor

# Mock Node class
class Node:
    def __init__(self, id, type, name, config):
        self.id = id
        self.type = type
        self.name = name
        self.config = config

async def test_booking_workflow():
    print("\n--- TEST WORKFLOW RENDEZ-VOUS ---\n")
    
    # 1. Analyse de l'intention (Client veut un RDV)
    # 2. Vérification des disponibilités
    # 3. Réponse avec créneaux
    # 4. Réservation (si choisi)
    
    nodes = [
        Node(1, "gpt_analyze", "Analyse Intention", '{"typeValues": "reservation|autre"}'),
        Node(2, "check_availability", "Vérifier Dispo", '{"duration": 30}'),
        Node(3, "send_text", "Proposer Créneaux", '{"text": "Voici nos créneaux :\\n{{formatted_slots}}"}'),
        Node(4, "book_appointment", "Réserver", '{"title": "Consultation Experts"}')
    ]
    
    context = {
        "lastUserMessage": "Bonjour, j'aimerais prendre un rendez-vous pour demain svp.",
        "userName": "Yohan"
    }
    
    executor = WorkflowExecutor(nodes, context)
    print(f"Message utilisateur: {context['lastUserMessage']}")
    
    result = await executor.run()
    
    print("\n--- RÉSULTATS DE L'EXÉCUTION ---\n")
    for res in result["results"]:
        status = "✅" if res.get("success") else "❌"
        print(f"{status} {res.get('message')}")
        if "output" in res:
            print(f"   Output: {res['output']}\n")

if __name__ == "__main__":
    asyncio.run(test_booking_workflow())
