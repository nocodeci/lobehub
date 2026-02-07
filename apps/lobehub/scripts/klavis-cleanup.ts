/**
 * Klavis Instance Cleanup Script
 * 
 * Ce script permet de lister et supprimer les instances Klavis existantes
 * pour libérer de l'espace et résoudre l'erreur "API account creation limit reached"
 * 
 * Usage:
 *   bun run scripts/klavis-cleanup.ts list <userId>
 *   bun run scripts/klavis-cleanup.ts delete <instanceId>
 *   bun run scripts/klavis-cleanup.ts help
 */

import { KlavisClient } from 'klavis';

// Récupérer la clé API depuis les variables d'environnement
const KLAVIS_API_KEY = process.env.KLAVIS_API_KEY;

if (!KLAVIS_API_KEY) {
    console.error('❌ KLAVIS_API_KEY non défini dans les variables d\'environnement');
    console.log('\nUtilisez:');
    console.log('  KLAVIS_API_KEY=votre_cle bun run scripts/klavis-cleanup.ts list <userId>');
    process.exit(1);
}

const client = new KlavisClient({ apiKey: KLAVIS_API_KEY });

async function listIntegrations(userId: string) {
    console.log(`🔍 Récupération des intégrations pour l'utilisateur: ${userId}\n`);

    try {
        // Utiliser getUserIntegrations pour lister les serveurs connectés
        const response = await client.user.getUserIntegrations(userId);

        console.log('📋 Intégrations trouvées:');
        if (response.integrations && response.integrations.length > 0) {
            response.integrations.forEach((integration: any, index: number) => {
                console.log(`\n${index + 1}. ${integration.serverName || integration.platform || 'Unknown'}`);
                console.log(`   Instance ID: ${integration.instanceId}`);
                console.log(`   Platform: ${integration.platform || 'N/A'}`);
                console.log(`   Authenticated: ${integration.isAuthenticated ? '✅' : '❌'}`);
                if (integration.serverUrl) {
                    console.log(`   Server URL: ${integration.serverUrl}`);
                }
            });

            console.log(`\n📊 Total: ${response.integrations.length} intégration(s)`);
            console.log('\n💡 Pour supprimer une intégration:');
            console.log('   KLAVIS_API_KEY=xxx bun run scripts/klavis-cleanup.ts delete <instanceId>');
        } else {
            console.log('Aucune intégration trouvée.');
        }

    } catch (error: any) {
        console.error('❌ Erreur:', error.message);

        // Si l'erreur mentionne que l'utilisateur n'existe pas, suggérer d'autres options
        if (error.message.includes('not found') || error.message.includes('404')) {
            console.log('\n💡 L\'utilisateur peut ne pas avoir d\'intégrations, ou le userId est incorrect.');
            console.log('   Essayez avec le userId de votre base de données LobeHub.');
        }
    }
}

async function deleteInstance(instanceId: string) {
    console.log(`🗑️  Suppression de l'instance: ${instanceId}...`);

    try {
        await client.mcpServer.deleteServerInstance(instanceId);
        console.log('✅ Instance supprimée avec succès');
        console.log('\n🔄 Une nouvelle instance pourra maintenant être créée.');
    } catch (error: any) {
        console.error('❌ Erreur lors de la suppression:', error.message);

        if (error.message.includes('not found') || error.message.includes('404')) {
            console.log('\n💡 L\'instance n\'existe peut-être plus côté Klavis.');
            console.log('   Elle peut avoir déjà été supprimée.');
        }
    }
}

async function showDatabaseInstructions() {
    console.log(`
🗃️  NETTOYAGE DE LA BASE DE DONNÉES LOCALE

Si vous voulez aussi nettoyer les entrées Klavis dans votre base de données LobeHub:

1. Connectez-vous à votre base de données PostgreSQL
2. Listez les plugins Klavis:
   
   SELECT identifier, custom_params->>'klavis' as klavis_info 
   FROM plugins 
   WHERE source = 'klavis';

3. Supprimez les entrées obsolètes:
   
   DELETE FROM plugins WHERE identifier = '<identifier-a-supprimer>';

Note: Les identifiers typiques sont: google-calendar, gmail, google-drive, slack, etc.
`);
}

// Parse command line arguments
const command = process.argv[2] || 'help';
const arg = process.argv[3];

switch (command) {
    case 'list':
        if (!arg) {
            console.error('❌ userId requis');
            console.log('\nUsage: KLAVIS_API_KEY=xxx bun run scripts/klavis-cleanup.ts list <userId>');
            console.log('\nLe userId est celui utilisé lors de la création de l\'instance Klavis.');
            console.log('Vous pouvez le trouver dans votre base de données LobeHub (table users).');
            process.exit(1);
        }
        await listIntegrations(arg);
        break;

    case 'delete':
        if (!arg) {
            console.error('❌ Instance ID requis');
            console.log('Usage: KLAVIS_API_KEY=xxx bun run scripts/klavis-cleanup.ts delete <instanceId>');
            process.exit(1);
        }
        await deleteInstance(arg);
        break;

    case 'clean-db':
        await showDatabaseInstructions();
        break;

    case 'help':
    default:
        console.log(`
🔧 Klavis Instance Cleanup Tool

Ce script aide à résoudre l'erreur:
"API account creation limit reached (Limit: 3)"

Usage:
  bun run scripts/klavis-cleanup.ts <commande> [arguments]

Commandes:
  list <userId>     Liste les intégrations Klavis d'un utilisateur
  delete <id>       Supprime une instance Klavis par son instanceId
  clean-db          Affiche les instructions pour nettoyer la BDD locale
  help              Affiche cette aide

Exemples:
  # Lister les intégrations d'un utilisateur
  KLAVIS_API_KEY=xxx bun run scripts/klavis-cleanup.ts list user_abc123

  # Supprimer une instance
  KLAVIS_API_KEY=xxx bun run scripts/klavis-cleanup.ts delete inst_xyz789

🔑 Où trouver le userId?
  - Dans votre base de données LobeHub: SELECT id FROM users LIMIT 5;
  - C'est l'ID utilisé lors de createServerInstance

🔑 Où trouver l'instanceId?
  - Via la commande 'list'
  - Ou dans la BDD: SELECT custom_params->'klavis'->>'instanceId' FROM plugins;
`);
}
