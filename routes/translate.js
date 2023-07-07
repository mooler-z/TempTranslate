import { Router } from 'express';
import request from 'request';
import axios from 'axios';

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

export default router;