let { Router } = require("express");

const router = Router();

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const request = require("request");

const { englishTeacher } = require("../utils/gpt");

router.post("/", async (req, res) => {
  const model = "whisper-1";
  const filePath = `./storage/${Date.now()}.wav`;
  fs.writeFileSync(
    filePath,
    req.body.file.replace("data:audio/wav;base64,", ""),
    "base64",
  );

  const formData = new FormData();

  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));

  let response = await axios({
    url: "https://api.openai.com/v1/audio/transcriptions",
    method: "POST",
    data: formData,
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
    },
  }).then(async (trans_response) => {
    async function gptcall() {
      const gptResponse = await englishTeacher(trans_response.data.text);
      const apikey = "664a8f755amshf586935eea019efp15149ajsn368a4e787780"; // get your free API key from https://rapidapi.com/k_1/api/large-text-to-speech/
      const headers = {
        "content-type": "application/json",
        "x-rapidapi-host": "large-text-to-speech.p.rapidapi.com",
        "x-rapidapi-key": apikey,
      };

      fs.rmSync(filePath);
      request.post({
        url: "https://large-text-to-speech.p.rapidapi.com/tts",
        headers: headers,
        body: JSON.stringify({
          text: gptResponse.data.choices[0].message.content,
        }),
      }, (error, response, body) => {
        if (error) throw new Error(error);
        const id = JSON.parse(body).id;
        const eta = JSON.parse(body).eta;
        console.log(`Waiting ${eta} seconds for the job to finish...`);
        setTimeout(() => {
          request.get({
            url: "https://large-text-to-speech.p.rapidapi.com/tts",
            headers: headers,
            qs: { id: id },
          }, (error, response, body) => {
            if (error) throw new Error(error);
            let url = JSON.parse(body).url;
            res.status(200).json({
              status: "SUCCESS",
              data: {
                transcribed: trans_response.data.text,
                gptResponse: gptResponse.data.choices[0].message.content,
                url: url,
              },
            });
          });
        }, eta * 1000);
      });
    }
    gptcall();
  }).catch((err) => {
    console.log(err);
  });
});

module.exports = router;
