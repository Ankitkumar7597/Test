const multer = require("multer");
const path = require("path");

/**
 * Dynamic Multer Configuration Middleware
 * @param {Object} options - Configuration options
 * @param {string} options.inputName - Name of the input field
 * @param {string} options.directory - Upload directory
 * @param {number} options.maxFileSize - Maximum file size in bytes
 * @param {RegExp} options.allowedExtensions - Regular expression for allowed file extensions
 */
const dynamicUpload = (options) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, options.directory); // Dynamic directory
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + "_" + file.originalname;
            cb(null, uniqueSuffix); // Unique filename
        },
    });

    const fileFilter = (req, file, cb) => {
        const extname = options.allowedExtensions.test(path.extname(file.originalname).toLowerCase());
        const mimetype = options.allowedExtensions.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true); // Valid file
        } else {
            return cb(new Error(`Only files with extensions ${options.allowedExtensions} are allowed!`));
        }
    };

    const upload = multer({
        storage,
        limits: { fileSize: options.maxFileSize }, // Dynamic file size limit
        fileFilter,
    });

    // Middleware to handle upload and errors
    return (req, res, next) => {
        upload.single(options.inputName)(req, res, (err) => {
            if (err) {
                req.uploadError = `${err.message}`;
            }
            next(); // Pass to the next middleware
        });
    };
};

module.exports = dynamicUpload;
