const Pet = require("../models/Pet");

// helpers
const getToken = require("../helpers/get-token");
const getUserByToken = require("../helpers/get-user-by-token");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = class PetController {
  // #swagger.start
  static async create(req, res) {
    // #swagger.tags = ['Pet']
    /* #swagger.parameters['obj'] = { 
      in: 'body',
      description: 'Informações de login usuário',
      schema: { $ref: "#/definitions/CreateAPet" }
    } */
    // get user from token
    const { name, age, weight, color } = req.body;

    const images = req.files;
    const available = true;

    const token = getToken(req);
    const user = await getUserByToken(token);
    // get pet owner

    const pet = new Pet({
      name,
      age,
      weight,
      color,
      available,
      images: [],
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    });

    images.map((image) => {
      pet.images.push(image.filename);
    });

    try {
      const newPet = await pet.save();
      res.status(201).json({ message: "Pet cadastrado com sucesso", newPet });
    } catch (error) {
      res.status(500).json({ message: error[0], errors: [error] });
    }
    // #swagger.end
  }

  static async getAll(req, res) {
    // #swagger.tags = ['Pet']
    try {
      const pets = await Pet.find().sort("-createdAt");
      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error, errors: [error] });
    }
  }

  static async getAllUserPets(req, res) {
    // #swagger.tags = ['Pet']

    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const pets = await Pet.find({ "user._id": user._id }).sort("createdAt");

      res.status(200).json({
        pets,
      });
    } catch (error) {
      res.status(500).json({ message: error, errors: [error] });
    }
  }

  static async getAllUserAdoptions(req, res) {
    // #swagger.tags = ['Pet']

    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    try {
      const pets = await Pet.find({ "adopter._id": user._id });

      res.status(200).json({ pets });
    } catch (error) {
      res.status(500).json({ message: error, errors: [error] });
    }
  }

  static async getPetById(req, res) {
    // #swagger.tags = ['Pet']

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: error[0], errors: ["ID inválido"] });
      return;
    }

    // check if pet exists
    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet não encontrado",
        errors: ["Pet não encontrado"],
      });
      return;
    }
    res.status(200).json({ pet });
  }

  static async removePetById(req, res) {
    // #swagger.tags = ['Pet']

    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido", errors: ["ID inválido"] });
      return;
    }

    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet não encontrado",
        errors: ["Pet não encontrado"],
      });
      return;
    }

    // check if logged in user registered the pet
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res
        .status(422)
        .json({ message: "Acesso negado!", errors: ["Acesso negado!"] });
      return;
    }
    await Pet.findByIdAndRemove(id);
    res.status(200).json({ message: "Pet removido com sucesso!" });
  }

  static async updatePet(req, res) {
    // #swagger.tags = ['Pet']
    /* #swagger.parameters['obj'] = { 
      in: 'body',
      description: 'Informações de login usuário',
      schema: { $ref: "#/definitions/UpdateAPet" }
    } */
    const id = req.params.id;

    const { name, age, weight, color, available } = req.body;

    const images = req.files;

    let updateData = {};

    // check if pet exists
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido", errors: ["ID inválido"] });
      return;
    }

    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet não encontrado",
        errors: ["Pet não encontrado"],
      });
      return;
    }

    // check if logged in user registered the pet
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res
        .status(422)
        .json({ message: "Acesso negado!", errors: ["Acesso negado!"] });
      return;
    }

    updateData = {
      name: name || pet.name,
      age: age || pet.age,
      weight: weight || pet.weight,
      color: color || pet.color,
      available: available || pet.available,
      images: pet.images,
    };

    if (images.length > 0) {
      updateData.images = [];
      images.map((image) => {
        updateData.images.push(image.filename);
      });
    }
    try {
      // return user update data
      await Pet.findByIdAndUpdate(id, updateData);
      res
        .status(200)
        .json({ message: "Pet atualizado com sucesso!", updateData });
    } catch (error) {
      res.status(500).json({
        errors: [err],
      });
    }
  }

  static async schedule(req, res) {
    // #swagger.tags = ['Pet']

    const id = req.params.id;

    // check if pet exists
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido", errors: ["ID inválido"] });
      return;
    }

    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet não encontrado",
        errors: ["Pet não encontrado"],
      });
      return;
    }

    // check if logged in user registered the pet
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: "Você não pode agendar uma visita com o seu próprio Pet!",
        errors: ["Você não pode agendar uma visita com o seu próprio Pet!"],
      });
      return;
    }

    // check if user has already scheludeda visit
    if (pet.adopter && pet.adopter._id.equals(user._id)) {
      res.status(422).json({
        message: "Você já agendou uma visita para este Pet!",
        errors: ["Você já agendou uma visita para este Pet!"],
      });
      return;
    }

    // add user to pet
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    };

    try {
      await Pet.findByIdAndUpdate(pet._id, pet);
      res.status(200).json({
        message: `A foi visita foi agendada com sucesso, entre em contato com ${pet.user.name} pelo telefone ${pet.user.phone}!`,
      });
    } catch (error) {
      res.status(500).json({
        message: [err],
        errors: [err],
      });
    }
  }

  static async concludeAdoption(req, res) {
    // #swagger.tags = ['Pet']

    const id = req.params.id;

    // check if pet exists
    if (!ObjectId.isValid(id)) {
      res.status(422).json({ message: "ID inválido", errors: ["ID inválido"] });
      return;
    }

    const pet = await Pet.findOne({ _id: id });
    if (!pet) {
      res.status(404).json({
        message: "Pet não encontrado",
        errors: ["Pet não encontrado"],
      });
      return;
    }

    // check if logged in user registered the pet
    // get user from token
    const token = getToken(req);
    const user = await getUserByToken(token);

    if (pet.user._id.toString() !== user._id.toString()) {
      res
        .status(422)
        .json({ message: "Acesso negado!", errors: ["Acesso negado!"] });
      return;
    }

    pet.available = false;

    await Pet.findByIdAndUpdate(id, pet);

    res.status(200).json({
      message: "Parabéns! O ciclo de adoção foi finalizado com sucesso!",
    });
  }
};
