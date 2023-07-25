const axios = require("axios");

const options = {
  method: "POST",
  url: "https://large-text-to-speech.p.rapidapi.com/tts",
  headers: {
    "content-type": "application/json",
    "X-RapidAPI-Key": "664a8f755amshf586935eea019efp15149ajsn368a4e787780",
    "X-RapidAPI-Host": "large-text-to-speech.p.rapidapi.com",
  },
  data: {
    text:
      "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away.",
  },
};

async function textToSpeech() {
  try {
    const response = await axios.request(options);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

// textToSpeech();

const request = require("request");
const fs = require("fs");

const apikey = "664a8f755amshf586935eea019efp15149ajsn368a4e787780"; // get your free API key from https://rapidapi.com/k_1/api/large-text-to-speech/
const filename = "test-file.wav";

const headers = {
  "content-type": "application/json",
  "x-rapidapi-host": "large-text-to-speech.p.rapidapi.com",
  "x-rapidapi-key": apikey,
};

exports.rapidSpeech = async (text) => {
  let res = request.post({
    url: "https://large-text-to-speech.p.rapidapi.com/tts",
    headers: headers,
    body: JSON.stringify({ text: text }),
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
        console.log("The url is>> ", url);
        while (!url) {
          request.get({
            url: "https://large-text-to-speech.p.rapidapi.com/tts",
            headers: headers,
            qs: { id: id },
          }, (error, response, body) => {
            if (error) throw new Error(error);
            url = JSON.parse(body).url;
          });
          console.log(`Waiting some more...`);
          setTimeout(() => {}, 3000);
        }
        request.get(url, (error, response, body) => {
          if (error) throw new Error(error);
          fs.writeFile(filename, body, "binary", (err) => {
            if (err) throw err;
            console.log(
              `File saved to ${filename} ! \nOr download here: ${url}`,
            );
          });
        });
      });
    }, eta * 1000);
  });
};
