const express = require('express');
let { items } = require('../fakeDb');
const { BadRequestError, NotFoundError } = require('../expressError');

const router = new express.Router();


/** Checks request body has a name and valid number for price */
function authenticateData(req, res, next) {
  if (!req.body.name || isNaN(Number(req.body.price))) {
    throw new BadRequestError("name and price must be valid");

  } else {

    return next();
  }
}

/** Checks if item is in our items Data Base; saves to res.locals or throw Error */
function checkItemInItems(req, res, next) {
  const nameItem = items.filter(item => item.name === req.params.name);

  if (nameItem.length !== 0) {
    res.locals.item = nameItem[0];
    next();

  } else {
    throw new NotFoundError("Item not found");
  }

};

/** return list list of shopping items */
router.get('/', function (req, res) {

  return res.json({ items });
});

/** accept JSON body, add item, and return it */
router.post('/',
  authenticateData,
  function (req, res) {
    const name = req.body.name;
    const price = Number(req.body.price);

    const item = { name, price };
    items.push(item);

    return res
      .status(201)
      .json(item);
  });

/** Get item; return single item data  */
router.get('/:name',
  checkItemInItems,
  function (req, res) {
    const item = res.locals.item;

    return res.json(item);

  });

/** accept JSON body, modify item, return it */
router.patch('/:name',
  authenticateData,
  checkItemInItems,
  function (req, res) {
    const item = res.locals.item;

    item.name = req.body.name;
    item.price = Number(req.body.price);

    return res.json({ updated: item });
  }
);

/** Deletes given item from items array */
router.delete('/:name',
  checkItemInItems,
  function (req, res) {
    const deleteItem = res.locals.item;

    index = items.indexOf(deleteItem);
    items.splice(index, 1);

    return res.json({message: "deleted"});
  });






module.exports = router;

