import multer, { diskStorage } from 'multer';
import { extname } from 'path';

// Define storage options for file upload
const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/image/');
    },
    filename: (req, file, callback) => {
        let ext = extname(file.originalname);
        callback(
            null,
            `profile-${Math.floor(Math.random() * 999)}-${Date.now()}${ext}`
        );
    },
});

// Filter for allowing only specific file types (e.g., images)
const fileFilter = async (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        // Accept the file
        cb(null, true);
    } else {
        // Reject the file
        cb(new Error('Invalid file type'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
});

// Middleware to handle file upload and JSON data parsing
export const uploadFileAndJson = async (req, res, next) => {
    // First, handle file upload
    try {
        await upload.single('file')(req, res, async (err) => {
            if (err) {
                console.log('err.message >>', err.message);
                return res.status(400).json({ message: err.message });
            }
            // Then handle JSON data parsing if the file upload is successful
            try {
                req.body = {
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                };
                next();
            } catch (parseError) {
                return res.status(400).json({ message: 'Invalid JSON data' });
            }
        });
    } catch (error) {
        next(error);
    }
};
