const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 
        'image/png', 
        'image/gif',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Allowed types: JPEG, PNG, GIF, MP4, MPEG, MOV, AVI'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 1024 // up to 1 GB
    }
});

module.exports = upload;
