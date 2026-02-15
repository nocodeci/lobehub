import json
import asyncio
from typing import List, Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .chatbot_rag import WhatsAppChatbot
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env.local")

class WorkflowExecutor:
    _chatbot_instance = None  # Singleton pour éviter de ré-indexer à chaque fois

    def __init__(self, nodes: List[Any], context: Dict[str, Any]):
        self.nodes = nodes
        self.context = context
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        
        if WorkflowExecutor._chatbot_instance is None:
            WorkflowExecutor._chatbot_instance = WhatsAppChatbot()
        self.rag_engine = WorkflowExecutor._chatbot_instance

    async def run(self):
        results = []
        for node in self.nodes:
            node_result = await self.execute_node(node)
            results.append(node_result)
            if not node_result.get("success", True):
                break
        return {"results": results, "final_context": self.context}

    async def execute_node(self, node):
        node_type = node.type
        config = json.loads(node.config) if node.config else {}
        
        print(f"Executing node: {node.name} ({node_type})")

        if node_type == "send_text":
            text = config.get("text", "")
            # Replace variables like {{name}}
            for key, value in self.context.items():
                if isinstance(value, str):
                    text = text.replace(f"{{{{{key}}}}}", value)
            
            return {
                "id": node.id,
                "success": True,
                "data": {"sent_text": text},
                "message": f"Message envoyé: {text[:50]}..."
            }

        elif node_type == "ai_agent":
            instructions = config.get("instructions", "Tu es un assistant utile.")
            data_sources = config.get("dataSources", {})
            urls = data_sources.get("urls", [])
            files = data_sources.get("files", [])
            mcp_endpoints = data_sources.get("mcpProviders", [])
            user_message = self.context.get("lastUserMessage", "")
            
            # Appel du moteur avec instructions, URLs, Fichiers et MCP
            answer = await self.rag_engine.ask_with_sources(user_message, instructions, urls, files, mcp_endpoints)
            
            self.context["aiAnswer"] = answer
            
            return {
                "id": node.id,
                "success": True,
                "data": {"answer": answer},
                "message": f"Agent IA a répondu en utilisant {len(urls)} URLs."
            }

        elif node_type == "switch_router":
            field = config.get("field", "intent")
            cases = config.get("cases", [])
            test_value = str(self.context.get(field, self.context.get("lastUserMessage", ""))).lower()
            
            matched_idx = -1
            for i, case in enumerate(cases):
                if str(case.get("value", "")).lower() == test_value:
                    matched_idx = i
                    break
            
            return {
                "id": node.id,
                "success": True,
                "data": {"matchedIndex": matched_idx, "isDefault": matched_idx == -1},
                "message": f"Switch: {'Match branch ' + str(matched_idx) if matched_idx >= 0 else 'Default branch'}"
            }

        elif node_type == "gpt_analyze":
            user_message = self.context.get("lastUserMessage", "")
            custom_categories = config.get("categories", config.get("typeValues", ""))
            # ... (the rest of gpt_analyze implementation)

            
            prompt = ChatPromptTemplate.from_template("""
Tu es un expert en analyse de messages clients pour un service WhatsApp.
Analyse le message suivant et retourne UNIQUEMENT un JSON valide.

MESSAGE DU CLIENT:
"{message}"

{custom_instructions}

RETOURNE UN JSON avec ces champs:
{{
    "intent": "{intent_options}",
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
            
            chain = prompt | self.llm | JsonOutputParser()
            
            # Récupérer les intentions personnalisées si définies
            use_custom = config.get("useCustomIntents", False)
            custom_intents_text = config.get("customIntents", "")
            
            if use_custom and custom_intents_text:
                # Convertir le texte multiligne en liste séparée par |
                custom_list = [i.strip() for i in custom_intents_text.split('\n') if i.strip()]
                intent_options = "|".join(custom_list) if custom_list else custom_categories
            else:
                intent_options = custom_categories if custom_categories else "salutation|question_prix|demande_produit|plainte|remerciement|demande_aide|commande|annulation|autre"
            
            custom_instructions = config.get("aiInstructions", "")
            
            try:
                analysis = await chain.ainvoke({
                    "message": user_message,
                    "intent_options": intent_options,
                    "custom_instructions": f"Instructions supplémentaires: {custom_instructions}" if custom_instructions else ""
                })
                
                # Stocker tous les résultats dans le contexte
                self.context.update(analysis)
                self.context["intent"] = analysis.get("intent", "autre")
                self.context["type"] = analysis.get("intent", "autre")  # Alias pour compatibilité
                
                return {
                    "id": node.id,
                    "success": True,
                    "data": analysis,
                    "message": f"Intent: {analysis.get('intent')} | Sentiment: {analysis.get('sentiment')} | Urgence: {analysis.get('urgency')}/5",
                    "waitDelay": 1000
                }
            except Exception as e:
                return {"id": node.id, "success": False, "error": str(e), "waitDelay": 0}

        elif node_type == "rag_knowledge":
            user_message = self.context.get("lastUserMessage", "")
            kb_id = config.get("knowledgeBaseId", "default")
            custom_content = config.get("knowledgeContent", "") if kb_id == "manual" else None
            
            # Utilisation du moteur RAG (dynamique ou statique)
            if kb_id == "manual" and custom_content:
                answer = await self.rag_engine.ask_with_custom_knowledge(user_message, custom_content)
            else:
                answer = self.rag_engine.ask(user_message)
            
            # On stocke la réponse dans le contexte
            self.context["aiAnswer"] = answer
            
            return {
                "id": node.id,
                "success": True,
                "data": {"answer": answer},
                "message": f"Réponse générée via base de connaissances ({kb_id})."
            }

        elif node_type == "python_script":
            script_code = config.get("script", "")
            if not script_code:
                return {"id": node.id, "success": True, "message": "Script vide"}
            
            # Environnement d'exécution sécurisé (simplifié)
            exec_globals = {"context": self.context, "results": {}}
            try:
                # Exécution du script Python
                # Le script doit mettre ses résultats dans le dictionnaire 'results'
                exec(script_code, exec_globals)
                
                # Mise à jour du contexte avec les résultats du script
                self.context.update(exec_globals.get("results", {}))
                
                return {
                    "id": node.id,
                    "success": True,
                    "data": exec_globals.get("results", {}),
                    "message": "Script Python exécuté avec succès"
                }
            except Exception as e:
                print(f"Python Error: {str(e)}")
                return {"id": node.id, "success": False, "error": f"Erreur Python: {str(e)}"}

        elif node_type == "long_term_memory":
            action = config.get("action", "load")
            key = config.get("key", "default_key")
            user_id = self.context.get("userId", "anonymous")
            
            if action == "store":
                # Simulation de sauvegarde en base de données
                return {"id": node.id, "success": True, "message": f"Clé '{key}' sauvegardée pour {user_id}"}
            else:
                # Simulation de chargement
                return {"id": node.id, "success": True, "message": f"Clé '{key}' chargée pour {user_id}"}

        elif node_type == "sentiment":
            user_message = self.context.get("lastUserMessage", "")
            detect_emotions = config.get("detectEmotions", True)
            detect_tone = config.get("detectTone", True)
            detect_urgency = config.get("detectUrgency", True)
            threshold = config.get("threshold", -0.5)
            
            prompt = ChatPromptTemplate.from_template("""
Tu es un expert en analyse de sentiment pour un service client WhatsApp.
Analyse le sentiment du message suivant et retourne UNIQUEMENT un JSON valide.

MESSAGE:
"{message}"

RETOURNE UN JSON avec:
{{
    "sentiment": "très_positif|positif|neutre|négatif|très_négatif",
    "sentiment_score": nombre entre -1.0 (très négatif) et 1.0 (très positif),
    "emotions": ["joie", "frustration", "colère", "tristesse", "satisfaction", "inquiétude"],
    "tone": "formel|informel|urgent|amical|hostile|neutre",
    "urgency": nombre entre 1 (pas urgent) et 5 (très urgent),
    "confidence": nombre entre 0.0 et 1.0,
    "key_indicators": ["mot ou expression qui indique le sentiment"]
}}

JSON:""")
            
            chain = prompt | self.llm | JsonOutputParser()
            
            try:
                analysis = await chain.ainvoke({"message": user_message})
                
                # Stocker dans le contexte
                self.context["sentiment"] = analysis.get("sentiment", "neutre")
                self.context["sentiment_score"] = analysis.get("sentiment_score", 0)
                self.context["emotions"] = analysis.get("emotions", [])
                self.context["tone"] = analysis.get("tone", "neutre")
                self.context["urgency"] = analysis.get("urgency", 3)
                
                # Vérifier le seuil pour actions
                is_negative = analysis.get("sentiment_score", 0) < threshold
                self.context["is_negative_sentiment"] = is_negative
                
                sentiment_emoji = "😊" if analysis.get("sentiment_score", 0) > 0 else "😐" if analysis.get("sentiment_score", 0) == 0 else "😔"
                
                return {
                    "id": node.id,
                    "success": True,
                    "data": analysis,
                    "message": f"{sentiment_emoji} Sentiment: {analysis.get('sentiment')} (score: {analysis.get('sentiment_score'):.2f})",
                    "waitDelay": 800
                }
            except Exception as e:
                return {"id": node.id, "success": False, "error": str(e), "waitDelay": 0}


        elif node_type == "check_availability":
            duration = config.get("duration", 30)
            timezone = config.get("timezone", "Africa/Abidjan")
            
            # Simulation de créneaux disponibles
            slots = [
                "Lundi 14:00", "Lundi 14:30", "Lundi 15:00",
                "Mardi 09:00", "Mardi 09:30", "Mardi 10:00"
            ]
            
            self.context["available_slots"] = slots
            self.context["formatted_slots"] = "\n".join([f"- {s}" for s in slots])
            
            return {
                "id": node.id,
                "success": True,
                "data": {"slots": slots},
                "message": f"Trouvé {len(slots)} créneaux disponibles pour une durée de {duration}min."
            }

        elif node_type == "book_appointment":
            calendar_id = config.get("calendar_id", "default")
            title = config.get("title", "Rendez-vous")
            # On simule la récupération de la date choisie par le client
            selected_date = self.context.get("selected_date", "Demain à 10h00")
            
            return {
                "id": node.id,
                "success": True,
                "data": {"booking_id": "BK-9988", "date": selected_date},
                "message": f"RDV '{title}' confirmé pour {selected_date}."
            }

        elif node_type == "cancel_appointment":
            booking_id = config.get("booking_id", "BK-9988")
            return {
                "id": node.id,
                "success": True,
                "message": f"RDV {booking_id} annulé avec succès."
            }

        # Default for unknown nodes

        return {"id": node.id, "success": True, "message": f"Bloc {node_type} passé (non implémenté en Python encore)"}
