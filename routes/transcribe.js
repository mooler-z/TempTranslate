let { Router } = require("express");
const router = Router();

const transcribe = require('../controllers/transcribe');

router.post("/", transcribe.converseAndTranscribe);

module.exports = router;
