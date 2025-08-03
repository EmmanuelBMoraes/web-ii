// src/routes/alunoRoutes.js
const express = require("express");
const {
  createAluno,
  getAlunos,
  getAlunoById,
  updateAluno,
  deleteAluno,
  addDisciplinaToAluno,
  removeDisciplinaFromAluno,
} = require("../controllers/aluno.controller");
const validateObjectId = require("../middlewares/validarObjectId.middleware");

const router = express.Router();

router.route("/").post(createAluno).get(getAlunos);

router
  .route("/:id")
  .get(validateObjectId("id"), getAlunoById)
  .put(validateObjectId("id"), updateAluno)
  .delete(validateObjectId("id"), deleteAluno);

router
  .route("/:alunoId/disciplinas/:disciplinaId")
  .post(validateObjectId("alunoId", "disciplinaId"), addDisciplinaToAluno)
  .delete(
    validateObjectId("alunoId", "disciplinaId"),
    removeDisciplinaFromAluno
  );

module.exports = router;
