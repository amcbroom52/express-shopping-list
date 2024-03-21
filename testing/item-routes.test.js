const request = require("supertest");

const app = require("../app");
let db = require("../fakeDb");

beforeEach(function() {
  db.items.push({
    name: "cherries",
    price: 5.65
  });
});

afterEach(function() {
  db.items.length = 0;
});


describe("GET /items", function() {

  test("get list of items", async function() {
    const resp = await request(app).get('/items');

    expect(resp.body).toEqual({items: [{name: "cherries", price: 5.65}]});
  })

})

describe("POST /items", function() {

  test("creates new item", async function() {
    const resp = await request(app)
      .post('/items')
      .send({
        name: 'bread',
        price: 5.24
      });

      expect(resp.body).toEqual({
        name: "bread",
        price: 5.24
      });
      expect(resp.statusCode).toEqual(201);
  })
})

describe("GET /items/:name", function() {

  test("gets singular item", async function() {
    const resp = await request(app).get('/items/cherries');

    expect(resp.body).toEqual({
      name: "cherries",
      price: 5.65
    });
  })
})

describe ("PATCH /items/:name", function() {

  test("Updates an item", async function() {
    const resp = await request(app)
      .patch('/items/cherries')
      .send({
        name: "newCherries",
        price: 3.56
      });

    expect(resp.body).toEqual({
      updated: {
        name: "newCherries",
        price: 3.56
    }});
  })
})

describe ("DELETE /items/:name", function () {

  test("Deletes an item", async function() {

    const resp = await request(app).delete('/items/cherries');

    expect(resp.body).toEqual({message: 'deleted'});

    expect(db.items.length).toEqual(0);
  })

})