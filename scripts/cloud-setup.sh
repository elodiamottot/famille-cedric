#!/usr/bin/env bash
# Démarrage d'une session cloud (claude.ai/code) : installe les dépendances.
# Lancé par le hook SessionStart (.claude/settings.json) quand CLAUDE_CODE_REMOTE est défini.
# Peut aussi être collé tel quel dans le champ « Setup script » de l'environnement.
# Aucun secret ici : les clés vivent dans l'environnement cloud, jamais dans le dépôt.
set -euo pipefail
cd "$(dirname "$0")/.."
npm ci --no-audit --no-fund
echo "Dépendances installées. Vérification : npm run lint"
