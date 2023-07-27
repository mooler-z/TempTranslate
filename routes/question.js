let { Router } = require('express');

const router = Router();

const questionController = require("../controllers/question");

router.post('/', questionController.generateQuestion);

module.exports = router;
