# Hackathon

Ce dépôt contient deux parties principales :

- **hackathon-frontend** : Le projet front-end pour l'interface utilisateur.
- **hackathon-backend** : Le projet back-end pour la gestion de l'API et des fonctionnalités de conversion de PDF en texte.

## Objectif du projet

Le projet "Hackathon" a pour but de créer une plateforme web qui permet aux utilisateurs de convertir leurs cours PDF en flashcards interactives. Ces flashcards sont générées à partir du contenu extrait du PDF et présentent des questions et réponses générées automatiquement.

## Fonctionnalités principales

- **Téléchargement de fichiers PDF** pour extraction du texte.
- **Utilisation de l'API OpenAI** pour générer des questions et des réponses à partir du texte extrait.
- **Affichage interactif** des questions et réponses sous forme de cartes flip.
- **Séparation claire entre le front-end (interface) et le back-end (API et logique de traitement).**

## Exemple d'utilisation

Voici un exemple d'utilisation du site où un utilisateur télécharge un fichier PDF et génère automatiquement des flashcards interactives :

![Exemple d'utilisation](./pdfToFlashCard.gif)

---

## hackathon-frontend

### Technologies utilisées

- **Frontend** :
  - [React](https://reactjs.org/)
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)

### Installation et démarrage

1. Clonez le dépôt :

   ```bash
   git clone https://github.com/Valentin-Droid/Hackathon.git
   ```

2. Accédez au dossier `hackathon-frontend` :

   ```bash
   cd hackathon/hackathon-frontend
   ```

3. Installez les dépendances :

   ```bash
   npm install
   ```

4. Créez un fichier `.env.local` avec les variables nécessaires (si nécessaire).

5. Lancez le projet en mode développement :

   ```bash
   npm run dev
   ```

   L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## hackathon-backend

### Technologies utilisées

- **Backend** :
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [OpenAI API](https://openai.com/) pour générer les questions et réponses.
  - Outils de conversion PDF en texte.

### Installation et démarrage

1. Accédez au dossier `hackathon-backend` :

   ```bash
   cd hackathon/hackathon-backend
   ```

2. Installez les dépendances :

   ```bash
   npm install
   ```

3. Créez un fichier `.env` pour ajouter les clés d'API (par exemple, pour l'API OpenAI).

4. Lancez le serveur back-end :

   ```bash
   npm run start
   ```

   Le serveur back-end sera disponible sur [http://localhost:3001](http://localhost:3001) ou un autre port si configuré.

### Fonctionnalités du backend

- **Conversion de PDF en texte** : Extraction automatique du contenu textuel des PDF.
- **Génération de flashcards** : Utilisation de l'API OpenAI pour générer automatiquement des questions et des réponses à partir du contenu extrait.

## Auteur

[Valentin DRELON] - [valentin.drelon@ynov.com](mailto:valentin.drelon@ynov.com)

[Kellian KAUFFMANN] - [kellian.kauffmann@ynov.com](mailto:kellian.kauffmann@ynov.com)

[Anh Nguyen Hoang Phuong] - [hoangphuonganh.nguyen@ynov.com](mailto:hoangphuonganh.nguyen@ynov.com)

[Luca CHABOISSIER] - [luca.chaboissier@ynov.com](mailto:luca.chaboissier@ynov.com)
