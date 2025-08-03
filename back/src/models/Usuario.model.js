const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
    },
    email: {
      type: String,
      required: [true, "O e-mail é obrigatório."],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Por favor, use um e-mail válido."],
    },
    senha: {
      type: String,
      required: [true, "A senha é obrigatória."],
      minlength: 6,
      select: false,
    },
  },
  { timestamps: true }
);

usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

usuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.senha);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
