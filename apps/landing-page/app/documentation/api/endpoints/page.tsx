'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function APIEndpointsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Endpoints</h1>
                <p className={styles.sectionSubtitle}>
                    Liste complète des endpoints disponibles dans l&apos;API Connect AI.
                    Tous les endpoints nécessitent une authentification par clé API.
                </p>

                <h3 className={styles.h3}>Chat / Complétion IA</h3>
                <p className={styles.prose}>
                    L&apos;endpoint principal pour interagir avec les modèles IA. Compatible avec le format OpenAI.
                </p>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Méthode</th>
                            <th>Endpoint</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/openai</code></td>
                            <td>Chat avec les modèles OpenAI (GPT-4o, GPT-4o-mini, etc.)</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/anthropic</code></td>
                            <td>Chat avec les modèles Anthropic (Claude) — Pro+ requis</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/google</code></td>
                            <td>Chat avec les modèles Google (Gemini)</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/deepseek</code></td>
                            <td>Chat avec les modèles DeepSeek</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/openrouter</code></td>
                            <td>Chat via OpenRouter (accès à 100+ modèles)</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/webapi/chat/groq</code></td>
                            <td>Chat avec les modèles Groq (Llama, Mixtral)</td>
                        </tr>
                    </tbody>
                </table>

                <h4 className={styles.h4}>Corps de la requête (Chat)</h4>
                <div className={styles.codeBlock}>
{`{
  "model": "gpt-4o-mini",        // Modèle à utiliser
  "messages": [                    // Historique de conversation
    {
      "role": "system",            // Optionnel : instructions système
      "content": "Tu es un assistant utile."
    },
    {
      "role": "user",              // Message de l'utilisateur
      "content": "Explique-moi le machine learning."
    }
  ],
  "temperature": 0.7,             // Optionnel : créativité (0-2, défaut: 1)
  "max_tokens": 1000,             // Optionnel : longueur max de la réponse
  "stream": true                   // Optionnel : streaming (défaut: true)
}`}
                </div>

                <h4 className={styles.h4}>Modèles disponibles et coûts</h4>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Modèle</th>
                            <th>Provider</th>
                            <th>Coût / message</th>
                            <th>Accès</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>gpt-4o-mini</td><td>openai</td><td>1 crédit ($0.01)</td><td>Tous</td></tr>
                        <tr><td>gpt-4o</td><td>openai</td><td>3 crédits ($0.03)</td><td>Tous</td></tr>
                        <tr><td>gemini-2.0-flash</td><td>google</td><td>1 crédit ($0.01)</td><td>Tous</td></tr>
                        <tr><td>gemini-1.5-pro</td><td>google</td><td>2 crédits ($0.02)</td><td>Tous</td></tr>
                        <tr><td>deepseek-chat</td><td>deepseek</td><td>1 crédit ($0.01)</td><td>Tous</td></tr>
                        <tr><td>deepseek-reasoner</td><td>deepseek</td><td>2 crédits ($0.02)</td><td>Tous</td></tr>
                        <tr><td>openai/gpt-4.1</td><td>openrouter</td><td>5 crédits ($0.05)</td><td>Tous</td></tr>
                        <tr><td>openai/o3</td><td>openrouter</td><td>10 crédits ($0.10)</td><td>Tous</td></tr>
                        <tr><td>google/gemini-2.5-pro</td><td>openrouter</td><td>5 crédits ($0.05)</td><td>Tous</td></tr>
                        <tr><td>deepseek/deepseek-r1</td><td>openrouter</td><td>3 crédits ($0.03)</td><td>Tous</td></tr>
                        <tr><td>claude-3-5-sonnet-20241022</td><td>anthropic</td><td>5 crédits ($0.05)</td><td>Pro+</td></tr>
                        <tr><td>claude-3-opus-20240229</td><td>anthropic</td><td>20 crédits ($0.20)</td><td>Pro+</td></tr>
                    </tbody>
                </table>

                <h3 className={styles.h3}>Crédits</h3>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Méthode</th>
                            <th>Endpoint</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code style={{ color: '#3b82f6', fontWeight: 700 }}>GET</code></td>
                            <td><code>/api/subscription/credits</code></td>
                            <td>Consulter le solde de crédits, l&apos;utilisation et le plan actuel</td>
                        </tr>
                    </tbody>
                </table>

                <h4 className={styles.h4}>Exemple de réponse (Crédits)</h4>
                <div className={styles.codeBlock}>
{`{
  "plan": "Starter",
  "used": 245,
  "remaining": 1255,
  "limit": 1500,
  "topUp": 0,
  "usedDollars": "$2.45",
  "remainingDollars": "$12.55",
  "creditValueDollars": "$15.00",
  "periodStart": "2026-02-01T00:00:00.000Z",
  "periodEnd": "2026-03-03T00:00:00.000Z"
}`}
                </div>

                <h3 className={styles.h3}>Agents</h3>
                <p className={styles.prose}>
                    Les endpoints agents utilisent le protocole tRPC. Voici les principaux :
                </p>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Méthode</th>
                            <th>Endpoint</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code style={{ color: '#3b82f6', fontWeight: 700 }}>GET</code></td>
                            <td><code>/trpc/lambda/agent.getAgents</code></td>
                            <td>Lister tous vos agents</td>
                        </tr>
                        <tr>
                            <td><code style={{ color: '#22c55e', fontWeight: 700 }}>POST</code></td>
                            <td><code>/api/agent</code></td>
                            <td>Exécuter un agent (envoyer un message à un agent spécifique)</td>
                        </tr>
                    </tbody>
                </table>

                <h4 className={styles.h4}>Exécuter un agent</h4>
                <div className={styles.codeBlock}>
{`curl -X POST https://app.connect.wozif.com/api/agent \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer lb-votre-cle-api" \\
  -d '{
    "agentId": "agent_abc123",
    "message": "Quel est le statut de ma commande #5678 ?"
  }'`}
                </div>

                <h3 className={styles.h3}>Réponses en streaming</h3>
                <p className={styles.prose}>
                    Par défaut, l&apos;endpoint de chat retourne une réponse en streaming (Server-Sent Events).
                    Cela permet d&apos;afficher la réponse de l&apos;IA en temps réel, mot par mot.
                </p>
                <p className={styles.prose}>
                    Le format de streaming suit le standard OpenAI SSE :
                </p>
                <div className={styles.codeBlock}>
{`data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":"Bonjour"},"index":0}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":" !"},"index":0}]}

data: {"id":"chatcmpl-xxx","choices":[{"delta":{"content":" Comment"},"index":0}]}

data: [DONE]`}
                </div>
            </section>

            <DocNavFooter
                prev={{ label: 'Authentification', href: '/documentation/api/authentication' }}
                next={{ label: 'Exemples d\'intégration', href: '/documentation/api/examples' }}
            />
        </>
    );
}
