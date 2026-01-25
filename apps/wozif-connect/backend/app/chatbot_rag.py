from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader
import os
import json
import httpx
import asyncio
from typing import List, Dict, Any
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

class MCPClient:
    """Client léger pour communiquer avec des serveurs MCP via SSE/HTTP"""
    def __init__(self, endpoint: str):
        self.endpoint = endpoint.rstrip('/')
        
    async def get_tools(self) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(f"{self.endpoint}/tools")
                if response.status_code == 200:
                    return response.json().get("tools", [])
        except Exception as e:
            print(f"Erreur MCP List Tools: {str(e)}")
        return []

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Any:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    f"{self.endpoint}/call", 
                    json={"name": tool_name, "arguments": arguments}
                )
                if response.status_code == 200:
                    return response.json().get("result")
                return f"Erreur MCP ({response.status_code}): {response.text}"
        except Exception as e:
            print(f"Erreur MCP Call Tool: {str(e)}")
            return f"Erreur lors de l'appel à l'outil {tool_name}: {str(e)}"

load_dotenv(dotenv_path="../.env.local")

class WhatsAppChatbot:
    def __init__(self):
        # Initialisation du LLM
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.embeddings = OpenAIEmbeddings()
        self.vector_store = None
        self.retriever = None
        
        # Charger la base de connaissances
        self._initialize_knowledge()

    def _initialize_knowledge(self):
        knowledge_path = "knowledge.txt"
        if not os.path.exists(knowledge_path):
            print("Erreur: knowledge.txt introuvable")
            return

        with open(knowledge_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Simple découpage par paragraphe pour cet exemple
        texts = [p.strip() for p in content.split("\n\n") if p.strip()]
        
        # Création du magasin de vecteurs local (FAISS)
        self.vector_store = FAISS.from_texts(texts, self.embeddings)
        self.retriever = self.vector_store.as_retriever(search_kwargs={"k": 2})
        print("✅ Base de connaissances chargée et indexée.")

    async def ask_with_sources(self, question: str, instructions: str, urls: list = None, files: list = None, mcp_endpoints: list = None):
        # 1. Charger le contexte des URLs et Fichiers
        context_data = ""
        
        # Gestion des URLs
        if urls:
            try:
                loader = WebBaseLoader(web_paths=urls)
                docs = loader.load()
                context_data += "\n\n--- DONNÉES WEB ---\n" + "\n\n".join([doc.page_content for doc in docs])
            except Exception as e:
                print(f"Erreur chargement URL: {str(e)}")

        # Gestion des Fichiers (PDF)
        if files:
            for file_path in files:
                if not file_path or not os.path.exists(file_path): continue
                try:
                    loader = PyPDFLoader(file_path)
                    pages = loader.load_and_split()
                    context_data += f"\n\n--- DOCUMENT: {os.path.basename(file_path)} ---\n"
                    context_data += "\n\n".join([page.page_content for page in pages])
                except Exception as e:
                    print(f"Erreur chargement PDF ({file_path}): {str(e)}")

        # 2. Gestion des outils MCP & Conversion en outils d'agent
        tools_map = {}
        if mcp_endpoints:
            for endpoint in mcp_endpoints:
                client = MCPClient(endpoint)
                mcp_tools = await client.get_tools()
                for t in mcp_tools:
                    name = t.get('name')
                    tools_map[name] = {
                        "client": client,
                        "description": t.get('description'),
                        "parameters": t.get('inputSchema', t.get('parameters', {}))
                    }
                    available_tools_info += f"- Outil: {name} | Description: {t.get('description')}\n"

        # 3. Préparer le prompt robuste
        prompt = ChatPromptTemplate.from_messages([
            ("system", f"{instructions}\n\nSOURCES :\n{context_data[:8000]}\n\nOUTILS DISPONIBLES :\n{available_tools_info if available_tools_info else 'Aucun'}\n\nIMPORTANT: Si un outil est nécessaire pour répondre (ex: vérifier un calendrier, envoyer un email), utilise-le avant de donner la réponse finale."),
            ("human", "{question}")
        ])
        
        # 4. Exécution avec gestion des outils (Loop simple)
        # Note: Pour une version plus complexe, utiliser LangGraph ou create_tool_calling_agent
        current_llm = self.llm
        if tools_map:
            # On informe le LLM des outils au format JSON pour qu'il puisse suggérer l'appel
            # Dans cette version simplifiée, on demande au LLM d'indiquer l'outil à appeler dans un format spécifique
            prompt = ChatPromptTemplate.from_template(f"""{instructions}
            
CONNAISSANCES (RAG):
{context_data[:10000]}

OUTILS MCP DISPONIBLES:
{available_tools_info}

RÈGLES:
1. Si tu as besoin d'un outil pour répondre, écris UNIQUEMENT: TOOL_CALL: {{"name": "nom_outil", "arguments": {{"arg": "val"}}}}
2. Si tu as toutes les infos pour répondre, donne la réponse finale au client.
3. Toujours répondre en français.

QUESTION DU CLIENT: {{question}}
RÉPONSE:""")

        chain = prompt | self.llm | StrOutputParser()
        response = await chain.ainvoke({"question": question})

        # 5. Gestion de l'appel d'outil (Boucle 1 itération pour l'instant)
        if "TOOL_CALL:" in response:
            try:
                call_json = response.split("TOOL_CALL:")[1].strip()
                call_data = json.loads(call_json)
                tool_name = call_data.get("name")
                args = call_data.get("arguments", {})
                
                if tool_name in tools_map:
                    print(f"🛠️ Appel de l'outil MCP: {tool_name}")
                    tool_result = await tools_map[tool_name]["client"].call_tool(tool_name, args)
                    
                    # Refaire un appel au LLM avec le résultat de l'outil
                    prompt_with_result = ChatPromptTemplate.from_template(f"""{instructions}
                    
RÉSULTAT DE L'OUTIL ({tool_name}):
{json.dumps(tool_result, indent=2, ensure_ascii=False)}

QUESTION INITIALE: {{question}}

En tenant compte du résultat ci-dessus, réponds au client de manière chaleureuse et professionnelle sur WhatsApp (utilise des emojis).""")
                    
                    final_chain = prompt_with_result | self.llm | StrOutputParser()
                    return await final_chain.ainvoke({"question": question})
            except Exception as e:
                print(f"Erreur tool execution: {str(e)}")
                return f"Désolé, j'ai rencontré une erreur technique en utilisant mes outils: {response}"

        return response

    async def ask_with_custom_knowledge(self, question: str, custom_content: str):
        if not custom_content:
            return self.ask(question)

        # Si le contenu est court (< 2000 caractères), on l'injecte directement dans le prompt
        # Sinon, on crée un index FAISS temporaire pour cette requête
        if len(custom_content) < 2000:
            prompt = ChatPromptTemplate.from_template("""
Tu es un assistant WhatsApp. Réponds en utilisant UNIQUEMENT les infos ci-dessous.
INFO ENTREPRISE:
{context}

QUESTION: {question}
RÉPONSE:""")
            chain = prompt | self.llm | StrOutputParser()
            return await chain.ainvoke({"context": custom_content, "question": question})
        else:
            # RAG Dynamique pour gros volumes de texte
            texts = [p.strip() for p in custom_content.split("\n\n") if p.strip()]
            temp_db = FAISS.from_texts(texts, self.embeddings)
            retriever = temp_db.as_retriever(search_kwargs={"k": 3})
            
            prompt = ChatPromptTemplate.from_template("""
Utilise les extraits suivants pour répondre à la question.
CONTEXTE:
{context}

QUESTION: {question}
RÉPONSE:""")
            chain = ({"context": retriever, "question": RunnablePassthrough()} | prompt | self.llm | StrOutputParser())
            return await chain.ainvoke(question)

    def ask(self, question: str):
        if not self.retriever:
            return "Désolé, ma base de connaissances n'est pas prête."

        template = """Tu es un assistant WhatsApp pour Wozif Connect. 
Réponds UNIQUEMENT en utilisant les informations fournies ci-dessous.
Si tu ne connais pas la réponse, dis-le poliment et propose au client de contacter le support à support@wozif.com.
Sois concis et utilise des emojis pour rendre la réponse agréable sur WhatsApp.

CONTEXTE:
{context}

QUESTION DU CLIENT:
{question}

RÉPONSE:"""
        
        prompt = ChatPromptTemplate.from_template(template)
        
        # Chaîne RAG
        chain = (
            {"context": self.retriever, "question": RunnablePassthrough()}
            | prompt
            | self.llm
            | StrOutputParser()
        )
        
        return chain.invoke(question)

# --- TEST LOCAL ---
if __name__ == "__main__":
    bot = WhatsAppChatbot()
    
    questions = [
        "C'est quoi Wozif Connect ?",
        "Quels sont vos tarifs ?",
        "Comment vous contacter ?",
        "Est-ce que vous vendez des pizzas ?" 
    ]
    
    for q in questions:
        print(f"\n❓ Client: {q}")
        response = bot.ask(q)
        print(f"🤖 Bot: {response}")
