# Connect Desktop App

Application desktop native (macOS, Windows, Linux) pour Connect - plateforme d'agents IA.

## 🚀 Quick Start

### Installation des dépendances

```bash
cd apps/desktop
pnpm install
```

### Développement

```bash
# Lancer l'app en mode dev
pnpm dev

# Lancer avec le renderer statique (Next.js export)
pnpm dev:static
```

### Build de production

#### macOS

```bash
# Build pour macOS (DMG + ZIP)
pnpm package:mac

# Build local non-signé (pour tester)
pnpm package:mac:local
```

L'app sera générée dans `apps/desktop/release/`

#### Windows

```bash
pnpm package:win
```

#### Linux

```bash
pnpm package:linux
```

## 📦 Structure

```
apps/desktop/
├── src/
│   ├── main/          # Processus principal Electron
│   ├── preload/       # Scripts preload (bridge sécurisé)
│   └── renderer/      # Interface utilisateur (Next.js)
├── build/             # Icônes et ressources
├── resources/         # Ressources additionnelles
└── dist/              # Build output
```

## 🎨 Personnalisation

### Icônes

Les icônes sont dans `build/`:
- `Icon.icns` - macOS
- `icon.ico` - Windows  
- `icon.png` - Linux

Pour créer de nouvelles icônes à partir d'une image PNG :
1. Utiliser un outil comme [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
2. Remplacer les fichiers dans `build/`

### App ID et Protocol

Configurés dans `electron-builder.mjs`:
- App ID: `com.wozif.connect-desktop`
- Protocol: `connect://`

## 🔐 Code Signing (macOS)

Pour signer l'app macOS (requis pour distribution):

1. Obtenir un certificat Apple Developer
2. Configurer les variables d'environnement:

```bash
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"
export APPLE_ID="your-apple-id@email.com"
export APPLE_APP_SPECIFIC_PASSWORD="app-specific-password"
```

3. Build:

```bash
pnpm package:mac
```

## 📱 Distribution

### Auto-update

L'app supporte les mises à jour automatiques via:
- GitHub Releases (par défaut)
- Serveur personnalisé (configurer `UPDATE_SERVER_URL`)

### Publier une release

1. Build l'app pour toutes les plateformes
2. Créer une GitHub Release
3. Upload les fichiers depuis `release/`
4. Les utilisateurs recevront la mise à jour automatiquement

## 🛠️ Développement

### Hot Reload

En mode dev (`pnpm dev`), l'app se recharge automatiquement quand vous modifiez:
- Code du processus principal (`src/main/`)
- Code du renderer (`src/renderer/`)

### Debugging

- **Main process**: Utiliser `console.log` (visible dans le terminal)
- **Renderer process**: Ouvrir DevTools (Cmd+Option+I sur macOS)

## 📝 Notes

- L'app utilise **Electron 38+** avec **Next.js 16** et **React 19**
- Le renderer est un export statique de Next.js pour de meilleures performances
- Les modules natifs sont automatiquement gérés (voir `native-deps.config.mjs`)

## 🐛 Troubleshooting

### "Module not found" errors

```bash
cd apps/desktop
pnpm install
pnpm postinstall
```

### Build échoue sur macOS

Vérifier que Xcode Command Line Tools est installé:
```bash
xcode-select --install
```

### L'app ne démarre pas

Vérifier les logs:
- macOS: `~/Library/Logs/Connect/`
- Windows: `%APPDATA%/Connect/logs/`
- Linux: `~/.config/Connect/logs/`
