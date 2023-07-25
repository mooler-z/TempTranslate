const multer = require("multer");
const path = require("path");

const storage = (destination) =>
    multer.diskStorage({
        destination: "./storage/" + destination,
        filename: (req, file, cb) => {
            let parsed = path.parse(file.originalname).name
            parsed = parsed.split(' ').join('_')
            let filename = parsed + "_" + Date.now() + path.extname(file.originalname);
            req.fieldname = file.fieldname;
            cb(null, `${filename}`);
        },
    });

const upload = (destination) => {
    try {
        return multer({
            storage: storage(destination),
            fileFilter: (req, file, cb) => {
                if (
                    file.mimetype === "image/png" ||
                    file.mimetype === "image/jpg" ||
                    file.mimetype === "image/jpeg" ||
                    file.mimetype === "image/gif"
                ) {
                    cb(null, true);
                } else {
                    cb(null, false);
                    return cb(
                        new Error("You can only upload images")
                    );
                }
            },
        });
    } catch (err) {}
};

module.exports = upload;