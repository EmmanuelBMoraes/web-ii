const Disciplina = require("../models/Disciplina.model");
const logger = require("../config/logger");
const childLogger = logger.child({ module: "DisciplinaController" });

exports.createDisciplina = async (req, res) => {
  try {
    const disciplina = await Disciplina.create(req.body);
    res.status(201).json({ success: true, data: disciplina });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getDisciplinas = async (req, res) => {
  try {
    const disciplinas = await Disciplina.find({ ativo: true });
    res.status(200).json({ success: true, disciplinas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getDisciplinaById = async (req, res, next) => {
  try {
    const disciplina = await Disciplina.findById(req.params.id, {
      ativo: true,
    });

    if (!disciplina) {
      return res.status(404).json({
        success: false,
        error: "Disciplina não encontrada com este ID",
      });
    }

    res.status(200).json({ success: true, data: disciplina });
  } catch (error) {
    childLogger.error(
      error,
      `Falha ao buscar disciplina com ID: ${req.params.id}`
    );
    next(error);
  }
};

exports.updateDisciplina = async (req, res) => {
  try {
    const newData = req.body;
    delete newData.ativo;
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!disciplina) {
      return res
        .status(404)
        .json({ success: false, error: "Disciplina não encontrada" });
    }
    res.status(200).json({ success: true, disciplina });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteDisciplina = async (req, res, next) => {
  try {
    const disciplina = await Disciplina.findByIdAndUpdate(
      req.params?.id,
      { ativo: false },
      { new: true }
    );

    if (!disciplina) {
      logger.warn(
        { disciplinaId: req.params.id },
        "Tentativa de deletar disciplina não encontrada."
      );
      return res
        .status(404)
        .json({ success: false, error: "Disciplina não encontrada" });
    }

    logger.info(
      { disciplinaId: disciplina._id },
      `Disciplina '${disciplina.nome}' desativada com sucesso.`
    );
    res.status(200).json({ success: true, data: disciplina });
  } catch (error) {
    logger.error(
      { error, disciplinaId: req.params.id },
      "Erro ao desativar disciplina"
    );
    res
      .status(500)
      .json({ success: false, error: "Erro ao desativar disciplina" });
  }
};
