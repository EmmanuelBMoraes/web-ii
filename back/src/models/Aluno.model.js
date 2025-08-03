const mongoose = require("mongoose");

const alunoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome do aluno é obrigatório."],
      trim: true,
    },
    endereco: {
      type: String,
      required: [true, "O endereço é obrigatório."],
    },
    dataNascimento: {
      type: Date,
      required: [true, "A data de nascimento é obrigatória."],
    },
    cpf: {
      type: String,
      required: [true, "O CPF é obrigatório."],
      trim: true,
    },
    matricula: {
      type: String,
      required: [true, "A matrícula é obrigatória."],
      trim: true,
    },
    telefone: {
      type: String,
      required: [true, "O telefone é obrigatório."],
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Por favor, use um e-mail válido."],
    },
    curso: {
      type: String,
      required: [true, "O curso é obrigatório."],
    },
    disciplinas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Disciplina",
      },
    ],
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

alunoSchema.index(
  { cpf: 1 },
  { unique: true, partialFilterExpression: { ativo: true } }
);
alunoSchema.index(
  { matricula: 1 },
  { unique: true, partialFilterExpression: { ativo: true } }
);
alunoSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { ativo: true } }
);

module.exports = mongoose.model("Aluno", alunoSchema);
