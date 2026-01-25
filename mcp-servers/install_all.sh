#!/bin/bash
# Script d'installation robuste pour les serveurs MCP - Wozif Connect
# Supporte NPM, PNPM et Python (pip)

echo "🚀 Début de l'installation des serveurs MCP..."

# Helper pour installer NPM/PNPM
install_node() {
    local dir=$1
    local name=$2
    local tool=${3:-npm}
    echo "--- [Node] Installation $name ($tool) ---"
    if [ -d "$dir" ]; then
        cd "$dir"
        export PATH="/opt/homebrew/bin:$PATH"
        $tool install
        if [ "$tool" == "npm" ]; then
            npm run build 2>/dev/null || echo "Pas de script build pour $name"
        else
            pnpm build 2>/dev/null || echo "Pas de script build pour $name"
        fi
        echo "✅ $name terminé."
    else
        echo "❌ Dossier $dir introuvable."
    fi
}

# Helper pour installer Python
install_python() {
    local dir=$1
    local name=$2
    echo "--- [Python] Installation $name ---"
    if [ -d "$dir" ]; then
        cd "$dir"
        python3 -m pip install . 2>/dev/null || echo "⚠️ Erreur pip install pour $name (dépendances manquantes ?)"
        echo "✅ $name terminé."
    else
        echo "❌ Dossier $dir introuvable."
    fi
}

# 1. Google Calendar (PNPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/calendar" "Calendar" "pnpm"

# 2. Gmail (NPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/gmail" "Gmail" "npm"

# 3. Calendly (Python)
install_python "/Users/koffiyohanerickouakou/wozif/mcp-servers/calendly" "Calendly"

# 4. Brave Search (NPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/brave-search" "Brave Search" "npm"

# 5. Devises (NPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/currency" "Currency" "npm"

# 6. Notion (NPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/notion" "Notion" "npm"

# 7. Slack (Node wrapper)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/slack/npm/slack-mcp-server" "Slack" "npm"

# 8. Google Sheets (Python)
install_python "/Users/koffiyohanerickouakou/wozif/mcp-servers/sheets" "Sheets"

# 9. Google Maps (NPM)
install_node "/Users/koffiyohanerickouakou/wozif/mcp-servers/maps" "Maps" "npm"

echo "✨ Tous les serveurs disponibles ont été traités."
