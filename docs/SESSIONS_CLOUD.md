# Sessions cloud (claude.ai/code) : famille-cedric

Ce dépôt est **public** : aucune donnée personnelle, aucune valeur de secret, ni ici ni dans un
commit.

## Environnement

`sans-secret` : aucune clé, aucun domaine ajouté.

- **Network access** : `Limited`, « Allow package managers » cochée (npm et GitHub suffisent).
- **Setup script** : `scripts/cloud-setup.sh` (`npm ci`). Le hook `SessionStart` du dépôt le lance
  déjà quand `CLAUDE_CODE_REMOTE` est défini.
- **Secrets** : aucun. Les deux variables de l'app (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) restent dans Vercel ; les noms sont dans `.env.example`.

## Limites

- `npm run lint` fonctionne ; `npm run build` et `npm run dev` demandent les deux variables
  Supabase, absentes du cloud.
- Le contenu du site vit dans la base, pas dans le dépôt : une session cloud ne le voit pas et ne
  le modifie pas.
- Fusion : `gh pr merge` est refusé dans le cloud ; passer par l'API REST de GitHub. Le diff est
  montré à Elodia avant toute fusion.
