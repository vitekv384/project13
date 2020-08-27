const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.id).orFail()
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Пользователя с таким id нет' }));
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => res.status(400).send({ message: `${err}` }));
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: `Пользователя с таким id нет  ${err}` }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(404).send({ message: `Пользователя с таким id нет  ${err}` }));
};
