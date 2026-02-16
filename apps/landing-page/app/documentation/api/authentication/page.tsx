'use client';

import React from 'react';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function APIAuthenticationPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Authentification</h1>
                <p className={styles.sectionSubtitle}>
                    Toutes les requêtes à l&apos;API Connect AI doivent être authentifiées avec une clé API
                    via le header HTTP <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: 4 }}>Authorization</code>.
                </p>

                <h3 className={styles.h3}>Header d&apos;authentification</h3>
                <p className={styles.prose}>
                    Incluez votre clé API dans chaque requête HTTP avec le format Bearer Token :
                </p>
                <div className={styles.codeBlock}>
{`Authorization: Bearer lb-votre-cle-api-ici`}
                </div>

                <h3 className={styles.h3}>Exemple complet</h3>
                <h4 className={styles.h4}>cURL</h4>
                <div className={styles.codeBlock}>
{`curl -X POST https://app.connect.wozif.com/webapi/chat/openai \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer lb-a1b2c3d4e5f6g7h8i9j0" \\
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {"role": "user", "content": "Bonjour !"}
    ]
  }'`}
                </div>

                <h4 className={styles.h4}>JavaScript (fetch)</h4>
                <div className={styles.codeBlock}>
{`const response = await fetch('https://app.connect.wozif.com/webapi/chat/openai', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${process.env.CONNECT_API_KEY}\`,
  },
  body: JSON.stringify({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'user', content: 'Bonjour !' }
    ],
  }),
});

// L'API retourne un stream de données
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}`}
                </div>

                <h4 className={styles.h4}>Python (requests)</h4>
                <div className={styles.codeBlock}>
{`import os
import requests

api_key = os.environ.get("CONNECT_API_KEY")

response = requests.post(
    "https://app.connect.wozif.com/webapi/chat/openai",
    headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}",
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "user", "content": "Bonjour !"}
        ],
    },
    stream=True,
)

for chunk in response.iter_content(chunk_size=None):
    print(chunk.decode(), end="", flush=True)`}
                </div>

                <h4 className={styles.h4}>PHP</h4>
                <div className={styles.codeBlock}>
{`<?php
$apiKey = getenv("CONNECT_API_KEY");

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => "https://app.connect.wozif.com/webapi/chat/openai",
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey,
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "model" => "gpt-4o-mini",
        "messages" => [
            ["role" => "user", "content" => "Bonjour !"]
        ],
    ]),
    CURLOPT_RETURNTRANSFER => true,
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`}
                </div>

                <h3 className={styles.h3}>Codes d&apos;erreur d&apos;authentification</h3>
                <table className={styles.planTable}>
                    <thead>
                        <tr>
                            <th>Code HTTP</th>
                            <th>Signification</th>
                            <th>Solution</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>401 Unauthorized</code></td>
                            <td>Clé API manquante ou invalide</td>
                            <td>Vérifiez que le header Authorization est présent et que la clé est correcte</td>
                        </tr>
                        <tr>
                            <td><code>403 Forbidden</code></td>
                            <td>Clé API désactivée ou permissions insuffisantes</td>
                            <td>Vérifiez que la clé est activée dans Paramètres → Développeur</td>
                        </tr>
                        <tr>
                            <td><code>429 Too Many Requests</code></td>
                            <td>Crédits épuisés</td>
                            <td>Rechargez vos crédits ou passez à un plan supérieur</td>
                        </tr>
                    </tbody>
                </table>

                <h3 className={styles.h3}>Compatibilité OpenAI</h3>
                <p className={styles.prose}>
                    L&apos;API Connect AI est compatible avec le format OpenAI. Si vous utilisez déjà le SDK OpenAI,
                    il suffit de changer l&apos;URL de base et la clé API :
                </p>
                <div className={styles.codeBlock}>
{`# Python avec le SDK OpenAI
from openai import OpenAI

client = OpenAI(
    api_key="lb-votre-cle-api",
    base_url="https://app.connect.wozif.com/webapi/chat",
)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": "Bonjour !"}
    ],
)

print(response.choices[0].message.content)`}
                </div>

                <div className={styles.codeBlock}>
{`// Node.js avec le SDK OpenAI
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.CONNECT_API_KEY,
  baseURL: 'https://app.connect.wozif.com/webapi/chat',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'user', content: 'Bonjour !' }
  ],
});

console.log(response.choices[0].message.content);`}
                </div>
            </section>

            <DocNavFooter
                prev={{ label: 'Clés API', href: '/documentation/api/keys' }}
                next={{ label: 'Endpoints', href: '/documentation/api/endpoints' }}
            />
        </>
    );
}
