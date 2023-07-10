let { Router } = require('express');
let axios = require('axios');

const router = Router();

router.post('/', async (req, res) => {
  let { text, src_lang, tgt_lang } = req.body;

  let response = await axios({
    url: process.env.API_URL,
    method: "POST",
    data: {
      key: process.env.API_KEY,
      text,
      src_lang,
      tgt_lang
    }
  })

  return res.status(200).json({
    status: "SUCCESS",
    data: response.data
  })
});

module.exports = router;
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion() {
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: "How are you today?",
  });
  console.log(completion.data.choices[0].text);
}

runCompletion();

