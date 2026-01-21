# 🏢 Wozif - Architecture Multi-Produits

## Vision de l'Entreprise

**Wozif** est une entreprise technologique africaine qui développe des solutions digitales pour démocratiser l'accès au web et aux paiements en ligne en Afrique.

## Produits

### 1. **Gnata** 🎨
**Tagline** : "Votre site web en 1 heure"

**Description** : Plateforme de création de sites web ultra-rapide avec service humain. Un utilisateur fait une demande, et reçoit son site professionnel en moins d'une heure.

**URL** : gnata.wozif.com (ou gnata.io)

**Fonctionnalités** :
- Demande de site via formulaire
- Livraison garantie en 1h
- Intégration AfriFlow native
- Dashboard de gestion
- Hébergement inclus
- Support technique

**Tarification** :
- Site vitrine : 50 000 FCFA
- Site e-commerce : 100 000 FCFA
- Site sur mesure : Sur devis
- Maintenance : 10 000 FCFA/mois

### 2. **AfriFlow** 💳
**Tagline** : "Orchestrateur de paiements africains"

**Description** : Plateforme d'orchestration de paiements qui permet d'accepter tous les moyens de paiement africains (Mobile Money, cartes) via une seule intégration.

**URL** : afriflow.wozif.com (ou afriflow.io)

**Fonctionnalités** :
- Intégration unique, multiples providers
- Support de 18+ opérateurs Mobile Money
- Routage intelligent
- Dashboard analytics
- API REST complète
- Webhooks en temps réel

**Tarification** :
- 2% par transaction
- Pas de frais fixes
- Gratuit jusqu'à 1M FCFA/mois

## Synergie Gnata ↔ AfriFlow

### Intégration Native
Chaque site créé sur Gnata peut activer AfriFlow en 1 clic :

```
Client Gnata demande un site e-commerce
    ↓
Site créé en 1h avec AfriFlow pré-configuré
    ↓
Client active son compte AfriFlow
    ↓
Paiements fonctionnels immédiatement
```

### Avantages
- **Pour le client** : Solution complète (site + paiements)
- **Pour Wozif** : Revenus récurrents des deux produits
- **Pour l'écosystème** : Barrière à l'entrée réduite pour l'e-commerce

## Structure Technique

### Repositories Séparés

```
wozif-main-website/        # Site vitrine principal
wozif-account-portal/      # Portail de compte unifié
afriflow/                  # Application AfriFlow (existant)
gnata/                     # Application Gnata (nouveau)
```

### Infrastructure Commune

**Domaines** :
- wozif.com → Site vitrine
- account.wozif.com → Portail de compte
- afriflow.wozif.com → AfriFlow
- gnata.wozif.com → Gnata
- docs.wozif.com → Documentation
- status.wozif.com → Status page
- support.wozif.com → Support client

**Services Partagés** :
- Authentication (SSO)
- Email Service
- Analytics
- Billing System
- Support Ticketing

## Roadmap

### Phase 1 : Fondations (Mois 1-2)
- [x] AfriFlow - Core features
- [ ] Site vitrine Wozif
- [ ] Système de compte unifié
- [ ] Branding et identité visuelle

### Phase 2 : Lancement Gnata (Mois 3-4)
- [ ] Gnata - Interface client
- [ ] Gnata - Dashboard admin (pour toi)
- [ ] Système de demandes et livraison
- [ ] Intégration AfriFlow dans Gnata

### Phase 3 : Production (Mois 5-6)
- [ ] AfriFlow en production
- [ ] Gnata en production
- [ ] Marketing et acquisition
- [ ] Premiers clients

### Phase 4 : Scaling (Mois 7+)
- [ ] Automatisation partielle de Gnata (templates)
- [ ] Expansion AfriFlow (nouveaux providers)
- [ ] Équipe élargie
- [ ] Nouveaux produits

## Modèle Économique

### Revenus AfriFlow
- 2% par transaction
- Objectif : 100 clients × 5M FCFA/mois = 10M FCFA de revenus/mois

### Revenus Gnata
- 10 sites/mois × 75 000 FCFA = 750 000 FCFA
- Maintenance : 50 clients × 10 000 FCFA = 500 000 FCFA/mois
- Objectif : 1,25M FCFA/mois

### Total Visé (6 mois)
- 11,25M FCFA/mois de revenus récurrents

## Prochaines Actions

1. ✅ Architecture définie
2. ⏳ Créer le site vitrine Wozif
3. ⏳ Créer le portail de compte unifié
4. ⏳ Finaliser AfriFlow
5. ⏳ Développer Gnata MVP



