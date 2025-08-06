const Aluno = require("../models/Aluno.model");
const Disciplina = require("../models/Disciplina.model");
const logger = require("../config/logger");
const path = require("path");
const childLogger = logger.child({ context: path.basename(__filename) });

const getDisciplinaIdsByNames = async (nomes) => {
  if (!nomes || nomes.length === 0) {
    return [];
  }
  const disciplinas = await Disciplina.find({
    nome: { $in: nomes },
    ativo: true,
  }).select("_id");
  return disciplinas.map((d) => d._id);
};

exports.createAluno = async (req, res, next) => {
  try {
    const dadosAluno = { ...req.body };

    if (dadosAluno.disciplinas && dadosAluno.disciplinas.length > 0) {
      dadosAluno.disciplinas = await getDisciplinaIdsByNames(
        dadosAluno.disciplinas
      );
    }

    const aluno = await Aluno.create(dadosAluno);
    childLogger.info(
      { alunoId: aluno._id },
      `Aluno '${aluno.nome}' criado com sucesso.`
    );
    res.status(201).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};

exports.getAlunos = async (req, res, next) => {
  try {
    const alunos = await Aluno.find({ ativo: true }).populate("disciplinas");
    res.status(200).json({ success: true, data: alunos });
  } catch (error) {
    next(error);
  }
};

exports.getAlunoById = async (req, res, next) => {
  try {
    const aluno = await Aluno.findOne({
      _id: req.params.id,
      ativo: true,
    }).populate("disciplinas");
    if (!aluno) {
      return res
        .status(404)
        .json({ success: false, error: "Aluno não encontrado ou inativo" });
    }
    res.status(200).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};

exports.updateAluno = async (req, res, next) => {
  try {
    const dadosParaAtualizar = { ...req.body };
    delete dadosParaAtualizar.ativo;

    if (dadosParaAtualizar.hasOwnProperty("disciplinas")) {
      dadosParaAtualizar.disciplinas = await getDisciplinaIdsByNames(
        dadosParaAtualizar.disciplinas
      );
    }

    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      dadosParaAtualizar,
      {
        new: true,
        runValidators: true,
      }
    ).populate("disciplinas");

    if (!aluno) {
      return res
        .status(404)
        .json({ success: false, error: "Aluno não encontrado" });
    }

    childLogger.info(
      { alunoId: aluno._id },
      `Aluno '${aluno.nome}' atualizado com sucesso.`
    );
    res.status(200).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};

exports.deleteAluno = async (req, res, next) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      { ativo: false },
      { new: true }
    );
    if (!aluno) {
      return res
        .status(404)
        .json({ success: false, error: "Aluno não encontrado" });
    }
    childLogger.info(
      { alunoId: aluno._id },
      `Aluno '${aluno.nome}' desativado com sucesso.`
    );
    res.status(200).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};

exports.addDisciplinaToAluno = async (req, res, next) => {
  try {
    const { alunoId, disciplinaId } = req.params;
    const aluno = await Aluno.findById(alunoId);
    const disciplina = await Disciplina.findById(disciplinaId);

    if (!aluno || !disciplina) {
      return res.status(404).json({
        success: false,
        error: "Aluno ou Disciplina não encontrado(a).",
      });
    }
    if (!aluno.ativo || !disciplina.ativo) {
      return res.status(400).json({
        success: false,
        error: "Aluno ou Disciplina está inativo(a).",
      });
    }

    if (aluno.disciplinas.includes(disciplinaId)) {
      return res.status(400).json({
        success: false,
        error: "Aluno já está matriculado nesta disciplina.",
      });
    }

    aluno.disciplinas.push(disciplinaId);
    await aluno.save();

    childLogger.info(
      { alunoId, disciplinaId },
      `Disciplina adicionada ao aluno '${aluno.nome}'.`
    );
    res.status(200).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};

exports.removeDisciplinaFromAluno = async (req, res, next) => {
  try {
    const { alunoId, disciplinaId } = req.params;
    const aluno = await Aluno.findByIdAndUpdate(
      alunoId,
      { $pull: { disciplinas: disciplinaId } },
      { new: true }
    );
    if (!aluno) {
      return res
        .status(404)
        .json({ success: false, error: "Aluno não encontrado" });
    }
    childLogger.info(
      { alunoId, disciplinaId },
      `Disciplina removida do aluno '${aluno.nome}'.`
    );
    res.status(200).json({ success: true, data: aluno });
  } catch (error) {
    next(error);
  }
};
