const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario.model");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: "Não autorizado. Acesso negado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = await Usuario.findById(decoded.id).select("-senha");
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, error: "Não autorizado. Token inválido." });
  }
};
