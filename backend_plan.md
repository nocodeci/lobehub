# Plan d'Implémentation Backend - AfriFlow Orchestrator (Next.js)

## 🎯 Objectif
Développer une architecture backend intégrée à Next.js, capable d'orchestrer les paiements africains de manière robuste, asynchrone et sécurisée.

## 🏗️ Stack Technique
- **Framework**: Next.js 15+ (App Router)
- **APIs**: Route Handlers (Edge & Node.js Runtime)
- **Logic**: Server Actions & Server Components
- **Base de Données**: PostgreSQL avec **Prisma** ou **Drizzle** ORM
- **Cache / Queues**: Redis (Upstash pour le serverless ou Redis local)
- **Validation**: Zod (Typage strict des payloads)

## 🛠️ Phases de Développement

### Phase 1 : Infrastructure de Données
- [ ] Configuration de Prisma/Drizzle pour PostgreSQL
- [ ] Schéma : `Transaction`, `PaymentMethod`, `ProviderLog`, `WebhookEvent`
- [ ] Setup Redis pour l'idempotence et le circuit breaker

### Phase 2 : Architecture d'Adapter (Core)
- [ ] Création du dossier `src/lib/orchestrator`
- [ ] Interface `IPaymentProvider` (initiate, verify, handleWebhook)
- [ ] Implémentation : `PayDunyaAdapter`, `PawaPayAdapter`
- [ ] `PaymentFactory` pour le routage dynamique

### Phase 3 : Endpoints & Webhooks
- [ ] Route Handler `/api/checkout` : Initiation unifiée
- [ ] Route Handler `/api/webhooks/[provider]` : Normalisation des notifications
- [ ] Mise en place du pattern "Outbox" pour garantir le traitement des webhooks

### Phase 4 : Fiabilité & Sécurité
- [ ] Idempotence middleware (Key-based in Redis)
- [ ] Logique de Retry via background jobs (Trigger.dev ou Inngest)
- [ ] Validation des signatures par provider
- [ ] Logs centralisés et monitoring (Sentry)

## 📁 Structure Intégrée Proposée
```
src/
├── app/
│   └── api/
│       ├── checkout/        # Point d'entrée unique
│       └── webhooks/        # Callbacks providers standardisés
├── lib/
│   ├── orchestrator/        # L'intelligence centrale
│   │   ├── adapters/        # PayDunya, PawaPay, etc.
│   │   ├── core/            # Interfaces et Types
│   │   └── factory.ts       # Sélecteur de stratégie
│   ├── db/                 # Instances ORM
│   └── utils/              # Idempotence, Signature validation
└── components/             # UI Dashboard (déjà existant)
```

---
**Avantage Next.js** : Utilisation de la même logique de typage du checkout jusqu'au dashboard, réduction de la latence entre le serveur et l'UI, et déploiement simplifié.
