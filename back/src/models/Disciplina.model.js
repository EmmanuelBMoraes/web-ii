const mongoose = require("mongoose");

const disciplinaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome da disciplina é obrigatório."],
      trim: true,
    },
    cargaHoraria: {
      type: Number,
      required: [true, "A carga horária é obrigatória."],
    },
    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
disciplinaSchema.index(
  { nome: 1 },
  {
    unique: true,
    partialFilterExpression: { ativo: true },
  }
);

module.exports = mongoose.model("Disciplina", disciplinaSchema);
