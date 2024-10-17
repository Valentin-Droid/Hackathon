const express = require('express');
const app = express();
const port = 3001;
const mysql = require("mysql2");
const multer = require("multer");
const pdfParse = require("pdf-parse");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
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
  const query = "SELECT * FROM pdf_files";

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

  app.post('/statsaddpdf', (req, res) => {
    const user = 'local';
    //On utilise un user "local" pour avoir les stats globaux du site, sans gérer des sessions
    //Mais on peut imaginer un futur où on rajoute des comptes utilisateur, et donc des stats personnalisé

    const query = 'UPDATE site_stats SET pdf_read = pdf_read + 1 WHERE user = ?';

    db.query(query, [user], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour des données:', err);
            res.status(500).send('Erreur lors de la mise à jour des données');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Utilisateur 'local' non trouvé");
        } else {
            res.send(`pdf_read pour l'utilisateur 'local' a été incrémenté`);
        }
    });
});

app.post('/statsaddcards', (req, res) => {
    const user = 'local';
    //On utilise un user "local" pour avoir les stats globaux du site, sans gérer des sessions
    //Mais on peut imaginer un futur où on rajoute des comptes utilisateur, et donc des stats personnalisé

    const query = 'UPDATE site_stats SET cards_generate = cards_generate + 1 WHERE user = ?';

    db.query(query, [user], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour des données:', err);
            res.status(500).send('Erreur lors de la mise à jour des données');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send("Utilisateur 'local' non trouvé");
        } else {
            res.send(`cards_generate pour l'utilisateur 'local' a été incrémenté`);
        }
    });
});

app.get('/stats', (req, res) => {
    const query = 'SELECT pdf_read, cards_generate, adv_notes FROM site_stats WHERE user = ?';

    db.query(query, ['local'], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des statistiques:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucune donnée trouvée pour l'utilisateur 'local'" });
        }

        const stats = {
            pdf_read: results[0].pdf_read,
            cards_generate: results[0].cards_generate,
            adv_notes: results[0].adv_notes,
        };

        res.json(stats);
    });
});


app.post('/statsaddnote', (req, res) => {
    const { note } = req.query;

    if (note === undefined) {
        return res.status(400).send('Le paramètre "note" est requis');
    }

    const noteValue = parseFloat(note);
    if (isNaN(noteValue)) {
        return res.status(400).send('La note doit être un nombre valide');
    }

    const user = 'local';
    //On utilise un user "local" pour avoir les stats globaux du site, sans gérer des sessions
    //Mais on peut imaginer un futur où on rajoute des comptes utilisateur, et donc des stats personnalisé

    const query = `
        UPDATE site_stats
        SET total_note = total_note + ?, 
            cards_evaluated = cards_evaluated + 1,
            adv_notes = (total_note + ?) / (cards_evaluated + 1)
        WHERE user = ?;
    `;

    db.query(query, [noteValue, noteValue, user], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour des données:', err);
            return res.status(500).send('Erreur lors de la mise à jour des données');
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Utilisateur 'local' non trouvé");
        }

        res.send(`La note a été ajoutée avec succès et adv_notes a été mis à jour`);
    });
});



app.post('/pdf', (req, res) => {
    const { file_name, file_type, file_content } = req.body;

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


app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
