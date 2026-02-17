import { IconType, SiCaldotcom, SiGithub } from '@icons-pack/react-simple-icons';

export interface KlavisServerType {
  /**
   * Author/Developer of the integration
   */
  author: string;
  /**
   * Author's website URL
   */
  authorUrl?: string;
  description: string;
  icon: string | IconType;
  /**
   * Identifier used for storage in database (e.g., 'google-calendar')
   * Format: lowercase, spaces replaced with hyphens
   */
  identifier: string;
  introduction: string;
  label: string;
  /**
   * Smithery MCP server URL for this integration
   */
  mcpUrl: string;
  /**
   * Server name for display (e.g., 'Google Calendar')
   */
  serverName: string;
}

export const KLAVIS_SERVER_TYPES: KlavisServerType[] = [
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Gmail is a free email service provided by Google',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/gmail.svg',
    identifier: 'gmail',
    introduction:
      'Bring the power of Gmail directly into your AI assistant. Read, compose, and send emails, search your inbox, manage labels, and organize your communications—all through natural conversation.',
    label: 'Gmail',
    mcpUrl: 'https://server.smithery.ai/gmail',
    serverName: 'Gmail',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Google Calendar is a time-management and scheduling calendar service',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/googlecalendar.svg',
    identifier: 'google-calendar',
    introduction:
      'Integrate Google Calendar to view, create, and manage your events seamlessly. Schedule meetings, set reminders, check availability, and coordinate your time—all through natural language commands.',
    label: 'Google Calendar',
    mcpUrl: 'https://server.smithery.ai/google-calendar',
    serverName: 'Google Calendar',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Notion is a collaborative productivity and note-taking application',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/notion.svg',
    identifier: 'notion',
    introduction:
      'Connect to Notion to access and manage your workspace. Create pages, search content, update databases, and organize your knowledge base—all through natural conversation with your AI assistant.',
    label: 'Notion',
    mcpUrl: 'https://server.smithery.ai/notion',
    serverName: 'Notion',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Airtable is a cloud-based database and spreadsheet platform that combines the flexibility of a spreadsheet with the power of a database, enabling teams to organize, track, and collaborate on projects with customizable views and powerful automation features',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/airtable.svg',
    identifier: 'airtable',
    introduction:
      'Integrate with Airtable to manage your databases and workflows. Query records, create entries, update data, and automate operations with customizable views and powerful tracking features.',
    label: 'Airtable',
    mcpUrl: 'https://server.smithery.ai/airtable',
    serverName: 'Airtable',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Google Sheets is a web-based spreadsheet application that allows users to create, edit, and collaborate on spreadsheets online',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/googlesheets.svg',
    identifier: 'google-sheets',
    introduction:
      'Connect to Google Sheets to read, write, and analyze spreadsheet data. Perform calculations, generate reports, create charts, and manage tabular data collaboratively with AI assistance.',
    label: 'Google Sheets',
    mcpUrl: 'https://server.smithery.ai/google-sheets',
    serverName: 'Google Sheets',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Google Docs is a word processor included as part of the free, web-based Google Docs Editors suite',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/googledocs.svg',
    identifier: 'google-docs',
    introduction:
      'Integrate with Google Docs to create, edit, and manage documents. Write content, format text, collaborate in real-time, and access your documents through natural conversation.',
    label: 'Google Docs',
    mcpUrl: 'https://server.smithery.ai/google-docs',
    serverName: 'Google Docs',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Enhanced GitHub MCP Server',
    icon: SiGithub,
    identifier: 'github',
    introduction:
      'Connect to GitHub to manage repositories, issues, pull requests, and code. Search code, review changes, create branches, and collaborate on software development projects through conversational AI.',
    label: 'GitHub',
    mcpUrl: 'https://server.smithery.ai/github',
    serverName: 'GitHub',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Supabase official MCP Server',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/supabase.svg',
    identifier: 'supabase',
    introduction:
      'Integrate with Supabase to manage your database and backend services. Query data, manage authentication, handle storage, and interact with your application backend through natural conversation.',
    label: 'Supabase',
    mcpUrl: 'https://server.smithery.ai/supabase',
    serverName: 'Supabase',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Google Drive is a cloud storage service',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/googledrive.svg',
    identifier: 'google-drive',
    introduction:
      'Connect to Google Drive to access, organize, and manage your files. Search documents, upload files, share content, and navigate your cloud storage efficiently through AI assistance.',
    label: 'Google Drive',
    mcpUrl: 'https://server.smithery.ai/google-drive',
    serverName: 'Google Drive',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Slack is a messaging app for business that connects people to the information they need',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/slack.svg',
    identifier: 'slack',
    introduction:
      'Integrate with Slack to send messages, search conversations, and manage channels. Connect with your team, automate communication workflows, and access workspace information through natural language.',
    label: 'Slack',
    mcpUrl: 'https://server.smithery.ai/slack',
    serverName: 'Slack',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Confluence is a team workspace where knowledge and collaboration meet',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/confluence.svg',
    identifier: 'confluence',
    introduction:
      'Connect to Confluence to access and manage team documentation. Search pages, create content, organize spaces, and build your knowledge base through conversational AI assistance.',
    label: 'Confluence',
    mcpUrl: 'https://server.smithery.ai/confluence',
    serverName: 'Confluence',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Jira is a project management and issue tracking tool developed by Atlassian',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/jira.svg',
    identifier: 'jira',
    introduction:
      'Integrate with Jira to manage issues, track progress, and organize sprints. Create tickets, update statuses, query project data, and streamline your development workflow through natural conversation.',
    label: 'Jira',
    mcpUrl: 'https://server.smithery.ai/jira',
    serverName: 'Jira',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'ClickUp is a comprehensive project management and productivity platform that helps teams organize tasks, manage projects, and collaborate effectively with customizable workflows and powerful tracking features',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/clickup.svg',
    identifier: 'clickup',
    introduction:
      'Connect to ClickUp to manage tasks, track projects, and organize your work. Create tasks, update statuses, manage custom workflows, and collaborate with your team through natural language commands.',
    label: 'ClickUp',
    mcpUrl: 'https://server.smithery.ai/clickup',
    serverName: 'ClickUp',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Complete file management solution for Dropbox cloud storage. Upload, download, organize files and folders, manage sharing and collaboration, handle file versions, create file requests, and perform batch operations on your Dropbox files and folders',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/dropbox.svg',
    identifier: 'dropbox',
    introduction:
      'Integrate with Dropbox to access and manage your files. Upload, download, share files, manage folders, handle file versions, and organize your cloud storage through conversational AI.',
    label: 'Dropbox',
    mcpUrl: 'https://server.smithery.ai/dropbox',
    serverName: 'Dropbox',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Figma is a collaborative interface design tool for web and mobile applications.',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/figma.svg',
    identifier: 'figma',
    introduction:
      'Connect to Figma to access design files and collaborate on projects. View designs, export assets, browse components, and manage your design workflow through natural conversation.',
    label: 'Figma',
    mcpUrl: 'https://server.smithery.ai/figma',
    serverName: 'Figma',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'HubSpot is a developer and marketer of software products for inbound marketing, sales, and customer service',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/hubspot.svg',
    identifier: 'hubspot',
    introduction:
      'Integrate with HubSpot to manage contacts, deals, and marketing campaigns. Access CRM data, track pipelines, automate workflows, and streamline your sales and marketing operations.',
    label: 'HubSpot',
    mcpUrl: 'https://server.smithery.ai/hubspot',
    serverName: 'HubSpot',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'OneDrive is a file hosting service and synchronization service operated by Microsoft',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/onedrive.svg',
    identifier: 'onedrive',
    introduction:
      'Connect to OneDrive to access and manage your Microsoft cloud files. Upload, download, share files, organize folders, and collaborate on documents through AI-powered assistance.',
    label: 'OneDrive',
    mcpUrl: 'https://server.smithery.ai/onedrive',
    serverName: 'OneDrive',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Outlook Mail is a web-based suite of webmail, contacts, tasks, and calendaring services from Microsoft.',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/outlook.svg',
    identifier: 'outlook-mail',
    introduction:
      'Integrate with Outlook Mail to read, send, and manage your Microsoft emails. Search messages, compose emails, manage folders, and organize your inbox through natural conversation.',
    label: 'Outlook Mail',
    mcpUrl: 'https://server.smithery.ai/outlook-mail',
    serverName: 'Outlook Mail',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      "Salesforce is the world's leading customer relationship management (CRM) platform that helps businesses connect with customers, partners, and potential customers",
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/salesforce.svg',
    identifier: 'salesforce',
    introduction:
      'Connect to Salesforce to manage customer relationships and sales data. Query records, update opportunities, track leads, and automate your CRM workflows through natural language commands.',
    label: 'Salesforce',
    mcpUrl: 'https://server.smithery.ai/salesforce',
    serverName: 'Salesforce',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'YouTube is a video-sharing platform where users can upload, share, and discover content. Access video information, transcripts, and metadata programmatically.',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/youtube.svg',
    identifier: 'youtube',
    introduction:
      'Connect to YouTube to search videos, access transcripts, and retrieve video information. Analyze content, extract metadata, and discover videos through natural conversation.',
    label: 'YouTube',
    mcpUrl: 'https://server.smithery.ai/youtube',
    serverName: 'YouTube',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description: 'Zendesk is a customer service software company',
    icon: 'https://hub-apac-1.lobeobjects.space/assets/logos/zendesk.svg',
    identifier: 'zendesk',
    introduction:
      'Integrate with Zendesk to manage support tickets and customer interactions. Create, update, and track support requests, access customer data, and streamline your support operations.',
    label: 'Zendesk',
    mcpUrl: 'https://server.smithery.ai/zendesk',
    serverName: 'Zendesk',
  },
  {
    author: 'Smithery',
    authorUrl: 'https://smithery.ai',
    description:
      'Cal.com is an open-source scheduling platform that helps you schedule meetings without the back-and-forth emails. Manage event types, bookings, availability, and integrate with calendars for seamless appointment scheduling',
    icon: SiCaldotcom,
    identifier: 'cal-com',
    introduction:
      'Connect to Cal.com to manage your scheduling and appointments. View availability, book meetings, manage event types, and automate your calendar through natural conversation.',
    label: 'Cal.com',
    mcpUrl: 'https://server.smithery.ai/cal-com',
    serverName: 'Cal.com',
  },
];

/**
 * Get server config by identifier
 */
export const getKlavisServerByServerIdentifier = (identifier: string) =>
  KLAVIS_SERVER_TYPES.find((s) => s.identifier === identifier);
