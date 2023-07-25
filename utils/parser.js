const parser = (req, res, next) => {
    if (req.file) {
        req.body[req.fieldname] = req.file;
    } else if(req.files) {
        let files = req.files.map(file => file.filename);
        req.body[req.fieldname] = files;
    }

    next();
}


module.exports = parser