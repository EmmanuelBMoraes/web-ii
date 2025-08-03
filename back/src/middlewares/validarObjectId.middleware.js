// src/middlewares/validateObjectId.js
const mongoose = require("mongoose");
const logger = require("../config/logger");

const validateObjectId = (...idParams) => {
  return (req, res, next) => {
    for (const param of idParams) {
      if (
        req.params[param] &&
        !mongoose.Types.ObjectId.isValid(req.params[param])
      ) {
        logger.warn(
          `ID de objeto inválido para o parâmetro '${param}': ${req.params[param]}`
        );
        return res.status(400).json({
          success: false,
          error: `O ID fornecido é inválido.`,
        });
      }
    }
    next();
  };
};

module.exports = validateObjectId;
