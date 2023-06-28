const router = require("express").Router();

// Controllers
const UserController = require("../controllers/UserController");

// Middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreatedValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const checkToken = require("../middlewares/verifyToken");
const imageUpload = require("../helpers/image-upload");

router.post(
  "/register",
  userCreatedValidation(),
  validate,
  UserController.register
);
router.post("/login", loginValidation(), validate, UserController.login);
router.get("/checkuser", UserController.checkUser);
router.get("/:id", UserController.getUserById);
router.patch(
  "/edit/:id",
  checkToken,
  imageUpload.single("image"),
  userUpdateValidation(),
  validate,
  UserController.editUser
);

module.exports = router;
