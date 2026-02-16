'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function APIExamplesPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Exemples d&apos;intégration</h1>
                <p className={styles.sectionSubtitle}>
                    Exemples concrets pour intégrer l&apos;API Connect AI dans différents contextes :
                    chatbot web, bot Telegram, automatisation, et plus.
                </p>

                <h3 className={styles.h3}>1. Chatbot sur un site web (Next.js)</h3>
                <p className={styles.prose}>
                    Créez un chatbot IA sur votre site web avec Next.js. Le backend proxy protège votre clé API.
                </p>
                <h4 className={styles.h4}>API Route (app/api/chat/route.ts)</h4>
                <div className={styles.codeBlock}>
{`// app/api/chat/route.ts
export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await fetch(
    'https://app.connect.wozif.com/webapi/chat/openai',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.CONNECT_API_KEY}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Tu es l\\'assistant du site web de mon entreprise. Réponds en français.'
          },
          { role: 'user', content: message }
        ],
      }),
    }
  );

  // Retransmettre le stream au client
  return new Response(response.body, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}`}
                </div>

                <h4 className={styles.h4}>Composant React (ChatWidget.tsx)</h4>
                <div className={styles.codeBlock}>
{`'use client';
import { useState } from 'react';

export default function ChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let aiResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      aiResponse += decoder.decode(value);
    }

    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <div style={{ height: 400, overflowY: 'auto', padding: 16 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.role === 'user' ? 'right' : 'left',
            marginBottom: 8,
          }}>
            <span style={{
              background: msg.role === 'user' ? '#075e54' : '#f0f0f0',
              color: msg.role === 'user' ? '#fff' : '#333',
              padding: '8px 12px',
              borderRadius: 12,
              display: 'inline-block',
            }}>
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Posez votre question..."
          style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd' }}
        />
        <button onClick={sendMessage} disabled={loading}
          style={{ padding: '12px 20px', background: '#075e54', color: '#fff', borderRadius: 8, border: 'none' }}>
          Envoyer
        </button>
      </div>
    </div>
  );
}`}
                </div>

                <h3 className={styles.h3}>2. Bot Telegram (Node.js)</h3>
                <p className={styles.prose}>
                    Créez un bot Telegram qui utilise Connect AI pour répondre aux messages.
                </p>
                <div className={styles.codeBlock}>
{`// bot.js
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userMessage = msg.text;

  try {
    const response = await fetch(
      'https://app.connect.wozif.com/webapi/chat/openai',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.CONNECT_API_KEY}\`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un assistant Telegram. Sois concis.' },
            { role: 'user', content: userMessage },
          ],
          stream: false,
        }),
      }
    );

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Désolé, une erreur est survenue.';
    bot.sendMessage(chatId, reply);
  } catch (error) {
    bot.sendMessage(chatId, 'Erreur de connexion à l\\'IA.');
  }
});

console.log('Bot Telegram démarré !');`}
                </div>

                <h3 className={styles.h3}>3. Automatisation avec Python</h3>
                <p className={styles.prose}>
                    Exemple : analyser automatiquement des avis clients et générer un résumé.
                </p>
                <div className={styles.codeBlock}>
{`import os
import requests
import json

API_KEY = os.environ.get("CONNECT_API_KEY")
BASE_URL = "https://app.connect.wozif.com/webapi/chat/openai"

def analyze_reviews(reviews: list[str]) -> str:
    """Analyse une liste d'avis clients et génère un résumé."""
    reviews_text = "\\n".join(f"- {r}" for r in reviews)

    response = requests.post(
        BASE_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}",
        },
        json={
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "system",
                    "content": "Tu es un analyste. Analyse les avis clients et donne : "
                               "1) Sentiment général, 2) Points positifs, "
                               "3) Points négatifs, 4) Recommandations."
                },
                {
                    "role": "user",
                    "content": f"Voici les avis clients :\\n{reviews_text}"
                },
            ],
            "stream": False,
        },
    )

    data = response.json()
    return data["choices"][0]["message"]["content"]


# Exemple d'utilisation
avis = [
    "Super produit, livraison rapide !",
    "Qualité moyenne, l'emballage était abîmé.",
    "Excellent rapport qualité-prix, je recommande.",
    "Le service client a mis 3 jours à répondre...",
    "Très satisfait, conforme à la description.",
]

resultat = analyze_reviews(avis)
print(resultat)`}
                </div>

                <h3 className={styles.h3}>4. Vérifier ses crédits</h3>
                <p className={styles.prose}>
                    Avant d&apos;envoyer des requêtes, vérifiez votre solde de crédits :
                </p>
                <div className={styles.codeBlock}>
{`# Vérifier le solde de crédits
curl -s https://app.connect.wozif.com/api/subscription/credits \\
  -H "Authorization: Bearer lb-votre-cle-api" | python3 -m json.tool

# Réponse :
# {
#   "plan": "Starter",
#   "remaining": 1255,
#   "remainingDollars": "$12.55",
#   "used": 245,
#   ...
# }`}
                </div>

                <h3 className={styles.h3}>5. Gestion d&apos;erreurs</h3>
                <p className={styles.prose}>
                    Toujours gérer les erreurs dans vos intégrations :
                </p>
                <div className={styles.codeBlock}>
{`async function callConnectAI(message: string) {
  try {
    const response = await fetch(
      'https://app.connect.wozif.com/webapi/chat/openai',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${process.env.CONNECT_API_KEY}\`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: message }],
        }),
      }
    );

    if (response.status === 401) {
      throw new Error('Clé API invalide. Vérifiez votre clé.');
    }
    if (response.status === 429) {
      throw new Error('Crédits épuisés. Rechargez sur /credits.');
    }
    if (!response.ok) {
      throw new Error(\`Erreur API: \${response.status}\`);
    }

    return response;
  } catch (error) {
    console.error('Erreur Connect AI:', error.message);
    throw error;
  }
}`}
                </div>

                <h3 className={styles.h3}>Besoin d&apos;aide ?</h3>
                <div className={styles.featureGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>💬</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Support</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Contactez-nous à <a href="mailto:support@wozif.com" style={{ color: '#075e54' }}>support@wozif.com</a> pour
                            toute question technique.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📖</div>
                        <h4 style={{ fontWeight: 700, marginBottom: 4 }}>Documentation</h4>
                        <p style={{ color: '#666', fontSize: 14 }}>
                            Consultez les autres sections de cette documentation pour en savoir plus sur les agents,
                            WhatsApp, et les abonnements.
                        </p>
                    </div>
                </div>
            </section>

            <DocNavFooter
                prev={{ label: 'Endpoints', href: '/documentation/api/endpoints' }}
                next={{ label: 'Plans disponibles', href: '/documentation/subscription' }}
            />
        </>
    );
}
