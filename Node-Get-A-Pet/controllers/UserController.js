const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helpers
const createUserToken = require("../helpers/create-user-token");
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");

module.exports = class UserController {
  // #swagger.start
  static async register(req, res) {
    // #swagger.tags = ['User']

    /* #swagger.parameters['obj'] = { 
      in: 'body',
      description: 'Informações do usuário',
      schema: { $ref: "#/definitions/Register" }
    } */
    const { name, email, phone, password } = req.body;

    // check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(422).json({
        message: "Por favor, utilize outro e-mail",
        errors: ["Por favor, utilize outro e-mail"],
      });
      return;
    }

    // create a password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create a user
    const user = new User({
      name,
      email,
      phone,
      password: passwordHash,
    });

    try {
      const newUser = await user.save();
      await createUserToken(newUser, req, res);
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: error, errors: [error] });
    }
  }

  static async login(req, res) {
    // #swagger.tags = ['User']
    /* #swagger.parameters['obj'] = { 
      in: 'body',
      description: 'Informações de login usuário',
      schema: { $ref: "#/definitions/Login" }
    } */
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(422).json({
        message: "Usuário ou senha incorreto",
        errors: ["Usuário ou senha incorreto"],
      });
      return;
    }

    // check if password match db password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.status(422).json({
        message: "Usuário ou senha incorreto",
        errors: ["Usuário ou senha incorreto"],
      });
      return;
    }
    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    // #swagger.tags = ['User']
    let currentUser;

    try {
      if (req.headers.authorization) {
        const token = getToken(req);
        const decoded = jwt.verify(token, "nossosecret");

        currentUser = await User.findById(decoded.id);
        currentUser.password = undefined;
      } else {
        currentUser = null;
      }
      res.status(200).send(currentUser);
    } catch (error) {
      res
        .status(422)
        .json({ message: "Acesso negado!", errors: ["Acesso negado!"] });
    }
  }
  s;
  static async getUserById(req, res) {
    // #swagger.tags = ['User']
    const id = req.params.id;

    const user = await User.findById(id).select("-password");

    if (!user) {
      res.status(422).json({
        message: "Usuário não encontrado",
        errors: ["Usuário não encontrado"],
      });
      return;
    }

    res.status(200).json({ user });
  }

  static async editUser(req, res) {
    // #swagger.tags = ['User']
    /* #swagger.parameters['obj'] = { 
      in: 'body',
      description: 'Informações para alteração dos dados do usuário',
      schema: { $ref: "#/definitions/EditUser" }
    } */
    const id = req.params.id;

    // check if user exists
    const token = getToken(req);
    const user = await getUserByToken(token);

    const { name, email, phone, password, confirmPassword } = req.body;

    if (req.file) {
      user.image = req.file.filename;
    }
    // check if email has already
    const userExists = await User.findOne({ email });
    if (user.email !== email && userExists) {
      res.status(422).json({
        message: "Por favor utilize outro e-mail",
        errors: ["Por favor utilize outro e-mail"],
      });
      return;
    }
    user.email = email;

    if (password !== confirmPassword) {
      res.status(422).json({ errors: ["As senhas não são iguais"] });
      return;
    } else if (password === confirmPassword && password != null) {
      // create a password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    try {
      // return user update data
      await User.findOneAndUpdate(
        { _id: user.id },
        { $set: user },
        { new: true }
      );
      res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
      res.status(500).json({
        errors: [err],
      });
    }
  }
  // #swagger.end
};
