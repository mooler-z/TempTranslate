let { Router } = require('express');

const router = Router();

const { actAsX, translate } = require('../utils/gpt');

router.post('/', async (req, res) => {
  let { text, src_lang, actAs, res_lang } = req.body;
  let response;

  if (src_lang === 'en') {
    const gpt_response = await actAsX(text, actAs);
    let _res;

    if (res_lang === 'ti') {
      _res = await translate(
        gpt_response.data.choices[0].message.content,
        'en',
        'ti',
      );
      _res = _res.data.tgt_text;
    } else {
      _res = gpt_response.data.choices[0].message.content;
    }

    response = _res;
  } else if (src_lang === 'ti') {
    let _res = await translate(text, 'ti', 'en');
    _res = _res.data.tgt_text;
    const gpt_response = await actAsX(_res, actAs);
    if (res_lang === 'ti') {
      _res = await translate(
        gpt_response.data.choices[0].message.content,
        'en',
        'ti',
      );
      _res = _res.data.tgt_text;
    } else {
      _res = gpt_response.data.choices[0].message.content;
    }

    response = _res;
  }

  return res.status(200).json({
    status: 'SUCCESS',
    data: response,
  });
});

module.exports = router;
