const cardsRouter = require('express').Router();
const { getCards, createCard, deleteCard } = require('../controllers/cards');

cardsRouter.get('/', getCards);
cardsRouter.get('/:cardId', deleteCard);
cardsRouter.post('/', createCard);

module.exports = cardsRouter;
