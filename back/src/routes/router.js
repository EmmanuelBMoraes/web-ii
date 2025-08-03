const express = require("express");
const disciplinaRoutes = require("./disciplina.routes");
const alunoRoutes = require("./aluno.routes");
const usuarioRoutes = require("./usuario.routes");
const router = express.Router();

router.use("/disciplinas", disciplinaRoutes);
router.use("/alunos", alunoRoutes);
router.use("/auth", usuarioRoutes);

router.get("/", (req, res) => {
  res.send("Status: API is running");
});

module.exports = router;
