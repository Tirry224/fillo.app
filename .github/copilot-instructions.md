# Fillo — Instructions GitHub Copilot

## 1. Contexte du projet

Fillo est une application SaaS destinée aux commerçants.

L'objectif principal est d'aider les commerçants à organiser leur activité et leurs ventes, notamment lorsque leurs clients les contactent principalement via WhatsApp.

Fillo n'est PAS une marketplace et n'est PAS une boutique en ligne classique.

Le commerçant possède un espace de gestion lui permettant notamment de :

- gérer ses ventes ;
- suivre les ventes en cours ;
- suivre les ventes terminées ;
- organiser les informations de ses clients ;
- partager un lien Fillo avec ses clients.

Le client peut utiliser une page liée au commerçant pour transmettre les informations nécessaires à une commande ou une demande.

Le produit doit rester simple, rapide et particulièrement adapté à une utilisation mobile.

---

## 2. Stack technique

Le projet utilise actuellement :

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase

Ne pas introduire une nouvelle technologie ou dépendance importante sans raison valable.

Avant d'ajouter une bibliothèque, vérifier si la fonctionnalité peut être réalisée proprement avec les outils déjà présents dans le projet.

---

## 3. Architecture Next.js

Utiliser l'App Router de Next.js.

Respecter les conventions modernes de Next.js.

Par défaut :

- utiliser les Server Components ;
- utiliser les Client Components uniquement lorsqu'ils sont nécessaires ;
- ajouter `"use client"` uniquement lorsqu'une fonctionnalité nécessite réellement un composant client.

Ne pas transformer inutilement des composants Server en Client Components.

Respecter la séparation entre :

- interface utilisateur ;
- logique métier ;
- accès aux données ;
- fonctions utilitaires.

---

## 4. Organisation du projet

Respecter l'organisation existante du projet avant de créer de nouveaux dossiers.

Structure indicative :

- `app/(main)/` : routes des pages principales (avec navigation du bas)
- `app/(secondary)/` : routes des pages secondaires (auth, détails, publiques)
- `app/components/` : composants réutilisables (ui/ et formFields/)
- `sections/main/<NomDeLaPage>PageSections/` : sections propres aux pages principales
- `sections/secondary/<NomDeLaPage>PageSections/` : sections propres aux pages secondaires
- `lib/` : fonctions utilitaires, configuration et logique partagée
- `public/` : ressources statiques
- `types/` : types TypeScript lorsqu'ils sont suffisamment nombreux pour justifier ce dossier

Chaque page doit avoir son propre sous-dossier de sections. Par exemple, les sections de la home vont dans `sections/secondary/HomePageSections/`. Ne pas mélanger les sections de plusieurs pages dans un même dossier.

Ne pas créer plusieurs dossiers ayant la même responsabilité.

Avant de créer un nouveau composant, vérifier si un composant existant peut être réutilisé.

---

## 5. TypeScript

Utiliser TypeScript correctement.

Éviter `any`.

Ne pas utiliser `any` simplement pour faire disparaître une erreur TypeScript.

Créer ou modifier les types lorsque cela est nécessaire.

Les données provenant de Supabase, des formulaires, des paramètres utilisateur ou d'une API doivent être correctement typées.

Privilégier des types explicites et compréhensibles.

---

## 6. Composants React

Les composants doivent avoir une responsabilité claire.

Éviter les composants extrêmement longs contenant :

- toute l'interface ;
- toute la logique métier ;
- les appels à la base de données ;
- la gestion de plusieurs fonctionnalités différentes.

Lorsqu'un composant devient trop complexe, le découper en composants plus petits et réutilisables.

Ne pas créer des composants inutilement abstraits simplement pour réduire le nombre de lignes.

Privilégier la simplicité et la lisibilité.

---

## 7. Tailwind CSS

Utiliser Tailwind CSS pour le styling.

Respecter le système de design existant du projet.

Éviter de répéter de très longues chaînes de classes lorsque la création d'un composant réutilisable est plus appropriée.

Les composants doivent pouvoir accepter des variantes lorsque cela est nécessaire.

Exemple :

- taille ;
- état ;
- variante ;
- largeur ;
- position.

Ne pas créer une architecture de design system complexe sans nécessité.

Le rendu doit être mobile-first.

---

## 8. Interface utilisateur

Les maquettes Figma constituent la référence visuelle du projet.

Lorsqu'une maquette existe :

- respecter sa structure ;
- respecter les espacements ;
- respecter les dimensions ;
- respecter la hiérarchie visuelle ;
- respecter les couleurs ;
- respecter les états des composants.

Ne pas modifier arbitrairement le design pour des raisons personnelles.

Si une partie de la maquette est techniquement ambiguë, demander une clarification plutôt que d'inventer une nouvelle expérience utilisateur importante.

L'interface doit rester :

- simple ;
- claire ;
- rapide ;
- adaptée aux écrans mobiles ;
- facile à comprendre pour un commerçant peu technophile.

---

## 9. Responsive design

Fillo doit être conçu en priorité pour mobile.

Toujours vérifier :

- petit écran ;
- écran moyen ;
- desktop.

Ne pas construire l'interface uniquement pour desktop puis essayer de la rendre responsive après coup.

Éviter les valeurs fixes qui provoquent des débordements ou cassent l'interface sur petits écrans.

---

## 10. Supabase

Supabase est utilisé pour la base de données et les fonctionnalités backend nécessaires.

Ne jamais exposer de secret ou de clé privée côté client.

Les variables sensibles doivent utiliser les variables d'environnement appropriées.

Ne jamais écrire de secrets directement dans le code.

Respecter les règles de sécurité et les politiques RLS de Supabase.

Avant de modifier la structure de la base de données, comprendre les relations existantes afin de ne pas casser les fonctionnalités déjà développées.

---

## 11. Sécurité

Ne jamais faire confiance aux données provenant du client.

Les données reçues depuis :

- formulaires ;
- URL ;
- paramètres ;
- requêtes ;
- navigateur ;
- API ;

doivent être validées avant d'être utilisées lorsqu'une validation est nécessaire.

Ne jamais mettre une logique de sécurité uniquement dans l'interface.

Les permissions doivent également être vérifiées côté serveur ou au niveau de la base de données lorsque cela est approprié.

Ne jamais exposer de données appartenant à un autre commerçant.

L'isolation des données entre commerçants est une priorité.

---

## 12. Authentification et autorisation

Un utilisateur authentifié ne doit pouvoir accéder qu'aux données auxquelles il a réellement droit.

Ne jamais considérer qu'un identifiant fourni par le navigateur est suffisant pour autoriser l'accès à une ressource.

Toujours vérifier la relation entre :

- utilisateur ;
- commerçant ;
- client ;
- vente ;
- ressource demandée.

---

## 13. Gestion des données

Avant de créer une nouvelle structure de données, vérifier les structures existantes.

Éviter les doublons.

Utiliser des relations cohérentes entre les entités.

Les principales entités de Fillo peuvent notamment inclure :

- commerçant ;
- utilisateur ;
- client ;
- vente ;
- produit ou article ;
- statut de vente.

Ne pas ajouter des tables ou champs uniquement parce qu'ils pourraient être utiles un jour.

Le MVP doit rester simple.

---

## 14. États des ventes

Les statuts des ventes doivent rester cohérents dans toute l'application.

Les couleurs utilisées pour représenter les statuts doivent avoir une signification constante.

Ne pas utiliser une couleur différente pour le même statut selon la page.

Toute modification des statuts doit être réfléchie au niveau global de l'application.

---

## 15. Formulaires

Les formulaires doivent :

- être simples ;
- fonctionner correctement sur mobile ;
- afficher clairement les erreurs ;
- empêcher les soumissions invalides lorsque cela est nécessaire ;
- fournir un retour clair après une action.

Ne pas considérer uniquement le cas où l'utilisateur saisit des données parfaites.

Prévoir les erreurs réseau, données manquantes et données invalides lorsque cela est pertinent.

---

## 16. Gestion des erreurs

Ne jamais masquer silencieusement une erreur.

Les erreurs importantes doivent être gérées explicitement.

L'utilisateur doit recevoir un message compréhensible lorsqu'une action échoue.

Les messages destinés à l'utilisateur doivent être simples et ne doivent pas exposer d'informations techniques ou sensibles.

---

## 17. Performance

Éviter les appels inutiles à la base de données.

Éviter les re-renders inutiles lorsque cela peut être fait simplement.

Ne pas ajouter de mécanismes de cache ou d'optimisation complexes sans raison.

Priorité :

1. fonctionnalité correcte ;
2. code compréhensible ;
3. sécurité ;
4. performance ;
5. optimisation avancée.

Ne pas optimiser prématurément.

---

## 18. Modifications du code existant

Avant de modifier un fichier :

1. lire le code existant ;
2. comprendre son rôle ;
3. vérifier ses dépendances ;
4. vérifier les composants qui l'utilisent ;
5. identifier les effets secondaires possibles.

Ne pas réécrire complètement un fichier lorsqu'une modification ciblée suffit.

Préserver le comportement existant lorsqu'il n'est pas concerné par la demande.

---

## 19. Avant de créer du nouveau code

Avant de créer :

- un composant ;
- une fonction ;
- un hook ;
- un type ;
- une table ;
- une utilité ;

vérifier si une solution existante peut être réutilisée.

Éviter les doublons.

Si une abstraction existante peut être légèrement améliorée pour répondre au besoin, privilégier cette solution plutôt que créer une deuxième version.

---

## 20. Dépendances

Ne pas installer de package npm sans nécessité.

Avant d'ajouter une dépendance :

- vérifier si Next.js, React ou TypeScript permettent déjà de résoudre le problème ;
- vérifier si une dépendance existante peut être utilisée ;
- considérer l'impact sur la maintenance du projet.

Si une nouvelle dépendance est réellement nécessaire, expliquer brièvement pourquoi.

---

## 21. Git

Ne pas supprimer ou écraser du travail existant sans raison.

Ne pas modifier des fichiers qui ne sont pas nécessaires à la tâche.

Éviter les changements massifs non liés à la demande.

Les modifications doivent être faciles à comprendre et à réviser.

---

## 22. Règle importante concernant l'IA

Ne jamais supposer que le code proposé est automatiquement correct.

Avant de modifier plusieurs fichiers, comprendre l'architecture existante.

Si une demande entre en conflit avec l'architecture actuelle, signaler le problème avant de procéder.

Si une information importante manque, demander une clarification plutôt que d'inventer une architecture complète.

Ne pas créer de fonctionnalités non demandées.

Ne pas ajouter de complexité "pour le futur" sans nécessité immédiate.

---

## 23. Priorité des décisions

En cas de conflit entre plusieurs choix, respecter cet ordre :

1. Sécurité
2. Fonctionnement correct
3. Architecture existante
4. Simplicité
5. Maintenabilité
6. Performance
7. Nouvelles abstractions ou optimisations

---

## 24. Principe général

Fillo est un MVP.

La priorité est de construire une application :

- simple ;
- fiable ;
- compréhensible ;
- maintenable ;
- sécurisée ;
- adaptée au contexte réel des commerçants.

Ne pas transformer prématurément Fillo en une architecture complexe destinée à une entreprise de millions d'utilisateurs.

Construire uniquement ce qui est nécessaire aujourd'hui, tout en évitant les décisions qui rendraient une évolution raisonnable difficile demain.
