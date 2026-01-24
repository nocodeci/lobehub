import { NodeInputDefinition, NodeOutputDefinition, NodeIOSchema } from './node-io';

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - TRIGGERS
// ============================================================================

export const triggerNodeSchemas: Record<string, NodeIOSchema> = {
  whatsapp_message: {
    inputs: [
      {
        id: 'trigger_name',
        name: 'Nom du trigger',
        type: 'text',
        description: 'Nom pour identifier ce trigger',
        required: true,
        defaultValue: 'WhatsApp Trigger',
      },
    ],
    outputs: [
      {
        id: 'message',
        name: 'Message reçu',
        type: 'object',
        description: 'Contient les données du message WhatsApp (text, expéditeur, numéro, etc.)',
        variableName: 'messageData',
      },
      {
        id: 'sender_number',
        name: 'Numéro expéditeur',
        type: 'text',
        description: 'Numéro WhatsApp de la personne qui a envoyé le message',
        variableName: 'senderNumber',
      },
    ],
  },

  telegram_message: {
    inputs: [
      {
        id: 'trigger_name',
        name: 'Nom du trigger',
        type: 'text',
        description: 'Nom pour identifier ce trigger',
        required: true,
        defaultValue: 'Telegram Trigger',
      },
    ],
    outputs: [
      {
        id: 'message',
        name: 'Message reçu',
        type: 'object',
        description: 'Contient les données du message Telegram',
        variableName: 'messageData',
      },
      {
        id: 'sender_id',
        name: 'ID expéditeur',
        type: 'text',
        description: 'ID Telegram de la personne qui a envoyé le message',
        variableName: 'senderId',
      },
    ],
  },

  new_contact: {
    inputs: [],
    outputs: [
      {
        id: 'contact',
        name: 'Nouveau contact',
        type: 'object',
        description: 'Informations du nouveau contact',
        variableName: 'contactData',
      },
    ],
  },

  scheduled: {
    inputs: [
      {
        id: 'schedule',
        name: 'Programmation (cron)',
        type: 'text',
        description: 'Expression cron (ex: 0 9 * * *)',
        placeholder: '0 9 * * *',
        required: true,
      },
      {
        id: 'timezone',
        name: 'Fuseau horaire',
        type: 'select',
        description: 'Fuseau horaire pour le planning',
        options: [
          { label: 'UTC', value: 'UTC' },
          { label: 'Europe/Paris', value: 'Europe/Paris' },
          { label: 'Africa/Abidjan', value: 'Africa/Abidjan' },
          { label: 'Africa/Dakar', value: 'Africa/Dakar' },
        ],
        defaultValue: 'Africa/Abidjan',
      },
    ],
    outputs: [
      {
        id: 'execution_time',
        name: 'Heure d\'exécution',
        type: 'text',
        description: 'Moment où le trigger s\'est activé',
        variableName: 'scheduledTime',
      },
    ],
  },

  keyword: {
    inputs: [
      {
        id: 'keywords',
        name: 'Mots-clés',
        type: 'json',
        description: 'Liste des mots-clés à détecter',
        placeholder: '["bonjour", "prix", "aide"]',
        required: true,
      },
      {
        id: 'case_sensitive',
        name: 'Sensible à la casse',
        type: 'boolean',
        description: 'Respecter les majuscules/minuscules',
        defaultValue: false,
      },
    ],
    outputs: [
      {
        id: 'matched',
        name: 'Mot-clé trouvé',
        type: 'boolean',
        description: 'Vrai si un mot-clé correspond',
        variableName: 'keywordMatched',
      },
      {
        id: 'matched_keyword',
        name: 'Mot-clé correspondant',
        type: 'text',
        description: 'Le mot-clé qui a été détecté',
        variableName: 'matchedKeyword',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - INTELLIGENCE IA
// ============================================================================

export const aiNodeSchemas: Record<string, NodeIOSchema> = {
  gpt_analyze: {
    inputs: [
      {
        id: 'prompt',
        name: 'Instructions d\'analyse',
        type: 'textarea',
        description: 'Prompt système pour l\'analyse d\'intention',
        placeholder: 'Analyse l\'intention de l\'utilisateur {{.lastUserMessage}}',
        required: true,
      },
      {
        id: 'model',
        name: 'Modèle IA',
        type: 'select',
        description: 'Modèle GPT à utiliser',
        options: [
          { label: 'GPT-4o', value: 'gpt-4o' },
          { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'O1 Preview', value: 'o1-preview' },
        ],
        defaultValue: 'gpt-4o',
      },
      {
        id: 'temperature',
        name: 'Température (créativité)',
        type: 'number',
        description: 'Niveau de créativité (0.0 - 1.0)',
        defaultValue: 0.7,
      },
      {
        id: 'max_tokens',
        name: 'Tokens max',
        type: 'number',
        description: 'Nombre maximum de tokens',
        defaultValue: 500,
      },
    ],
    outputs: [
      {
        id: 'intent',
        name: 'Intention détectée',
        type: 'text',
        description: 'Intention du client (salutation, prix, produit, plainte, etc.)',
        variableName: 'detectedIntent',
      },
      {
        id: 'confidence',
        name: 'Score de confiance',
        type: 'number',
        description: 'Niveau de confiance (0.0 - 1.0)',
        variableName: 'intentConfidence',
      },
    ],
  },

  gpt_respond: {
    inputs: [
      {
        id: 'system_prompt',
        name: 'Prompt système',
        type: 'textarea',
        description: 'Instructions pour le bot',
        placeholder: 'Tu es un assistant sympathique...',
      },
      {
        id: 'model',
        name: 'Modèle IA',
        type: 'select',
        description: 'Modèle GPT à utiliser',
        options: [
          { label: 'GPT-4o', value: 'gpt-4o' },
          { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
        ],
        defaultValue: 'gpt-4o',
      },
      {
        id: 'temperature',
        name: 'Température (créativité)',
        type: 'number',
        description: 'Niveau de créativité (0.0 - 1.0)',
        defaultValue: 0.7,
      },
    ],
    outputs: [
      {
        id: 'response',
        name: 'Réponse générée',
        type: 'text',
        description: 'Réponse générée par l\'IA',
        variableName: 'aiResponse',
      },
    ],
  },

  ai_agent: {
    inputs: [
      {
        id: 'system_prompt',
        name: 'Prompt système',
        type: 'textarea',
        description: 'Instructions pour l\'agent IA autonome',
        placeholder: 'Tu es un expert en service client...',
        required: true,
      },
      {
        id: 'model',
        name: 'Modèle IA',
        type: 'select',
        description: 'Modèle GPT à utiliser',
        options: [
          { label: 'GPT-4o', value: 'gpt-4o' },
          { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
          { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
          { label: 'O1 Preview', value: 'o1-preview' },
        ],
        defaultValue: 'gpt-4o',
      },
      {
        id: 'tools',
        name: 'Outils disponibles',
        type: 'json',
        description: 'Liste des outils disponibles pour l\'agent',
        placeholder: '["web_search", "calculator"]',
      },
    ],
    outputs: [
      {
        id: 'agent_response',
        name: 'Réponse de l\'agent',
        type: 'text',
        description: 'Réponse générée par l\'agent IA',
        variableName: 'agentResponse',
      },
    ],
  },

  sentiment: {
    inputs: [
      {
        id: 'message',
        name: 'Message à analyser',
        type: 'textarea',
        description: 'Message ou texte à analyser',
        placeholder: '{{.lastUserMessage}}',
        required: true,
      },
      {
        id: 'emotions',
        name: 'Émotions à détecter',
        type: 'select',
        description: 'Types d\'émotions',
        options: [
          { label: 'Positif', value: 'positive' },
          { label: 'Négatif', value: 'negative' },
          { label: 'Neutre', value: 'neutral' },
        ],
      },
    ],
    outputs: [
      {
        id: 'sentiment',
        name: 'Sentiment détecté',
        type: 'text',
        description: 'Sentiment du message (positif, négatif, neutre)',
        variableName: 'detectedSentiment',
      },
      {
        id: 'emotion_score',
        name: 'Score d\'émotion',
        type: 'number',
        description: 'Score de confiance (0.0 - 1.0)',
        variableName: 'emotionScore',
      },
    ],
  },

  ai_translate: {
    inputs: [
      {
        id: 'text',
        name: 'Texte à traduire',
        type: 'textarea',
        description: 'Texte à traduire',
        placeholder: '{{.lastUserMessage}}',
        required: true,
      },
      {
        id: 'target_language',
        name: 'Langue cible',
        type: 'select',
        description: 'Langue de destination',
        options: [
          { label: 'Français', value: 'fr' },
          { label: 'Anglais', value: 'en' },
          { label: 'Espagnol', value: 'es' },
          { label: 'Portugais', value: 'pt' },
          { label: 'Arabe', value: 'ar' },
          { label: 'Chinois', value: 'zh' },
        ],
        defaultValue: 'fr',
      },
      {
        id: 'source_language',
        name: 'Langue source',
        type: 'select',
        description: 'Langue d\'origine (auto-détection)',
        options: [
          { label: 'Auto-détection', value: 'auto' },
          { label: 'Français', value: 'fr' },
          { label: 'Anglais', value: 'en' },
          { label: 'Espagnol', value: 'es' },
          { label: 'Portugais', value: 'pt' },
          { label: 'Arabe', value: 'ar' },
          { label: 'Chinois', value: 'zh' },
        ],
        defaultValue: 'auto',
      },
    ],
    outputs: [
      {
        id: 'translated_text',
        name: 'Texte traduit',
        type: 'text',
        description: 'Texte traduit dans la langue cible',
        variableName: 'translatedText',
      },
    ],
  },

  ai_summarize: {
    inputs: [
      {
        id: 'conversation_context',
        name: 'Contexte de conversation',
        type: 'textarea',
        description: 'Historique des messages à résumer',
        placeholder: 'Messages précédents...',
      },
      {
        id: 'max_length',
        name: 'Longueur max du résumé',
        type: 'number',
        description: 'Nombre maximum de mots',
        defaultValue: 100,
      },
    ],
    outputs: [
      {
        id: 'summary',
        name: 'Résumé de conversation',
        type: 'text',
        description: 'Résumé généré par l\'IA',
        variableName: 'conversationSummary',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - MESSAGES
// ============================================================================

export const messageNodeSchemas: Record<string, NodeIOSchema> = {
  delay: {
    inputs: [
      {
        id: 'duration',
        name: 'Durée du délai',
        type: 'number',
        description: 'Durée en secondes',
        defaultValue: 1,
        required: true,
      },
    ],
    outputs: [],
  },

  send_text: {
    inputs: [
      {
        id: 'message',
        name: 'Message à envoyer',
        type: 'textarea',
        description: 'Contenu du message',
        placeholder: 'Bonjour ! Comment puis-je vous aider ?',
        required: true,
      },
      {
        id: 'recipient',
        name: 'Destinataire',
        type: 'select',
        description: 'Destinataire du message',
        options: [
          { label: 'Utilisateur actuel', value: 'current_user' },
          { label: 'Numéro spécifique', value: 'specific_number' },
          { label: 'Contact depuis CRM', value: 'crm_contact' },
        ],
        defaultValue: 'current_user',
      },
      {
        id: 'recipient_number',
        name: 'Numéro du destinataire',
        type: 'text',
        description: 'Numéro WhatsApp (si sélectionné)',
        placeholder: '+1234567890',
        variableName: 'recipientNumber',
      },
    ],
    outputs: [
      {
        id: 'sent',
        name: 'Statut d\'envoi',
        type: 'boolean',
        description: 'Vrai si le message a été envoyé avec succès',
        variableName: 'messageSent',
      },
    ],
  },

  send_image: {
    inputs: [
      {
        id: 'image_url',
        name: 'URL de l\'image',
        type: 'text',
        description: 'URL de l\'image à envoyer',
        placeholder: 'https://example.com/image.jpg',
        required: true,
      },
      {
        id: 'caption',
        name: 'Légende',
        type: 'text',
        description: 'Texte accompagnant l\'image',
        placeholder: 'Voici l\'image demandée...',
      },
    ],
    outputs: [
      {
        id: 'sent',
        name: 'Statut d\'envoi',
        type: 'boolean',
        description: 'Vrai si l\'image a été envoyée avec succès',
        variableName: 'imageSent',
      },
    ],
  },

  send_audio: {
    inputs: [
      {
        id: 'audio_url',
        name: 'URL de l\'audio',
        type: 'text',
        description: 'URL du fichier audio à envoyer',
        placeholder: 'https://example.com/audio.mp3',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'sent',
        name: 'Statut d\'envoi',
        type: 'boolean',
        description: 'Vrai si l\'audio a été envoyé avec succès',
        variableName: 'audioSent',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - LOGIQUE & FLUX
// ============================================================================

export const logicNodeSchemas: Record<string, NodeIOSchema> = {
  condition: {
    inputs: [
      {
        id: 'condition_type',
        name: 'Type de condition',
        type: 'select',
        description: 'Type de condition à vérifier',
        options: [
          { label: 'Texte contient', value: 'text_contains' },
          { label: 'Texte égal à', value: 'text_equals' },
          { label: 'Variable existe', value: 'variable_exists' },
          { label: 'Nombre supérieur à', value: 'number_greater' },
          { label: 'Nombre inférieur à', value: 'number_less' },
          { label: 'Sentiment positif', value: 'sentiment_positive' },
          { label: 'Sentiment négatif', value: 'sentiment_negative' },
          { label: 'Intention correspond', value: 'intent_equals' },
        ],
        defaultValue: 'text_contains',
      },
      {
        id: 'value_to_check',
        name: 'Valeur à vérifier',
        type: 'text',
        description: 'Valeur à comparer',
        placeholder: 'bonjour',
        variableName: 'valueToCheck',
      },
    ],
    outputs: [
      {
        id: 'condition_met',
        name: 'Condition remplie',
        type: 'boolean',
        description: 'Vrai si la condition est remplie',
        variableName: 'conditionResult',
      },
      {
        id: 'true_branch',
        name: 'Branche Vrai',
        type: 'text',
        description: 'Nom de la branche si condition vraie',
        variableName: 'trueBranch',
      },
      {
        id: 'false_branch',
        name: 'Branche Faux',
        type: 'text',
        description: 'Nom de la branche si condition fausse',
        variableName: 'falseBranch',
      },
    ],
  },

  loop: {
    inputs: [
      {
        id: 'loop_times',
        name: 'Nombre d\'itérations',
        type: 'number',
        description: 'Nombre de fois à répéter',
        defaultValue: 3,
        required: true,
      },
      {
        id: 'delay_between',
        name: 'Délai entre itérations',
        type: 'number',
        description: 'Délai en secondes entre chaque itération',
        defaultValue: 1,
      },
    ],
    outputs: [
      {
        id: 'iteration_count',
        name: 'Compteur d\'itérations',
        type: 'number',
        description: 'Nombre d\'itérations effectuées',
        variableName: 'loopCount',
      },
    ],
  },

  set_variable: {
    inputs: [
      {
        id: 'variable_name',
        name: 'Nom de la variable',
        type: 'text',
        description: 'Nom de la variable à créer/modifier',
        placeholder: 'client_name',
        required: true,
      },
      {
        id: 'variable_value',
        name: 'Valeur de la variable',
        type: 'text',
        description: 'Valeur à assigner',
        placeholder: 'Jean Dupont',
        variableName: 'variableValue',
      },
    ],
    outputs: [
      {
        id: 'variable_set',
        name: 'Variable définie',
        type: 'boolean',
        description: 'Vrai si la variable a été créée/modifiée',
        variableName: 'variableSet',
      },
    ],
  },

  random_choice: {
    inputs: [
      {
        id: 'choices',
        name: 'Choix possibles',
        type: 'json',
        description: 'Liste des choix',
        placeholder: '["Oui", "Non", "Plus tard"]',
        required: true,
      },
      {
        id: 'weights',
        name: 'Probabilités (poids)',
        type: 'json',
        description: 'Probabilités de chaque choix (0-100)',
        placeholder: '[50, 30, 20]',
      },
    ],
    outputs: [
      {
        id: 'selected_choice',
        name: 'Choix sélectionné',
        type: 'text',
        description: 'Choix aléatoire sélectionné',
        variableName: 'randomChoice',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - CRM & CONTACTS
// ============================================================================

export const crmNodeSchemas: Record<string, NodeIOSchema> = {
  save_contact: {
    inputs: [
      {
        id: 'contact_name',
        name: 'Nom du contact',
        type: 'text',
        description: 'Nom complet du contact',
        placeholder: 'Jean Dupont',
        variableName: 'contactName',
      },
      {
        id: 'phone_number',
        name: 'Numéro de téléphone',
        type: 'text',
        description: 'Numéro WhatsApp',
        placeholder: '+1234567890',
        variableName: 'phoneNumber',
      },
      {
        id: 'email',
        name: 'Email',
        type: 'text',
        description: 'Adresse email',
        placeholder: 'jean.dupont@email.com',
        variableName: 'email',
      },
      {
        id: 'tags',
        name: 'Tags',
        type: 'json',
        description: 'Liste des tags',
        placeholder: '["vip", "client", "prospect"]',
      },
    ],
    outputs: [
      {
        id: 'contact_saved',
        name: 'Contact sauvegardé',
        type: 'boolean',
        description: 'Vrai si le contact a été sauvegardé',
        variableName: 'contactSaved',
      },
      {
        id: 'contact_id',
        name: 'ID du contact',
        type: 'text',
        description: 'ID unique du contact créé',
        variableName: 'contactId',
      },
    ],
  },

  add_tag: {
    inputs: [
      {
        id: 'tag_name',
        name: 'Nom du tag',
        type: 'text',
        description: 'Nom du tag à ajouter',
        placeholder: 'client_important',
        variableName: 'tagName',
      },
      {
        id: 'contact_identifier',
        name: 'Identifiant du contact',
        type: 'select',
        description: 'Comment identifier le contact',
        options: [
          { label: 'Numéro actuel', value: 'current_phone' },
          { label: 'Variable de contact', value: 'contact_variable' },
        ],
        defaultValue: 'current_phone',
      },
    ],
    outputs: [
      {
        id: 'tag_added',
        name: 'Tag ajouté',
        type: 'boolean',
        description: 'Vrai si le tag a été ajouté',
        variableName: 'tagAdded',
      },
    ],
  },

  assign_agent: {
    inputs: [
      {
        id: 'agent_name',
        name: 'Nom de l\'agent',
        type: 'select',
        description: 'Agent à assigner',
        options: [
          { label: 'Support', value: 'support' },
          { label: 'Ventes', value: 'sales' },
          { label: 'Facturation', value: 'billing' },
          { label: 'Marketing', value: 'marketing' },
        ],
        defaultValue: 'support',
      },
      {
        id: 'contact_identifier',
        name: 'Identifiant du contact',
        type: 'select',
        description: 'Comment identifier le contact',
        options: [
          { label: 'Numéro actuel', value: 'current_phone' },
          { label: 'Variable de contact', value: 'contact_variable' },
        ],
        defaultValue: 'current_phone',
      },
    ],
    outputs: [
      {
        id: 'agent_assigned',
        name: 'Agent assigné',
        type: 'boolean',
        description: 'Vrai si l\'agent a été assigné',
        variableName: 'agentAssigned',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - NOTIFICATIONS
// ============================================================================

export const notificationNodeSchemas: Record<string, NodeIOSchema> = {
  notify_email: {
    inputs: [
      {
        id: 'recipient_email',
        name: 'Email du destinataire',
        type: 'text',
        description: 'Adresse email',
        placeholder: 'notification@company.com',
        required: true,
      },
      {
        id: 'subject',
        name: 'Sujet',
        type: 'text',
        description: 'Sujet de l\'email',
        placeholder: 'Notification: Nouveau message',
        variableName: 'emailSubject',
      },
      {
        id: 'body',
        name: 'Contenu de l\'email',
        type: 'textarea',
        description: 'Corps de l\'email',
        placeholder: 'Bonjour, vous avez reçu un nouveau message...',
        variableName: 'emailBody',
      },
    ],
    outputs: [
      {
        id: 'email_sent',
        name: 'Email envoyé',
        type: 'boolean',
        description: 'Vrai si l\'email a été envoyé',
        variableName: 'emailSent',
      },
    ],
  },

  notify_webhook: {
    inputs: [
      {
        id: 'webhook_url',
        name: 'URL du Webhook',
        type: 'text',
        description: 'URL du webhook à appeler',
        placeholder: 'https://api.example.com/webhook',
        required: true,
      },
      {
        id: 'method',
        name: 'Méthode HTTP',
        type: 'select',
        description: 'Méthode de la requête',
        options: [
          { label: 'POST', value: 'POST' },
          { label: 'GET', value: 'GET' },
          { label: 'PUT', value: 'PUT' },
        ],
        defaultValue: 'POST',
      },
      {
        id: 'headers',
        name: 'En-têtes HTTP',
        type: 'json',
        description: 'En-têtes de la requête',
        placeholder: '{"Authorization": "Bearer xxx", "Content-Type": "application/json"}',
      },
    ],
    outputs: [
      {
        id: 'webhook_response',
        name: 'Réponse du webhook',
        type: 'object',
        description: 'Réponse reçue du webhook',
        variableName: 'webhookResponse',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - APPOINTMENTS
// ============================================================================

export const appointmentNodeSchemas: Record<string, NodeIOSchema> = {
  check_availability: {
    inputs: [
      {
        id: 'agent_id',
        name: 'Agent concerné',
        type: 'select',
        description: 'Agent dont on vérifie la disponibilité',
        options: [
          { label: 'Support', value: 'support' },
          { label: 'Ventes', value: 'sales' },
          { label: 'Facturation', value: 'billing' },
        ],
        defaultValue: 'support',
      },
      {
        id: 'date_range',
        name: 'Plage de dates',
        type: 'text',
        description: 'Plage de dates à vérifier (YYYY-MM-DD to YYYY-MM-DD)',
        placeholder: '2025-01-24 to 2025-01-31',
      },
    ],
    outputs: [
      {
        id: 'available',
        name: 'Disponible',
        type: 'boolean',
        description: 'Vrai si l\'agent est disponible',
        variableName: 'agentAvailable',
      },
      {
        id: 'available_slots',
        name: 'Créneaux disponibles',
        type: 'array',
        description: 'Liste des créneaux horaires disponibles',
        variableName: 'availableSlots',
      },
    ],
  },

  book_appointment: {
    inputs: [
      {
        id: 'agent_id',
        name: 'Agent concerné',
        type: 'select',
        description: 'Agent pour le rendez-vous',
        options: [
          { label: 'Support', value: 'support' },
          { label: 'Ventes', value: 'sales' },
          { label: 'Facturation', value: 'billing' },
        ],
        defaultValue: 'support',
      },
      {
        id: 'appointment_date',
        name: 'Date du rendez-vous',
        type: 'text',
        description: 'Date et heure du rendez-vous',
        placeholder: '2025-01-24 14:30',
        required: true,
        variableName: 'appointmentDate',
      },
      {
        id: 'duration',
        name: 'Durée',
        type: 'number',
        description: 'Durée en minutes',
        defaultValue: 30,
      },
    ],
    outputs: [
      {
        id: 'appointment_booked',
        name: 'Rendez-vous confirmé',
        type: 'boolean',
        description: 'Vrai si le rendez-vous a été confirmé',
        variableName: 'appointmentBooked',
      },
      {
        id: 'confirmation_message',
        name: 'Message de confirmation',
        type: 'text',
        description: 'Message à envoyer au client',
        variableName: 'confirmationMessage',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - SÉCURITÉ
// ============================================================================

export const securityNodeSchemas: Record<string, NodeIOSchema> = {
  rate_limit: {
    inputs: [
      {
        id: 'max_requests',
        name: 'Limite de requêtes',
        type: 'number',
        description: 'Nombre maximum de requêtes par période',
        defaultValue: 10,
        required: true,
      },
      {
        id: 'time_window',
        name: 'Fenêtre temporelle',
        type: 'select',
        description: 'Période de temps',
        options: [
          { label: 'Par minute', value: 'per_minute' },
          { label: 'Par heure', value: 'per_hour' },
          { label: 'Par jour', value: 'per_day' },
        ],
        defaultValue: 'per_minute',
      },
    ],
    outputs: [
      {
        id: 'limit_reached',
        name: 'Limite atteinte',
        type: 'boolean',
        description: 'Vrai si la limite est dépassée',
        variableName: 'limitReached',
      },
      {
        id: 'retry_after',
        name: 'Réessayer après',
        type: 'number',
        description: 'Délai avant réessai (secondes)',
        variableName: 'retryAfter',
      },
    ],
  },

  verify_human: {
    inputs: [
      {
        id: 'verification_method',
        name: 'Méthode de vérification',
        type: 'select',
        description: 'Comment vérifier que c\'est un humain',
        options: [
          { label: 'Question CAPTCHA', value: 'captcha' },
          { label: 'Question simple', value: 'simple_question' },
          { label: 'Code de vérification', value: 'verification_code' },
        ],
        defaultValue: 'simple_question',
      },
      {
        id: 'question',
        name: 'Question de vérification',
        type: 'text',
        description: 'Question à poser',
        placeholder: 'Combien font 3 + 2 ?',
        variableName: 'verificationQuestion',
      },
    ],
    outputs: [
      {
        id: 'is_human',
        name: 'Est un humain',
        type: 'boolean',
        description: 'Vrai si l\'utilisateur est vérifié comme humain',
        variableName: 'isHuman',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - E-COMMERCE
// ============================================================================

export const ecommerceNodeSchemas: Record<string, NodeIOSchema> = {
  show_catalog: {
    inputs: [
      {
        id: 'category_filter',
        name: 'Filtrer par catégorie',
        type: 'select',
        description: 'Catégorie de produits à afficher',
        options: [
          { label: 'Tous les produits', value: 'all' },
          { label: 'Électronique', value: 'electronics' },
          { label: 'Mode', value: 'fashion' },
          { label: 'Maison', value: 'home' },
        ],
        defaultValue: 'all',
      },
    ],
    outputs: [
      {
        id: 'catalog_products',
        name: 'Liste des produits',
        type: 'array',
        description: 'Liste des produits du catalogue',
        variableName: 'catalogProducts',
      },
    ],
  },

  add_to_cart: {
    inputs: [
      {
        id: 'product_id',
        name: 'ID du produit',
        type: 'text',
        description: 'Identifiant du produit',
        placeholder: 'PROD-001',
        variableName: 'productId',
      },
      {
        id: 'quantity',
        name: 'Quantité',
        type: 'number',
        description: 'Quantité à ajouter',
        defaultValue: 1,
        variableName: 'quantity',
      },
    ],
    outputs: [
      {
        id: 'cart_updated',
        name: 'Panier mis à jour',
        type: 'boolean',
        description: 'Vrai si le produit a été ajouté au panier',
        variableName: 'cartUpdated',
      },
      {
        id: 'cart_items',
        name: 'Articles du panier',
        type: 'array',
        description: 'Liste actuelle des articles dans le panier',
        variableName: 'cartItems',
      },
    ],
  },

  checkout: {
    inputs: [
      {
        id: 'payment_method',
        name: 'Méthode de paiement',
        type: 'select',
        description: 'Méthode de paiement',
        options: [
          { label: 'Paydunya', value: 'paydunya' },
          { label: 'Kkiapay', value: 'kkiapay' },
          { label: 'Fedapay', value: 'fedapay' },
          { label: 'Stripe', value: 'stripe' },
          { label: 'Coinbase', value: 'coinbase' },
        ],
        defaultValue: 'paydunya',
      },
    ],
    outputs: [
      {
        id: 'payment_status',
        name: 'Statut du paiement',
        type: 'text',
        description: 'Statut du paiement (success, failed, pending)',
        variableName: 'paymentStatus',
      },
      {
        id: 'payment_link',
        name: 'Lien de paiement',
        type: 'text',
        description: 'Lien de paiement généré',
        variableName: 'paymentLink',
      },
    ],
  },
};

// ============================================================================
// SCHÉMAS D'ENTRÉES/SORTIES - WHATSAPP GROUPS
// ============================================================================

export const whatsappGroupNodeSchemas: Record<string, NodeIOSchema> = {
  create_group: {
    inputs: [
      {
        id: 'group_name',
        name: 'Nom du groupe',
        type: 'text',
        description: 'Nom du groupe WhatsApp',
        placeholder: 'Clients VIP',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'group_id',
        name: 'ID du groupe',
        type: 'text',
        description: 'ID unique du groupe créé',
        variableName: 'groupId',
      },
      {
        id: 'invite_link',
        name: 'Lien d\'invitation',
        type: 'text',
        description: 'Lien pour rejoindre le groupe',
        variableName: 'groupInviteLink',
      },
    ],
  },

  bulk_add_members: {
    inputs: [
      {
        id: 'members_list',
        name: 'Liste des membres',
        type: 'json',
        description: 'Liste des numéros à ajouter',
        placeholder: '["+22177777777", "+22188888888"]',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'members_added',
        name: 'Membres ajoutés',
        type: 'number',
        description: 'Nombre de membres ajoutés avec succès',
        variableName: 'membersAddedCount',
      },
      {
        id: 'failed_numbers',
        name: 'Numéros en échec',
        type: 'array',
        description: 'Liste des numéros qui n\'ont pas pu être ajoutés',
        variableName: 'failedNumbers',
      },
    ],
  },

  extraction: {
    inputs: [
      {
        id: 'extraction_type',
        name: 'Type d\'extraction',
        type: 'select',
        description: 'Quoi extraire du groupe',
        options: [
          { label: 'Liste des membres', value: 'members_list' },
          { label: 'Messages récents', value: 'recent_messages' },
          { label: 'Métadonnées du groupe', value: 'group_metadata' },
        ],
        defaultValue: 'members_list',
      },
    ],
    outputs: [
      {
        id: 'extracted_data',
        name: 'Données extraites',
        type: 'object',
        description: 'Données extraites du groupe',
        variableName: 'extractedData',
      },
    ],
  },
};

// ============================================================================
// EXPORT DE TOUS LES SCHÉMAS
// ============================================================================

export const allNodeSchemas = {
  ...triggerNodeSchemas,
  ...aiNodeSchemas,
  ...messageNodeSchemas,
  ...logicNodeSchemas,
  ...crmNodeSchemas,
  ...notificationNodeSchemas,
  ...appointmentNodeSchemas,
  ...securityNodeSchemas,
  ...ecommerceNodeSchemas,
  ...whatsappGroupNodeSchemas,
};