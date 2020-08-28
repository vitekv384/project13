const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(400).send({ message: `${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card !== null) {
        if (card.owner.toString() !== req.user._id) {
          res.status(404).send({ message: 'Нельзя удалить чужую карточку' });
        }
        res.status(200).send({ data: card });
      } else {
        res.status(404).send({ message: 'Нет карточки для удаления' });
      }
    })
    .catch((err) => res.status(500).send({ message: `На сервере произошла ошибка  ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404).send({ message: `Карточки с таким id нет  ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.id, { $pull: { likes: req.user._id } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(404).send({ message: `Карточки с таким id нет  ${err}` }));
};
