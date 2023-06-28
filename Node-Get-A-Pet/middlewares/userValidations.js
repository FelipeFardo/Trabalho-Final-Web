const { body } = require("express-validator");
const userCreatedValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres.")
      .custom((value, { req }) => {
        if (/[0-9]/.test(value)) {
          throw new Error("O nome não pode ter números");
        }
        return true;
      }),
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    body("phone")
      .isString()
      .withMessage("O telefone é obrigatório")
      .isMobilePhone()
      .withMessage("Insira um telefone válido"),
    body("password")
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres."),
    body("confirmpassword")
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("As senhas não são iguais");
        return true;
      }),
  ];
};

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("E-mail ou senha incorreto")
      .isEmail()
      .withMessage("E-mail ou senha incorreto"),
    body("password").isString().withMessage("E-mail ou senha incorreto"),
  ];
};

const userUpdateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("O nome é obrigatório.")
      .isLength({ min: 3 })
      .withMessage("O nome precisa ter no mínimo 3 caracteres.")
      .custom((value, { req }) => {
        if (/[0-9]/.test(value)) {
          throw new Error("O nome não pode ter números");
        }
        return true;
      }),
    body("email")
      .isString()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Insira um e-mail válido"),
    body("phone")
      .isString()
      .withMessage("O telefone é obrigatório")
      .isMobilePhone()
      .withMessage("Insira um telefone válido"),
    body("password")
      .optional()
      .isString()
      .withMessage("A senha é obrigatória.")
      .isLength({ min: 5 })
      .withMessage("A senha precisa ter no mínimo 5 caracteres."),
    body("confirmPassword")
      .optional()
      .isString()
      .withMessage("A confirmação de senha é obrigatória.")
      .custom((value, { req }) => {
        if (value !== req.body.password)
          throw new Error("As senhas não são iguais");
        return true;
      }),
  ];
};

module.exports = {
  userCreatedValidation,
  loginValidation,
  userUpdateValidation,
};
