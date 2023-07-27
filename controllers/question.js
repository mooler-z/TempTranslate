const catchAsync = require('../utils/catchAsync');
const { message } = require('../utils/gpt');

exports.generateQuestion = catchAsync(async (req, res, next) => {
  try {
    let gpt_response = await message(req.body.message, req.body.sys);

    gpt_response = gpt_response.data.choices[0].message;
    return res.status(200).json({
      status: "SUCCESS",
      data: gpt_response,
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: err,
    });
  }
});
