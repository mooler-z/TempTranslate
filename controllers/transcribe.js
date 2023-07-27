const FormData = require("form-data");
const fs = require("fs");

const { englishTeacher, transcribe, rapidTextToSpeech, getRapidAudioUrl } =
  require("../utils/gpt");
const catchAsync = require("../utils/catchAsync");

function cleanUnwantedWaves(filePath) {
  fs.rmSync(filePath);
  const readDir = fs.readdir;
  const rmFile = fs.rmSync;
  readDir("./storage/", { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        const re = new RegExp("[^.]+$");
        const res = file.name.match(re);
        if (res && res[0] === "wav") {
          const epoch = Number(file.name.slice(0, res.index - 1));
          const diff = Date.now() - epoch;
          if (diff > 120_000) {
            rmFile(`./storage/${file.name}`);
          }
        }
      });
    }
  });
}

exports.converseAndTranscribe = catchAsync(async (req, res) => {
  const model = process.env.OPENAI_MODEL;
  const filePath = req.file_path;

  const formData = new FormData();
  formData.append("model", model);
  formData.append("file", fs.createReadStream(filePath));

  const transcribed = await transcribe(process.env.OPENAI_API_KEY, formData);
  cleanUnwantedWaves(filePath);

  let gptResponse = await englishTeacher(transcribed.data.text);
  gptResponse = gptResponse.data.choices[0].message.content;

  const processTextToSpeech = await rapidTextToSpeech(gptResponse);
  console.log(`Audio will be synthesized in ${processTextToSpeech.eta}secs`);

  setTimeout(async () => {
    let synthesizedAudioUrl = await getRapidAudioUrl(processTextToSpeech.id);
    synthesizedAudioUrl = synthesizedAudioUrl.data.url;
    res.status(200).json({
      status: "SUCCESS",
      data: {
        transcribed: transcribed.data.text,
        gptResponse: gptResponse,
        url: synthesizedAudioUrl,
      },
    });
  }, processTextToSpeech.eta * 1000 + 1000);

});
