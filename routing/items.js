const express = require('express');
const {items} = require('../fakeDb')
const {BadRequestError} = require('../expressError')

const router = new express.Router();

function authenticateData(req, res, next) {
  if (!req.body.name || isNaN(Number(req.body.price))) {
    throw new BadRequestError("name and price must be valid");
  } else {
    return next();
  }
}

router.get('/', function(req, res) {
  return res.json({items});
})

router.post('/',
  authenticateData,
  function(req, res) {
  const name = req.body.name;
  const price = req.body.price;

  const item = {name, price};
  items.push(item);

  return res.json(item);
})


module.exports = router;