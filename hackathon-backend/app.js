const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql2");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "hackathon",
});

const cors = require("cors");
app.use(cors());

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données:", err);
    return;
  }
  console.log("Connecté à la base de données MySQL");
});

const upload = multer({ storage: multer.memoryStorage() });

app.post("/extract-pdf-text", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Aucun fichier PDF téléchargé.");
    }

    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);

    res.status(200).json({ text: data.text });
  } catch (err) {
    console.error("Erreur lors de l'extraction du texte du fichier PDF:", err);
    res
        .status(500)
        .send("Erreur lors de l'extraction du texte du fichier PDF.");
  }
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/pdf", (req, res) => {
  const query = "SELECT * FROM pdf_files"; // Remplacez par le nom de votre table

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données:", err);
      res.status(500).send("Erreur lors de la récupération des données");
      return;
    }
    res.json(results);
  });
});

app.post("/pdf", (req, res) => {
  const { file_name, file_content } = req.body;

  if (!file_name || !file_content) {
    return res
        .status(400)
        .send("Les champs file_name et file_content sont requis.");
  }

  const query = "INSERT INTO pdf_files (file_name, file_content) VALUES (?, ?)";
  db.query(query, [file_name, file_content], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données:", err);
      return res.status(500).send("Erreur lors de l'insertion des données.");
    }

    res.status(201).json({
      id: results.insertId,
      file_name: file_name,
      file_content: file_content,
    });
  });
});

// Route to store flashcards
app.post("/api/flashcards", (req, res) => {
  const { cardId, frontContent, backContent, question, answer, thumbsUp, thumbsDown } = req.body;

  const query = `
    INSERT INTO pdf_files (file_name, file_content, question, answer, thumbsUp, thumbsDown)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [cardId, frontContent, question, answer, thumbsUp, thumbsDown], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données:", err);
      return res.status(500).send("Erreur lors de l'insertion des données.");
    }

    res.status(201).json({ success: true });
  });
});

// Route to handle reactions
app.post("/api/reactions", (req, res) => {
  const { cardId, reaction } = req.body;

  const selectQuery = "SELECT * FROM pdf_files WHERE file_name = ?";
  db.query(selectQuery, [cardId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res.status(500).send("Erreur lors de la récupération des données.");
    }

    if (results.length === 0) {
      return res.status(404).send("Flashcard not found.");
    }

    const updateQuery = `
      UPDATE pdf_files
      SET ${reaction === "thumbsUp" ? "thumbsUp = thumbsUp + 1" : "thumbsDown = thumbsDown + 1"}
      WHERE file_name = ?
    `;
    db.query(updateQuery, [cardId], (err) => {
      if (err) {
        console.error("Erreur lors de la mise à jour des données:", err);
        return res.status(500).send("Erreur lors de la mise à jour des données.");
      }

      res.status(200).json({ success: true });
    });
  });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});