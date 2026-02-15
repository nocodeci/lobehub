# Intégration PayDunya

## Vue d'ensemble

PayDunya est une passerelle de paiement panafricaine qui permet d'accepter des paiements via Mobile Money et cartes bancaires dans plusieurs pays d'Afrique de l'Ouest.

**Logo**: ![PayDunya](../../../public/logos/paydunya.png)

**Documentation officielle**: https://developers.paydunya.com/

## Pays et Opérateurs Supportés

### Sénégal (SN)
- Cartes Visa/MasterCard
- Orange Money Senegal
- Wave Senegal
- Free Money Senegal
- Expresso Senegal
- Wizall Senegal

### Bénin (BJ)
- Cartes Visa/MasterCard
- MTN Mobile Money Benin
- Moov Money Benin

### Côte d'Ivoire (CI)
- Cartes Visa/MasterCard
- Orange Money CI
- Wave CI
- MTN Mobile Money CI
- Moov Money CI

### Togo (TG)
- Cartes Visa/MasterCard
- T-Money Togo
- Moov Money Togo

### Mali (ML)
- Cartes Visa/MasterCard
- Orange Money Mali
- Moov Money Mali

### Burkina Faso (BF)
- Cartes Visa/MasterCard
- Orange Money Burkina
- Moov Money Burkina Faso

## Configuration

### 1. Créer un compte PayDunya Business

Rendez-vous sur [paydunya.com/signup](https://paydunya.com/signup) pour créer votre compte.

### 2. Générer vos clés API

1. Connectez-vous à votre compte PayDunya
2. Cliquez sur "Intégrez notre API" dans le menu
3. Cliquez sur "Configurer une nouvelle application"
4. Remplissez le formulaire et choisissez "MODE TEST" pour commencer

Vous obtiendrez 4 clés :
- **Master Key** : Clé principale d'authentification
- **Private Key** : Clé privée (à garder secrète)
- **Public Key** : Clé publique
- **Token** : Jeton d'identification de l'application

### 3. Configuration dans AfriFlow

```typescript
import { PaymentOrchestratorFactory } from '@/lib/orchestrator/factory';

// Configuration PayDunya
const paydunya = PaymentOrchestratorFactory.getProvider('paydunya', {
    masterKey: process.env.PAYDUNYA_MASTER_KEY,
    privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
    publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
    token: process.env.PAYDUNYA_TOKEN,
    mode: 'test', // ou 'live' pour la production
    storeId: 'AfriFlow Store', // Optionnel
});
```

### 4. Variables d'environnement

Ajoutez à votre fichier `.env` :

```env
# PayDunya Test Keys
PAYDUNYA_MASTER_KEY=your_master_key_here
PAYDUNYA_PRIVATE_KEY=your_private_key_here
PAYDUNYA_PUBLIC_KEY=your_public_key_here
PAYDUNYA_TOKEN=your_token_here
```

## Utilisation

### Initier un paiement

```typescript
const paymentRequest = {
    amount: 5000,
    currency: 'XOF',
    customerName: 'Jean Dupont',
    customerEmail: 'jean@example.com',
    customerPhone: '+221771234567',
    orderId: 'ORDER-123',
    callbackUrl: 'https://yoursite.com/api/webhooks/paydunya',
    returnUrl: 'https://yoursite.com/payment/success',
    metadata: {
        product: 'Premium Subscription',
    },
};

const response = await paydunya.initiatePayment(paymentRequest);

if (response.status === 'PENDING') {
    // Rediriger le client vers response.checkoutUrl
    console.log('Checkout URL:', response.checkoutUrl);
    console.log('Transaction ID:', response.transactionId);
}
```

### Vérifier un paiement

```typescript
const verification = await paydunya.verifyPayment(transactionId);

if (verification.status === 'SUCCESS') {
    console.log('Paiement confirmé !');
    // Débloquer le service/produit
} else {
    console.log('Paiement en attente ou échoué:', verification.status);
}
```

### Traiter les webhooks (IPN)

```typescript
// Dans votre route API /api/webhooks/paydunya
export async function POST(request: Request) {
    const payload = await request.json();
    
    const result = await paydunya.handleWebhook(payload);
    
    if (result.status === 'SUCCESS') {
        // Mettre à jour votre base de données
        await updateOrderStatus(result.transactionId, 'PAID');
    }
    
    return Response.json({ received: true });
}
```

## Comptes fictifs (Test)

Pour tester les paiements en mode sandbox :

1. Connectez-vous à votre compte PayDunya
2. Allez dans "Intégrez notre API" > "Clients fictifs"
3. Créez un compte de test avec un solde fictif
4. Utilisez ce compte pour simuler des paiements

## Passage en production

1. Connectez-vous à votre compte PayDunya
2. Allez dans "Intégrez notre API" > "Applications"
3. Cliquez sur "Détails" de votre application
4. Cliquez sur "Modifier la configuration"
5. Choisissez "Oui, l'application est prête" pour activer le mode production
6. Remplacez les clés de test par les clés de production dans vos variables d'environnement
7. Changez `mode: 'live'` dans la configuration

## Support

Pour toute assistance technique :
- Email : [[email protected]](mailto:[email protected])
- Documentation : https://developers.paydunya.com/

## Notes importantes

- **IPN (Instant Payment Notification)** : PayDunya envoie des notifications asynchrones pour confirmer les paiements. Il est crucial de les traiter pour gérer les paiements qui ne sont pas instantanés.
- **Sécurité** : Ne jamais exposer vos clés privées côté client. Toutes les opérations doivent se faire côté serveur.
- **Latence** : Les paiements Mobile Money peuvent prendre quelques secondes à quelques minutes selon l'opérateur et la connexion du client.
