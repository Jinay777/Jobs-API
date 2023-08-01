const { object } = require("joi");
const { CustomAPIError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "something went wrong please try again later",
  };
  if (err.name === "CastError") {
    customError.msg = `no item found with id ${err.value}`;
    customError.statusCode = 400;
  }
  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }
  if (err.code && err.code === 11000) {
    (customError.statusCode = 400),
      (customError.msg = `Duplicate Value Entered For ${Object.keys(
        err.keyValue
      )} field,please provide another value`);
  }
  return res.status(customError.statusCode).json(customError.msg);
};

module.exports = errorHandlerMiddleware;
