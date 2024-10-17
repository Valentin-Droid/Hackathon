# Hackathon

- Pré acquis : Avoir installé Mariadb

1. Lancer mysql avec la commande : mysql -u root -p et entrer le mot de passe.
2. Créer une base de données : CREATE DATABASE hackathon
3. Une fois la base est créée : USE hackathon
4. Créer une table pdf_files qui permet de stocker les informations d’un fichier :

- Identifiant du fichier en type Integer
- Nom du fichier en type chaine de caractères.
- Information de date mise à jour le fichier en type datetime
- Contenu du fichier en type chaine de caractère.
  
  CREATE TABLE pdf_files (
  file_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  file_name VARCHAR(250),
  uploaded_file TIMESTAMP,
  file_content LONGTEXT
  ) ;

5. Créer une table site_stats qui permet de stocker les informations d’un fichier :

- Un compteur de fichier upload
- Un compteur de cartes générés
- La note moyenne des réponses générés (note que les utilisateurs peuvent mettre sur une carte)
- Un compte (aujourd'hui on a que le compte "local" qui prend les stats globales, mais un futur avec des sessions et stats
personnalisés peut être envisagé).
- Des variables pour calculer la moyenne

  CREATE TABLE site_stats (
  pdf_read INT,
  cards_generate INT,
  adv_notes DECIMAL(3 ,1),
  user VARCHAR(255),
  total_note DECIMAL(3 ,1),
  cards_evaluated INT
  );

  Pour initialiser en local les stats :
  
  INSERT INTO site_stats (pdf_read, cards_generate, adv_notes, user, total_note, cards_evaluated)
  VALUES (0, 0, NULL, 'local', 0, 0);

  Tout le SQL peut être retouvé dans le fichier init_db.sql dans le dossier hackathon-backend
