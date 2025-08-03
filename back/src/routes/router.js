const express = require("express");
const disciplinaRoutes = require("./disciplina.routes");
const alunoRoutes = require("./aluno.routes");
const router = express.Router();

router.use("/disciplinas", disciplinaRoutes);
router.use("/alunos", alunoRoutes);

router.get("/", (req, res) => {
  res.send("Status: API is running");
});

module.exports = router;
