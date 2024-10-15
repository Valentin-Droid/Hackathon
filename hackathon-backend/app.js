const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hackathon'
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/pdf', (req, res) => {
    const query = 'SELECT * FROM pdf_files';  // Remplacez par le nom de votre table

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des données:', err);
            res.status(500).send('Erreur lors de la récupération des données');
            return;
        }
        res.json(results);
    });
});

app.post('/pdf', (req, res) => {
    const { file_name, file_type, file_content } = req.body;

    if (!file_name || !file_type || !file_content) {
        return res.status(400).send('Les champs file_name, file_type et file_content sont requis.');
    }

    const query = 'INSERT INTO pdf_files (file_name, file_type, file_content) VALUES (?, ?)';
    db.query(query, [file_name, file_type, file_content], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données:', err);
            return res.status(500).send('Erreur lors de l\'insertion des données.');
        }
        res.status(201).json({ id: results.insertId, name, content }); // Envoyer une réponse avec l'ID de la nouvelle leçon
    });
});


app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
