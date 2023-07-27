let axios = require("axios");

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function teacher(grade, subject, about, hint, level) {
  if (hint === "hint") {
    hint = "a hint to the student in a way that does not reveal the answer";
  } else if (hint === "explain") {
    hint = "a detailed explanation for the solution";
  } else {
    hint = "no help";
  }

  const prompt = `I want you to act as a top-notch ${subject} teacher.
  My first request is "generate a ${subject} question about ${about} that has ${level} difficulty for grade ${grade} student.
  wait for the student solution.
  ask more question after the user solution by the following instruction
  if the student solution is incorrect, offer ${hint}.
  if the student solution is incorrect generate a ${subject} question about ${about} but less difficult question and ask the student.
  if the student solution is correct, generate a ${subject} question about ${about} but more difficult question and ask the student.
  `;
  return prompt;
}

exports.actAsX = async (text, act) => {
  act = act || "helpful assistant";
  const content = `I want you to act like ${act} and tell me ${text}`;
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content }],
    });
    return completion;
  } catch (err) {
    return err;
  }
};

exports.englishTeacher = async (text) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content:
          "You are english language teacher that will check user input for grammar. If there is a grammar error, explain how the user made a mistake in 50 or less words.",
      }, { role: "user", content: text }],
    });
    return completion;
  } catch (err) {
    return err;
  }
};

exports.message = async (messages, sys) => {
  const prompt = teacher(
    sys.grade,
    sys.subject,
    sys.about,
    sys.hint,
    sys.level,
  );

  messages = messages.length < 2
    ? [{ role: "assistant", content: prompt }]
    : messages;
  messages = [{ role: "system", content: prompt }].concat(messages);
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    return completion;
  } catch (err) {
    return err;
  }
};

exports.transcribe = async (token, formData) => {
  let response = await axios({
    url: "https://api.openai.com/v1/audio/transcriptions",
    method: "POST",
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
    },
  });
  return response;
};

exports.getRapidAudioUrl = async (id) => {
  const headers = {
    "content-type": "application/json",
    "x-rapidapi-host": "large-text-to-speech.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_API_KEY,
  };

  let response = await axios({
    url: "https://large-text-to-speech.p.rapidapi.com/tts",
    method: 'get',
    headers,
    params: { id },
  });

  return response;
};

exports.rapidTextToSpeech = async (text) => {
  const headers = {
    "content-type": "application/json",
    "x-rapidapi-host": "large-text-to-speech.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_API_KEY,
  };

  let response = await axios({
    url: "https://large-text-to-speech.p.rapidapi.com/tts",
    method: "POST",
    headers: headers,
    data: { text },
  });
  const id = response.data.id;
  const eta = response.data.eta;
  return { id, eta };
};

exports.translate = async (text, src_lang, tgt_lang) => {
  let res = await axios({
    url: process.env.API_URL,
    method: "POST",
    data: {
      key: process.env.API_KEY,
      text,
      src_lang,
      tgt_lang,
    },
  });
  return res;
};
