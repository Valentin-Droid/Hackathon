CREATE TABLE pdf_files (
file_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
file_name VARCHAR(250),
uploaded_file TIMESTAMP,
file_content LONGTEXT
);

CREATE TABLE site_stats (
pdf_read INT,
cards_generate INT,
adv_notes DECIMAL(3 ,1),
user VARCHAR(255),
total_note DECIMAL(3 ,1),
cards_evaluated INT
);

INSERT INTO site_stats (pdf_read, cards_generate, adv_notes, user, total_note, cards_evaluated)
VALUES (0, 0, NULL, 'local', 0, 0);
