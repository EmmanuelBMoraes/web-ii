// src/controllers/authController.js
const logger = require("../config/logger");
const Usuario = require("../models/Usuario.model");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body;
    const usuario = await Usuario.create({ nome, email, senha });
    const token = generateToken(usuario._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .json({ success: false, error: "Por favor, forneça email e senha." });
  }

  try {
    const usuario = await Usuario.findOne({ email }).select("+senha");

    if (!usuario || !(await usuario.matchPassword(senha))) {
      return res
        .status(401)
        .json({ success: false, error: "Credenciais inválidas." });
    }

    const token = generateToken(usuario._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};
