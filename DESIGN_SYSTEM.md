# Fillo - Design system

## Intention

Fillo est un outil de gestion commerciale pour des boutiques qui travaillent avec leurs clients via WhatsApp. L'interface doit être simple, rapide et rassurante, avec une identité de boutique de proximité plutôt qu'une esthétique de marketplace.

La maquette définit une direction mobile-first : fond blanc, bleu marine structurant, titres serif, contrôles compacts et accents chauds pour guider l'action.

## Tokens visuels

Les tokens sont définis dans `app/globals.css` et peuvent être utilisés avec les classes Tailwind générées par le thème.

### Couleurs

| Token           | Valeur    | Correspondance dans la maquette                       |
| --------------- | --------- | ----------------------------------------------------- |
| `text`          | `#172033` | Titres de pages, noms clients et textes principaux    |
| `navy`          | `#273452` | Logo Fillo, boutons principaux et navigation active   |
| `ink-muted`     | `#6F7075` | Sous-titres, aide, dates et numéros secondaires       |
| `surface`       | `#FFFFFF` | Fond de l'app, cartes clients et champs de formulaire |
| `surface-warm`  | `#FFFAF2` | Encadré de demande et zone « Je cherche ce modèle »   |
| `border`        | `#E7DFD3` | Contours des champs, cartes et séparateurs            |
| `border-strong` | `#CFC5B7` | Contour du sélecteur de statut et upload photo        |
| `orange`        | `#F3AA32` | Bouton Copier, état « En cours » et compteur en cours |
| `coral`         | `#E96D52` | Seconde couleur du bandeau de la fiche vente          |
| `green`         | `#2F8537` | Bouton WhatsApp et état « Complétée »                 |
| `blue`          | `#2186D4` | Badge « Nouvelle » et indicateur de nouvelle demande  |
| `grey`          | `#A7A49D` | État « Vente perdue » et informations neutres         |

Le dégradé de la fiche vente utilise uniquement `orange` et `coral`. Il ne doit pas devenir un fond décoratif global.

## Correspondance avec la maquette

Les noms ci-dessous sont les noms de référence à utiliser dans le code. Le texte après le `/` indique l'élément visible correspondant dans la planche.

### Écran d'accueil et création de compte

| Nom du design system | Élément dans la maquette                                          |
| -------------------- | ----------------------------------------------------------------- |
| `BrandMark`          | Carré bleu avec la lettre `F` et le nom `Fillo`                   |
| `MarketingHeading`   | « Ne perdez plus aucun client WhatsApp. »                         |
| `SupportingText`     | « Un lien unique en bio... »                                      |
| `ProductImagePair`   | Les deux photos de tissus sous le texte d'accueil                 |
| `FeatureChecklist`   | Les trois lignes avec coches : lien bio, photos, suivi des ventes |
| `PrimaryButton`      | « Créer mon compte gratuit »                                      |
| `FormFooterHint`     | « Gratuit - Inscription en 30 secondes »                          |
| `PhoneField`         | Champ « Numéro de téléphone » avec préfixe `GN +224`              |
| `TextField`          | Champ « Nom de la boutique »                                      |
| `PasswordField`      | Champ « Mot de passe » avec icône de visibilité                   |
| `SubmitButton`       | « Continuer »                                                     |
| `TextLink`           | « Déjà un compte ? Se connecter »                                 |

### Tableau de bord commerçant

| Nom du design system | Élément dans la maquette                                     |
| -------------------- | ------------------------------------------------------------ |
| `DashboardHeader`    | Bandeau bleu avec « Boutique Diallo » et « Tableau de bord » |
| `IconButton`         | Boutons notification et partage dans l'en-tête               |
| `ShareLinkCard`      | Bloc « Votre lien client » avec `fillo.app/diallo-tissus`    |
| `AccentButton`       | Bouton orange « Copier »                                     |
| `PageHeading`        | « Résumé de vos ventes »                                     |
| `MetricCard`         | Indicateurs « En cours 5 » et « Complétées 18 »              |
| `SectionHeading`     | « À traiter immédiatement » avec compteur rouge `2`          |
| `RequestCard`        | Carte client « Mamadou Bah » avec détail de la demande       |
| `StatusBadge`        | Badge bleu « Nouvelle » sur la carte de demande              |

### Liste des clients

| Nom du design system | Élément dans la maquette                               |
| -------------------- | ------------------------------------------------------ |
| `PageHeading`        | « Mes clients (42) »                                   |
| `SearchField`        | Champ « Rechercher nom ou numéro... » avec icône loupe |
| `ClientList`         | Colonne des trois fiches clients                       |
| `ClientListItem`     | Une ligne avec avatar, nom, numéro et statut           |
| `Avatar`             | Initiales `MB`, `FC` ou `AD` dans un carré coloré      |
| `StatusBadge`        | Badges « Nouvelle », « En cours » et « Complétée »     |

### Fiche client

| Nom du design system | Élément dans la maquette                                          |
| -------------------- | ----------------------------------------------------------------- |
| `BackButton`         | Flèche retour et libellé « Fiche client »                         |
| `ClientProfile`      | Avatar `MB`, nom « Mamadou Bah » et numéro                        |
| `SuccessButton`      | « Discuter sur WhatsApp »                                         |
| `SectionHeading`     | « Historique des demandes (2) »                                   |
| `RequestHistoryList` | Les deux demandes « Bazin riche VIP » et « Tissu wax hollandais » |

### Fiche vente et page client publique

| Nom du design system | Élément dans la maquette                                    |
| -------------------- | ----------------------------------------------------------- |
| `BackButton`         | Retour « Vente #FL-892 »                                    |
| `DangerIconButton`   | Icône corbeille rouge                                       |
| `SaleStatusBanner`   | Bandeau horizontal orange/coral de la fiche vente           |
| `SaleSummary`        | « Client : Mamadou Bah » et « Bazin riche (couleur bleue) » |
| `RequestNote`        | Encadré avec le message de demande du client                |
| `StatusSelect`       | Sélecteur « Nouvelle demande » et ses options               |
| `PhotoUpload`        | Zone « Prendre une photo ou choisir » en pointillés         |
| `PublicBrandHeader`  | Logo `D`, « Boutique Diallo Tissus » et sous-texte          |
| `PublicRequestForm`  | Nom complet, numéro WhatsApp, besoin et photo du produit    |
| `SubmitButton`       | « Envoyer ma demande »                                      |

### Navigation commune

| Nom du design system | Élément dans la maquette                                     |
| -------------------- | ------------------------------------------------------------ |
| `BottomNavigation`   | Barre blanche fixe en bas des écrans commerçant              |
| `NavItem`            | `Dashboard`, `Clients`, `Ventes` et `Réglages`               |
| `ActiveNavItem`      | Onglet `Clients` ou `Dashboard` en bleu marine selon l'écran |

### Typographie

- `font-display` : Georgia, pour les titres, les compteurs et les informations commerciales importantes.
- `font-body` : Trebuchet MS, pour les formulaires, boutons, labels et textes courants.
- Texte courant : 14 px avec un interligne de 1.45.
- Labels : 11 à 12 px, gras, en casse phrase.
- Titres d'écran : 20 à 24 px, serif, gras.
- Compteurs : 20 à 24 px, serif, gras.

### Espacement et formes

L'échelle d'espacement est basée sur 4 px : `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40`.

- Contrôles : `--radius-control`, soit 6 px.
- Cartes et panneaux : `--radius-card`, soit 8 px maximum.
- Bordures : 1 px et jamais noires.
- Ombre : `--shadow-card`, très légère et réservée aux surfaces qui doivent se détacher du fond.
- Cibles tactiles : au moins 40 px de hauteur, idéalement 44 px pour les actions principales.

## Composants

### Boutons

- **Primaire** : fond `navy`, texte blanc, hauteur 40 à 44 px. Le texte courant utilise `text`, plus sombre.
- **Accent** : fond `orange`, texte `navy`.
- **Succès** : fond `green`, texte blanc. Utilisé notamment pour « Discuter sur WhatsApp ».
- **Secondaire** : surface blanche ou transparente, contour `border-strong`.
- **Icône** : bouton carré, avec un libellé accessible et une infobulle si l'icône n'est pas évidente.

Une vue ne doit présenter qu'une action principale clairement dominante.

### Champs et formulaires

Le label est toujours visible au-dessus du champ. Les champs utilisent une surface blanche, un contour `border`, une hauteur de 40 à 48 px et le rayon de contrôle. Le placeholder explique le format attendu, mais ne remplace jamais le label.

Les erreurs sont affichées près du champ, avec un texte court et compréhensible. Le focus utilise le contour bleu et `shadow-focus`.

### Statuts

Chaque statut combine une pastille et un texte ; la couleur ne doit jamais être le seul signal.

| Statut           | Couleur  |
| ---------------- | -------- |
| Nouvelle demande | `blue`   |
| En cours         | `orange` |
| Vente complétée  | `green`  |
| Vente perdue     | `grey`   |

Cette correspondance reste identique dans le tableau de bord, les listes clients et les fiches de vente.

### Cartes et listes

Les cartes sont réservées aux clients, demandes et indicateurs. Elles utilisent `surface`, une bordure fine et une ombre discrète. Une ligne de liste présente d'abord le nom, puis le détail en texte secondaire, avec le statut aligné à droite lorsque l'espace le permet.

### Navigation mobile

La navigation basse est fixe, blanche et haute d'environ 68 px. Elle contient quatre entrées : Tableau de bord, Clients, Ventes et Réglages. L'entrée active est `navy`, les autres sont sourdes. Chaque icône possède un libellé court.

## Règles d'interface

1. Concevoir d'abord pour un petit écran, puis vérifier les tailles moyenne et desktop.
2. Montrer les informations commerciales importantes avant le scroll.
3. Garder les textes d'aide courts, concrets et orientés action.
4. Préserver une hiérarchie forte entre titre, donnée, métadonnée et statut.
5. Ne pas inventer une interaction importante lorsque la maquette est ambiguë.
6. Conserver la même couleur pour le même statut partout dans l'application.
