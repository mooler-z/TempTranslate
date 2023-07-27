const creator = (req, res, next) => {
  const fs = require('fs');
  if (req.body.file) {
    const filePath = `./storage/${Date.now()}.wav`;
    fs.writeFileSync(
      filePath,
      req.body.file.replace("data:audio/wav;base64,", ""),
      "base64",
    );
    req.file_path = filePath;
  }
  next();
};

module.exports = creator;
