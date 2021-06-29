const app = require("../server/app");
const request = require("supertest");
const mongoose = require("mongoose");

afterAll(() => {
  mongoose.disconnect();
});

function checkIfSorted(array, order) {
  let arr = array;
  order === "desc" ? arr.reverse() : null;
  let previousId = arr[0].id;
  for (let i = 1; i < arr.length; i++) {
    if (previousId > arr[i].id) {
      previousId = arr[i].id;
      return false;
    }
  }
  return true;
}

describe("GET /apps endpoint with a range requires 'by': 'id' or 'by':'name", () => {
  it(`Response should be a status 400 when 'by' isn't in range. using range { "start": 1, "max": 5 }`, async () => {
    const res = await request(app).get(
      '/apps/%7B%20"start":%201,%20"max":%205%20%7D'
    );
    console.log(res.statusCode);
    console.log(res.body[0].by);
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].by).toEqual('The key "by" is required');
  });
  it(`Response should be a status 400 when "by" isn't "id" or "name". using range { "by": "a" }`, async () => {
    const res = await request(app).get('/apps/%7B%20"by":%20"a"%20%7D');
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].by).toEqual(
      'Only values permitted for "by" are "id" and "name"'
    );
  });
  it(`Response should be a status 400 when "by" isn't "id" or "name". using range { "by": 1 }`, async () => {
    const res = await request(app).get('/apps/%7B%20"by":%201%20%7D');
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].by).toEqual(
      'Only values permitted for "by" are "id" and "name"'
    );
  });
});

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

describe(`GET /apps endpoint with range`, () => {
  it(`When "start" is omitted from range start is assumed to be the first in the set. "range": { "by": "id" }`, async () => {
    const res = await request(app).get(`/apps/%7B%20"by":%20"id"%20%7D`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toEqual(true);
    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "my-app-001");
  });
  it(`When "start" isn't omitted but "end" is omitted results will return with no ending bound, but will still return results account for "max" page size. When max is omitted default max is 50. "range": { "by": "id", "start": 1 }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(50);
  });
  it(`When "start" isn't omitted but "end" is omitted results will return with no ending bound, but will still return results account for "max" page size. "range": { "by": "id", "start": 1, "max": 5 }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"max":%205%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(5);
  });
  it(`When "end" identifier extends beyond what can fit inside the maximum page, page takes precedence. When max is omitted default max is 50. "range": { "by": "id", "start": 1, "end": 155 }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"end":%20155%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(50);
  });
  it(`When "end" identifier extends beyond what can fit inside the maximum page, page takes precedence. "range": { "by": "id", "start": 1, "end": 50, "max": 10 }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"start":%201,%20"end":%2050,%20"max":%2010%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(10);
  });
  it(`When order is omitted response should be in ascending order. "range": { "by": "id" }`, async () => {
    const res = await request(app).get(`/apps/%7B%20"by":%20"id"%20%7D`);
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
  it(`When order is "asc"response should be in ascending order. "range": { "by": "id", "order": "asc" }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"order":%20"asc"%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
  it(`When order is "desc"response should be in descending order. "range": { "by": "id", "order": "desc" }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"order":%20"desc"%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(checkIfSorted(res.body, "desc")).toEqual(true);
  });
  it(`When order is "a"response should be an error message. "range": { "by": "id", "order": "a" }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"id",%20"order":%20"a"%20%7D`
    );
    expect(res.statusCode).toEqual(400);
    expect(res.body[0].order).toEqual(
      `Only values permitted for order are \"asc\" and \"desc\"`
    );
  });
  it(`Testing when "by": "name" is used. "range": { "by": "name", "start": "my-app-001", "end": "my-app-050", "max": 10, "order": "asc" }`, async () => {
    const res = await request(app).get(
      `/apps/%7B%20"by":%20"name",%20"start":%20"my-app-001",%20"end":%20"my-app-050",%20"max":%2010,%20"order":%20"asc"%20%7D`
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty("id", 1);
    expect(res.body[0]).toHaveProperty("name", "my-app-001");
    expect(res.body[res.body.length - 1]).toHaveProperty("id", 10);
    expect(res.body[res.body.length - 1]).toHaveProperty("name", "my-app-010");
    expect(res.body.length).toEqual(10);
    expect(checkIfSorted(res.body)).toEqual(true);
  });
});
