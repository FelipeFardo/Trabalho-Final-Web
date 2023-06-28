const User = require("../models/User");
const jwt = require("jsonwebtoken");
const getToken = require("../helpers/get-token");

const checkToken = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      message: "Acesso negado!",
      errors: ["Acesso negado!"],
    });
  }
  // check if header has a token
  const token = getToken(req);
  if (!token) {
    res
      .status(401)
      .json({ message: "Acesso negado!", errors: ["Acesso negado!"] });
    return;
  }

  // check if token is valid
  try {
    const verified = jwt.verify(token, "nossosecret");
    req.user = await User.findById(verified.id).select("-password");
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Acesso negado!", errors: ["Token inválido"] });
  }
};

module.exports = checkToken;
