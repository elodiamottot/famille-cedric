# famille-cedric : consignes pour Claude

## Gestes qu'Elodia seule peut faire (règle du 19/11/2026)

Connexion, mot de passe, code, clic dans une console, feu vert : **je ne l'interromps plus à chaque
fois**.

- J'ajoute le geste à la liste **« À faire par Elodia »** : fichier `~/.claude/A_FAIRE_ELODIA.md`
  (hors dépôt, commun à tous ses projets).
- Chaque entrée donne : **l'app**, **le lien direct**, **les étapes exactes** (numérotées : quelle
  fenêtre, quel champ, quel bouton, ce qu'elle doit voir ensuite), **ce que le geste débloque**, la
  date et le dépôt ou la session qui le demande.
- **J'avance sur tout ce qui ne dépend pas d'elle.** Je ne m'arrête que si plus rien n'avance sans
  elle ; dans ce cas, un seul message, avec toute la liste d'un coup.
- Avant d'ajouter un geste : vérifier que je ne peux vraiment pas le faire moi-même, et qu'il n'est
  pas déjà dans la liste. Une fois le geste fait, je coche l'entrée.
- Session sans accès à son ordinateur (session cloud) : la liste figure en fin de réponse, sous
  « À faire par Elodia » ; la prochaine session locale la recopie dans le fichier.
- Les garde-fous ne bougent pas : ce qui demande son feu vert attend son feu vert (dans la liste,
  sans relance), et je ne saisis jamais ses mots de passe.

## Sessions cloud (claude.ai/code)

Une session cloud n'a ni le Mac d'Elodia, ni `~/.claude` (consignes globales, mémoires, liste
« À faire par Elodia »), ni Claude in Chrome, ni ses comptes connectés. **Ce fichier est la seule
consigne chargée** : il doit se suffire.

- **Langue** : français, tutoiement. « Handicap » seulement pour le cadre légal et les dispositifs
  publics, jamais pour décrire une personne ou la communauté : on dit personne sourde, personnes
  sourdes et signantes, communauté signante, accessibilité, accueil en langue des signes.
- **Démarrage** : `scripts/cloud-setup.sh` installe les dépendances. Le hook `SessionStart` de
  `.claude/settings.json` le lance tout seul quand `CLAUDE_CODE_REMOTE` est défini ; dans une session
  à plusieurs dépôts, le lancer à la main.
- **Secrets** : jamais de valeur dans le dépôt, un commit, un log ou le chat. Les clés sont saisies
  par Elodia dans l'environnement cloud (« Network secrets », liés à un hôte). Une clé absente est un
  geste pour « À faire par Elodia », jamais une raison de la chercher ailleurs ni de la contourner.
- **Un environnement par structure** : une session ne voit que les clés de son environnement. Ne pas
  demander celles d'une autre structure.
- **GitHub** : `gh pr …` et `gh issue …` sont refusés (GraphQL). Passer par l'API REST :
  `gh api repos/elodiamottot/<dépôt>/pulls …`. État d'un déploiement : statuts du commit
  (`gh api repos/elodiamottot/<dépôt>/commits/<sha>/status`).
- **Impossible dans le cloud** : tester dans le vrai Chrome d'Elodia (Previews `test`, Gmail,
  Pennylane, consoles), tout ce qui demande une session connectée. Le dire en fin de réponse, sous
  « À vérifier en local », sans prétendre que c'est vérifié.
- **« À faire par Elodia »** : la liste figure en fin de réponse ; la prochaine session locale la
  recopie dans `~/.claude/A_FAIRE_ELODIA.md`.
- Environnements, domaines autorisés, noms des secrets et limites : `docs/SESSIONS_CLOUD.md`.
