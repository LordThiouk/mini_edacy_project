# Edacy - Application de Gestion de Produits

Edacy est une application web CRUD (Create, Read, Update, Delete) complète permettant aux utilisateurs de gérer un catalogue de produits. Cette application a été développée avec Next.js, React, et utilise une base de données PostgreSQL hébergée sur Neon.

## Fonctionnalités

- **Authentification des utilisateurs**
  - Inscription
  - Connexion
  - Déconnexion
  - Profil utilisateur

- **Gestion des produits**
  - Création de nouveaux produits
  - Affichage de la liste des produits
  - Affichage des détails d'un produit
  - Modification des produits
  - Suppression des produits
  - Filtrage des produits par recherche

- **Interface utilisateur**
  - Design responsive
  - Navigation intuitive
  - Tableau de bord utilisateur

## Technologies utilisées

- **Frontend**
  - Next.js (React)
  - Tailwind CSS
  - shadcn/ui (composants UI)
  - Lucide React (icônes)

- **Backend**
  - Next.js Server Actions
  - API Routes Next.js
  - Neon PostgreSQL (base de données)

## Installation

1. Clonez le dépôt
\`\`\`bash
git clone https://github.com/LordThiouk/mini_edacy_project
cd mini_edacy_project
\`\`\`

2. Installez les dépendances
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. Configurez les variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :
\`\`\`
DATABASE_URL=votre_url_de_connexion_neon
\`\`\`

4. Lancez le serveur de développement
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Configuration de la base de données

L'application utilise une base de données PostgreSQL hébergée sur Neon. Pour configurer votre propre base de données :

1. Créez un compte sur [Neon](https://neon.tech)
2. Créez un nouveau projet
3. Obtenez l'URL de connexion et ajoutez-la à votre fichier `.env.local`
4. Exécutez les scripts SQL suivants pour créer les tables nécessaires :

\`\`\`sql
-- Création de la table User
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Création de la table Product
CREATE TABLE "Product" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL,
  category TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Structure du projet

\`\`\`
product-hub/
├── app/                    # Dossier principal de l'application Next.js
│   ├── dashboard/          # Page du tableau de bord
│   │   ├── actions.ts      # Server Actions pour le tableau de bord
│   │   └── page.tsx        # Page du tableau de bord
│   ├── login/              # Page de connexion
│   ├── products/           # Pages de gestion des produits
│   │   ├── actions.ts      # Server Actions pour les produits
│   │   ├── [id]/           # Page de détail d'un produit
│   │   │   ├── actions.ts  # Server Actions pour un produit spécifique
│   │   │   └── page.tsx    # Page de détail d'un produit
│   │   ├── new/            # Page de création d'un produit
│   │   │   ├── actions.ts  # Server Actions pour la création d'un produit
│   │   │   └── page.tsx    # Page de création d'un produit
│   │   └── page.tsx        # Page de liste des produits
│   ├── profile/            # Page de profil utilisateur
│   ├── register/           # Page d'inscription
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Page d'accueil
├── components/             # Composants réutilisables
│   └── ui/                 # Composants UI
├── lib/                    # Fonctions utilitaires et logique métier
│   ├── auth.ts             # Logique d'authentification
│   ├── db.ts               # Configuration de la base de données
│   ├── products.ts         # Logique de gestion des produits
│   └── types.ts            # Types TypeScript
├── middleware.ts           # Middleware Next.js pour la protection des routes
├── public/                 # Fichiers statiques
└── README.md               # Documentation
\`\`\`

## Utilisation

1. **Inscription et connexion**
   - Créez un compte en utilisant la page d'inscription
   - Connectez-vous avec vos identifiants

2. **Gestion des produits**
   - Accédez à la liste des produits via le menu de navigation
   - Créez un nouveau produit en cliquant sur "Nouveau produit"
   - Consultez les détails d'un produit en cliquant dessus
   - Modifiez ou supprimez un produit depuis la page de détails

3. **Tableau de bord**
   - Visualisez un résumé de vos produits
   - Accédez rapidement à vos produits récents

## Comptes de démonstration

L'application est préchargée avec les comptes de démonstration suivants :

- Email: jean@example.com / Mot de passe: password123
- Email: marie@example.com / Mot de passe: secure456
- Email: pierre@example.com / Mot de passe: pierre789

## Notes importantes

- Cette application utilise des Server Actions Next.js pour communiquer avec la base de données.
- L'authentification est simulée avec des cookies HTTP. Dans un environnement de production, il faudrait utiliser une solution plus robuste comme NextAuth.js, Auth0, etc.
- Le hachage des mots de passe est simulé. Dans un environnement de production, il faudrait utiliser bcrypt ou Argon2.

