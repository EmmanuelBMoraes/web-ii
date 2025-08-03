const express = require("express");
const {
  createDisciplina,
  getDisciplinas,
  updateDisciplina,
  deleteDisciplina,
  getDisciplinaById,
} = require("../controllers/disciplina.controller");
const validateObjectId = require("../middlewares/validarObjectId.middleware");

const router = express.Router();

router.route("/").post(createDisciplina).get(getDisciplinas);

router
  .route("/:id")
  .get(validateObjectId("id"), getDisciplinaById)
  .put(validateObjectId("id"), updateDisciplina)
  .delete(validateObjectId("id"), deleteDisciplina);

module.exports = router;
