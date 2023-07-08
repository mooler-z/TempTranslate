let { Router } = require('express');
let axios = require('axios');

const router = Router();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


router.post('/', async (req, res) => {
  let { text, src_lang, tgt_lang } = req.body;
  let response;

  if (src_lang === 'en') {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text
    });
    response = completion.data.choices[0].text;
  }
  else {
    let translated = await axios({
      url: process.env.API_URL,
      method: "POST",
      data: {
        key: process.env.API_KEY,
        text,
        src_lang,
        tgt_lang
      }
    });
    translated = translated.data.tgt_text;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: translated
    })
    response = completion.data.choices[0].text;
  }




  return res.status(200).json({
    status: "SUCCESS",
    data: response
  })
});

module.exports = router;
