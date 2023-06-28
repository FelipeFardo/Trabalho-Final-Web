const { body } = require("express-validator");
const path = require("path");

const petCreatedValidation = () => {
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
    body("age")
      .isNumeric()
      .withMessage("A idade é obrigatória")
      .isInt()
      .withMessage("Insira uma idade válida"),
    body("weight").isFloat().withMessage("O peso é obrigatório"),
    body("color").isString().withMessage("A cor é obrigatória"),
  ];
};

const petUpdateValidation = () => {
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
    body("age")
      .isString()
      .withMessage("A idade é obrigatória")
      .isInt()
      .withMessage("Insira uma idade válida"),
    body("weight").optional().isFloat().withMessage("O peso é obrigatório"),
    body("color").optional().isString().withMessage("A cor é obrigatória"),
  ];
};

module.exports = {
  petCreatedValidation,
  petUpdateValidation,
};
