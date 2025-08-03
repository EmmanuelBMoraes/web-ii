const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err, "Um erro foi capturado pelo handler central");

  if (err.name === "ValidationError") {
    const errors = {};
    for (let field in err.errors) {
      errors[field] = err.errors[field].message;
    }
    return res.status(400).json({ success: false, errors });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `O campo '${field}' já está em uso. Por favor, utilize outro valor.`;
    return res
      .status(400)
      .json({ success: false, errors: { [field]: message } });
  }

  res.status(500).json({
    success: false,
    error: "Erro Interno do Servidor",
  });
};

module.exports = errorHandler;
