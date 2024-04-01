const validate = (signupValidSchema) => async (req, res, next) => {
  try {
    const parseBody = await signupValidSchema.parseAsync(req.body);
    req.body = parseBody;
    return next();

  } catch (error1) {
    const status = 422;
    const message = "fill properly"
    const extra = error1.issues[0].message;
    // const extra = error1.issues.map((curElem) =>curElem.msg);

    const error = {
      status,
      message,
      extra
    };

    console.log(error, "werror middle");

    res.status(400).json({ message: error.extra });
    next(error.status);

  }
};
module.exports = validate;