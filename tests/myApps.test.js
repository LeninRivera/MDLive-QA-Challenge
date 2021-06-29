const app = require("../server/app");
const request = require("supertest");
const mongoose = require("mongoose");

afterAll(() => {
  mongoose.disconnect();
});

function checkIfSorted(array) {
  let previousId = array[0].id;
  for (let i = 1; i < array.length; i++) {
    if (previousId > array[i].id) {
      previousId = array[i].id;
      return false;
    }
  }
  return true;
}

describe("GET /apps endpoint with no range", () => {
  it("Response should be an Array of JSON objects with keys id and name", async () => {
    const res = await request(app).get("/apps");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "my-app-001");
  });
  it("Response should have a length of 50", async () => {
    const res = await request(app).get("/apps");
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(50);
  });
  it("Response should be in ascending order", async () => {
    const res = await request(app).get("/apps");
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
});

describe("GET /apps endpoint with range: { 'by': 'id', 'start': 1, 'end': 5 }", () => {
  it("Response should be an Array of JSON objects with keys id and name", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"end":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "my-app-001");
  });
  it("Response should have a length of 5", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"end":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(5);
  });
  it("Response should be in ascending order", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"end":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
});

describe('GET /apps endpoint with range: { "by": "id", "start": 1, "max": 5 }', () => {
  it("Response should be an Array of JSON objects with keys id and name", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"max":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "my-app-001");
  });
  it("Response should have a length of 5", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"max":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(5);
  });
  it("Response should be in ascending order", async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"max":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
});
