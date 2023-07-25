let { Router } = require('express');

const router = Router();

const { message } = require('../utils/gpt');

router.post('/', async (req, res) => {
    let gpt_response = await message(req.body.message, req.body.sys);

    gpt_response = gpt_response.data.choices[0].message;
    return res.status(200).json({
      status: 'SUCCESS',
      data: gpt_response,
    });
});

module.exports = router;
