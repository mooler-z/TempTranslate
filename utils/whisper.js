const dotenv = require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

async function transcribe() {
  const OPENAI_API_KEY = "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";
  const filePath = path.join(__dirname, "audio.mp3");
  const model = "whisper-1";

  const formData = new FormData();

  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));

  let res = await axios({
    url: "https://api.openai.com/v1/audio/transcriptions",
    method: "POST",
    data: formData,
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
    },
  }).then((response) => {
    console.log(response);
  }).catch((err) => {
    console.log(err);
  });
}

transcribe();
