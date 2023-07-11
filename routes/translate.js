let { Router } = require('express');
let axios = require('axios');

const router = Router();

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function actAsX(text, act) {
  act = act || 'yourself';
  const content = `I want you to act like ${act} and tell me ${text}`;
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
  });

  return completion;
}

async function translate(text, src_lang, tgt_lang) {
  let res = await axios({
    url: process.env.API_URL,
    method: 'POST',
    data: {
      key: process.env.API_KEY,
      text,
      src_lang,
      tgt_lang,
    },
  });
  return res;
}

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
    } else {
      _res = gpt_response.data.choices[0].message.content;
    }

    response = _res.data.tgt_text;
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
    } else {
      _res = gpt_response.data.choices[0].message.content;
    }

    response = _res.data.tgt_text;
  }

  return res.status(200).json({
    status: 'SUCCESS',
    data: response,
  });
});

module.exports = router;
