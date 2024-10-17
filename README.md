# Hackathon

-	Pré acquis : Avoir installé Mariadb 
1.	Lancer mysql avec la commande : mysql -u root -p et entrer le mot de passe. 
2.	Créer une base de données : CREATE DATABASE nom_bdd
3.	Une fois la base est créée : USE nom_bdd
4.	Créer une table pdf_files qui permet de stocker les informations d’un fichier : 
-	Identifiant du fichier en type Integer 
-	 Nom du fichier en type chaine de caractères.
-	Information de date mise à jour le fichier en type datetime
-	Contenu du fichier en type chaine de caractère. 
CREATE TABLE pdf_files (
file_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, 
file_name VARCHAR(250), 
uploaded_file TIMESTAMP, 
file_content LONGTEXT
) ; 
5.	Vérifier si la table pdf_files est bien créée et toutes les colonnes sont bien en utilisant : 
DESCRIBE pdf_files;

