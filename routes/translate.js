let { Router } = require('express');

const router = Router();

const translateController  = require("../controllers/translate")

router.post('/', translateController.converseWithDifferentLang);

module.exports = router;
