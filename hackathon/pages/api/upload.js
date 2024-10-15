import multer from 'multer';
import path from 'path';

const upload = multer({
    dest: 'public/uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(req, res) {
    upload.single('file')(req, res, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const filePath = path.join('public', 'uploads', req.file.filename);
        res.status(200).json({ filePath });
    });
}