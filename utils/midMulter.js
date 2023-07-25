const multer = require('multer');

const fileFilter = (req, file, cb) => {
    console.log(file)
    const allowedTypes = ["audio/mp3", "audio/wav", "application/octet-stream"];
    if (!allowedTypes.includes(file.mimetype)) {
        const error = new Error("Incorrect file");
        error.code = "INCORRECT_FILETYPE"
        return cb(error, false)
    }
    cb(null, true)
}
const upload = multer({
    dest: './storage',
    fileFilter,
    limits: {
        fileSize: 3000000
    }
});
module.exports = upload;
