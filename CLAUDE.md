# Fillo — Instructions pour Claude Code

## 1. Contexte du projet

Fillo est une application SaaS destinée aux commerçants.

Objectif : aider les commerçants à organiser leur activité et leurs ventes, notamment lorsque leurs clients les contactent principalement via WhatsApp.

Fillo n'est **ni** une marketplace, **ni** une boutique en ligne classique.

Le commerçant dispose d'un espace de gestion pour :

- gérer ses ventes ;
- suivre les ventes en cours et terminées ;
- organiser les informations de ses clients ;
- partager un lien Fillo avec ses clients.

Le client utilise une page liée au commerçant pour transmettre les informations d'une commande ou d'une demande.

Le produit doit rester simple, rapide, et pensé mobile-first.

---

## 2. Règle de travail : une page à la fois

Quand une tâche concerne une page précise de l'application :

- Se concentrer uniquement sur cette page et ses fichiers directement liés (route, sections dans `sections/.../<NomDeLaPage>PageSections/`, composants spécifiques à cette page).
- Ne pas lire ou explorer d'autres pages par précaution ou par exhaustivité.
- N'ouvrir une autre page que si c'est réellement nécessaire pour la tâche en cours : par exemple un composant partagé qu'elle utilise aussi, une donnée ou un type partagé, ou une dépendance directe identifiée pendant le travail. Dans ce cas, expliquer brièvement pourquoi cette lecture est nécessaire.
- Ne pas modifier une autre page « pendant qu'on y est », même si une amélioration similaire semble pertinente ailleurs.

---

## 3. Stack technique

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase

Ne pas introduire de nouvelle technologie ou dépendance importante sans raison valable. Avant d'ajouter une bibliothèque, vérifier si la fonctionnalité peut être réalisée proprement avec les outils déjà présents.

### Attention à la version de Next.js

Ce projet peut utiliser une version de Next.js avec des changements par rapport aux conventions habituelles (API, structure de fichiers). Avant d'écrire du code lié à Next.js dont on n'est pas certain, consulter la documentation locale dans `node_modules/next/dist/docs/` et respecter les avertissements de dépréciation qui s'y trouvent plutôt que de se fier uniquement à des connaissances générales sur Next.js.

---

## 4. Architecture Next.js

- Utiliser l'App Router et les conventions modernes de Next.js.
- Par défaut, utiliser des Server Components. N'ajouter `"use client"` que lorsqu'une fonctionnalité l'exige réellement (état local, effets, écouteurs d'événements, hooks navigateur, etc.).
- Ne jamais transformer un Server Component en Client Component par simplicité ou par habitude.
- Respecter la séparation entre interface utilisateur, logique métier, accès aux données et fonctions utilitaires.

---

## 5. Organisation du projet

Respecter l'organisation existante avant de créer de nouveaux dossiers.

Structure de référence :

- `app/(main)/` : routes des pages principales (avec navigation du bas)
- `app/(secondary)/` : routes des pages secondaires (auth, détails, publiques)
- `app/components/` : composants réutilisables (`ui/` et `formFields/`)
- `myPages/main/pages/` et `myPages/main/sections/<NomDeLaPage>PageSections/` : pages et sections propres à une page principale
- `myPages/secondary/pages/` et `myPages/secondary/sections/<NomDeLaPage>PageSections/` : pages et sections propres à une page secondaire
- `lib/` : fonctions utilitaires, configuration et logique partagée (accès Supabase, data layer serveur, actions serveur)
- `public/` : ressources statiques
- `supabase/migrations/` : migrations SQL (schéma, RLS, fonctions)
- `types/` : types TypeScript, une fois suffisamment nombreux pour justifier ce dossier

Chaque page a son propre sous-dossier de sections (ex. les sections de la home vont dans `myPages/secondary/sections/HomePageSections/`). Ne jamais mélanger les sections de plusieurs pages dans un même dossier. Les fichiers `app/**/page.tsx` restent de simples routes qui délèguent à un composant de `myPages/`.

Ne pas créer plusieurs dossiers ayant la même responsabilité. Avant de créer un nouveau composant, vérifier si un composant existant peut être réutilisé.

---

## 6. TypeScript

- Éviter `any`, y compris pour faire disparaître une erreur TypeScript rapidement.
- Créer ou modifier les types lorsque c'est nécessaire.
- Typer correctement les données provenant de Supabase, des formulaires, des paramètres utilisateur ou d'une API.
- Préférer des types explicites et compréhensibles à des types trop génériques.

---

## 7. Composants React

- Chaque composant doit avoir une responsabilité claire.
- Éviter les composants qui mélangent interface complète, logique métier, appels base de données et plusieurs fonctionnalités différentes.
- Découper un composant devenu trop complexe en composants plus petits et réutilisables.
- Ne pas créer d'abstraction uniquement pour réduire le nombre de lignes : privilégier simplicité et lisibilité.

---

## 8. Tailwind CSS

- Respecter le système de design existant du projet.
- Éviter de répéter de longues chaînes de classes : créer un composant réutilisable si c'est plus approprié.
- Les composants doivent accepter des variantes quand c'est pertinent (taille, état, variante, largeur, position).
- Ne pas construire une architecture de design system complexe sans nécessité.
- Le rendu doit être mobile-first.

---

## 9. Interface utilisateur

Les maquettes Figma sont la référence visuelle du projet. Quand une maquette existe, respecter : structure, espacements, dimensions, hiérarchie visuelle, couleurs, états des composants.

Ne jamais modifier arbitrairement le design pour des raisons personnelles. Si une partie de la maquette est techniquement ambiguë, demander une clarification plutôt que d'inventer une nouvelle expérience utilisateur importante.

L'interface doit rester simple, claire, rapide, adaptée au mobile, et facile à comprendre pour un commerçant peu technophile.

---

## 10. Responsive design

Conçu en priorité pour mobile. Toujours vérifier petit écran, écran moyen et desktop — jamais construire pour desktop d'abord puis adapter après coup. Éviter les valeurs fixes qui provoquent des débordements sur petits écrans.

---

## 11. Supabase

- Ne jamais exposer de secret ou de clé privée côté client.
- Les variables sensibles passent par les variables d'environnement appropriées, jamais écrites en dur dans le code.
- Respecter les règles de sécurité et les politiques RLS de Supabase.
- Avant de modifier la structure de la base de données, comprendre les relations existantes pour ne pas casser de fonctionnalités déjà développées.

---

## 12. Sécurité

- Ne jamais faire confiance aux données provenant du client (formulaires, URL, paramètres, requêtes, navigateur, API) : les valider avant utilisation.
- Ne jamais placer une logique de sécurité uniquement côté interface : vérifier les permissions côté serveur et/ou base de données.
- Ne jamais exposer de données appartenant à un autre commerçant : l'isolation des données entre commerçants est une priorité absolue.

---

## 13. Authentification et autorisation

- Un utilisateur authentifié ne doit accéder qu'aux données auxquelles il a réellement droit.
- Ne jamais considérer qu'un identifiant fourni par le navigateur suffit à autoriser l'accès à une ressource.
- Toujours vérifier la relation entre utilisateur, commerçant, client, vente et ressource demandée avant d'accorder un accès.

---

## 14. Gestion des données

- Avant de créer une nouvelle structure de données, vérifier les structures existantes pour éviter les doublons.
- Utiliser des relations cohérentes entre les entités.
- Entités principales : commerçant, utilisateur, client, vente, produit/article, statut de vente.
- Ne pas ajouter de tables ou de champs « au cas où » : le MVP doit rester simple.

---

## 15. États des ventes

Les statuts de vente et leurs couleurs doivent rester cohérents dans toute l'application. Ne jamais utiliser une couleur différente pour le même statut selon la page. Toute modification des statuts doit être réfléchie au niveau global de l'application, pas seulement pour la page en cours.

---

## 16. Formulaires

Les formulaires doivent être simples, fonctionner correctement sur mobile, afficher clairement les erreurs, empêcher les soumissions invalides quand c'est pertinent, et fournir un retour clair après une action. Prévoir les erreurs réseau, données manquantes et données invalides — pas seulement le cas où l'utilisateur saisit des données parfaites.

---

## 17. Gestion des erreurs

Ne jamais masquer silencieusement une erreur. Les erreurs importantes doivent être gérées explicitement. L'utilisateur doit recevoir un message compréhensible en cas d'échec, sans exposer d'informations techniques ou sensibles.

---

## 18. Performance

Éviter les appels inutiles à la base de données et les re-renders inutiles évitables simplement. Ne pas ajouter de cache ou d'optimisation complexe sans raison — ne pas optimiser prématurément.

Ordre de priorité :

1. Fonctionnalité correcte
2. Code compréhensible
3. Sécurité
4. Performance
5. Optimisation avancée

---

## 19. Modification du code existant

Avant de modifier un fichier :

1. lire le code existant ;
2. comprendre son rôle ;
3. vérifier ses dépendances et les composants qui l'utilisent ;
4. identifier les effets secondaires possibles.

Faire une modification ciblée plutôt que réécrire un fichier entier. Préserver le comportement existant qui n'est pas concerné par la demande.

---

## 20. Avant de créer du nouveau code

Avant de créer un composant, une fonction, un hook, un type, une table ou une utilité : vérifier si une solution existante peut être réutilisée ou légèrement adaptée. Éviter les doublons et les secondes versions d'une même abstraction.

---

## 21. Dépendances

Ne pas installer de package npm sans nécessité réelle. Avant d'ajouter une dépendance, vérifier si Next.js, React, TypeScript ou une dépendance déjà présente permettent de résoudre le problème, et considérer l'impact sur la maintenance. Si une nouvelle dépendance est réellement nécessaire, expliquer brièvement pourquoi.

---

## 22. Git

Ne pas supprimer ou écraser du travail existant sans raison. Ne pas modifier de fichiers non nécessaires à la tâche. Éviter les changements massifs non liés à la demande. Les modifications doivent rester faciles à comprendre et à réviser.

---

## 23. Consignes de collaboration

1. Avant toute modification touchant à la structure des données (types, schéma, relations entre entités, ajout/suppression de champs sur un modèle existant) : proposer la structure et attendre une validation explicite avant d'écrire le code. Ne jamais coder une décision de modélisation sans la soumettre au préalable.
2. Si une demande est ambiguë (portée du changement, comportement attendu dans les cas limites, impact sur d'autres parties du code) : poser la question avant de commencer plutôt que de choisir une interprétation par défaut.
3. Si un problème est identifié en cours de route (bug, incohérence, dette technique) qui n'est pas dans la demande actuelle : le signaler explicitement, ne pas le corriger silencieusement, ne pas l'ignorer.
4. Expliquer brièvement le pourquoi des choix techniques lorsqu'ils ne sont pas évidents.
5. Ne jamais supposer que le code proposé est automatiquement correct. Si une demande entre en conflit avec l'architecture existante, signaler le problème avant de procéder. Si une information importante manque, demander une clarification plutôt que d'inventer une architecture complète.
6. Ne pas créer de fonctionnalités non demandées. Ne pas ajouter de complexité « pour le futur » sans nécessité immédiate.

---

## 24. Priorité des décisions

En cas de conflit entre plusieurs choix, respecter cet ordre :

1. Sécurité
2. Fonctionnement correct
3. Architecture existante
4. Simplicité
5. Maintenabilité
6. Performance
7. Nouvelles abstractions ou optimisations

---

## 25. Principe général

Fillo est un MVP. La priorité est de construire une application simple, fiable, compréhensible, maintenable, sécurisée, adaptée au contexte réel des commerçants.

Ne pas transformer prématurément Fillo en une architecture complexe destinée à une entreprise de millions d'utilisateurs. Construire uniquement ce qui est nécessaire aujourd'hui, tout en évitant les décisions qui rendraient une évolution raisonnable difficile demain.

---

## 26. Objectif du code produit

Ton objectif est de produire du code :

- simple
- court
- maintenable
- réutilisable
- cohérent avec l'architecture existante
- adapté à la taille réelle du problème

Ne pas produire de code volumineux simplement pour donner l'impression d'avoir beaucoup travaillé.

Une petite fonctionnalité doit recevoir une petite solution.
