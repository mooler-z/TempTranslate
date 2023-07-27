const catchAsync = require("../utils/catchAsync");
const { actAsX, translate } = require("../utils/gpt");

exports.converseWithDifferentLang = catchAsync(async (req, res) => {
  let { text, src_lang, actAs, res_lang } = req.body;
  let response;

  if (src_lang === "en") {
    const gptResponse = await actAsX(text, actAs);

    if (res_lang === "ti") {
      response = await translate(
        gptResponse.data.choices[0].message.content,
        "en",
        "ti",
      );
      response = response.data.tgt_text;
    } else {
      response = gptResponse.data.choices[0].message.content;
    }

  } else if (src_lang === "ti") {
    let translated = await translate(text, "ti", "en");
    translated = translated.data.tgt_text;
    const gptResponse = await actAsX(responsed, actAs);
    if (res_lang === "ti") {
      response = await translate(
        gptResponse.data.choices[0].message.content,
        "en",
        "ti",
      );
      response = response.data.tgt_text;
    } else {
      response = gptResponse.data.choices[0].message.content;
    }
  }

  return res.status(200).json({
    status: "SUCCESS",
    data: response,
  });
});
