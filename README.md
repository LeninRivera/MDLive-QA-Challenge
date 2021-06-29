# MDLive Pagination Endpoint

Pagination is a technique frequently seen in HTTP API's to make working with large data sets more manageable. A huge number of different styles and implementations can be observed across the web, but all of them share common characteristics.

## Table of Contents

- [Challenge](#challenge)
- [Solution](#solution)
- [API Documentation](#api-documentation)
- [Example End Points](#example-end-points)
- [Testing](#testing)
- [Technologies Used](#technologies-used)

## Challenge

The challenge is to build a simple HTTP API endpoint that will perform pagination. The endpoint will return a JSON array of "apps" that look like the following:

```javascript
[
  {
    id: 1,
    name: "my-app-001",
  },
];
```

When no "range" parameters are provided with a request, the endpoint should respond with an array according to default parameters. When the endpoint is requested with a `"range"`, it should modify its response to appropriately include only the items bounded by that range request.

## Solution

When no `"range"` parameter are provided we have set the default parameters to be `{ "by": "id", "start": 1, "max": 50, "order": "asc" }`. When a range is given in the parameter we use `JSON.parse(req.params.range)` to convert the `"range"` parameters into a JSON. We then validate that the `"range"` request are valid. For example, we make sure that `"by"` is part of the `"range"` as it is required. We also check that when `"start"`, `"end"` and `"max"` aren't omitted the value are `1-999` and that `"order"` is only given the values `"asc"` or `"desc"`.

After validating the `"range"` request we set our values for `"start"`, `"end"`, `"max"` and `"order"` to our default values if omitted or the value provided in the `"range"` request. We then use the code below to retrieve our data from our database:

```javascript
const search = {};
search[by] = { $gt: start - 1 };

const pagination = await MyApps.find(search)
  .select("-_id -__v")
  .limit(end === undefined ? max : Math.min(end, max));
```

## API Documentation

There is ony one endpoint in this API \([/apps](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/)\) and it can appropriately modify the response when requested with a `"range"`. The default endpoint `/apps` will respond to the client with an array of objects with the first 50 "apps" sorted in ascending order.

The client can also provide a `"range"` by attaching a JSON object to the end of the endpoint `/apps/{ "by": "id", "start": 5, "end": 10, "max": 10, "order": "asc" }`.

Note:

- `"by"` is required and the only values permitted are "id" and "name". In the event that the value is not provided or invalid, the server will return a 400 error code.
- `"start"` defaults to `1` or `"my-app-001"` if none is provided by the client. Only values permitted for "start" are numbers `1-999` and `"my-app-001" - "my-app-999"`.
- `"end"` has no default value when omitted and in which case the program queries with no ending bound, but will still return results account for `"max"` page size. Only values permitted for "end" are numbers `1-999` and `"my-app-001" - "my-app-999"`.
- `"max"` defaults to `50` when omitted. For cases where the `"end"` identifier extends beyond what can fit inside the `"max"` page, the page sizes takes precedence. Only values permitted for `"max"` are `1-999`.
- `"order"` defaults to "asc" when omitted. Only values permitted for order are `"asc"` and `"desc"`.

## Example End Points

- [https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/)
- [/apps/{ "by": "id" }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22%20%7D)
- [/apps/{ "by": "id", "start": 1 }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%201%20%7D)
- [/apps/{ "by": "id", "start": 1, "end": 5 }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%201,%20%22end%22:%205%20%7D)
- [/apps/{ "by": "id", "start": 5 }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%205%20%7D)
- [/apps/{ "by": "id", "start": 1, "max": 5 }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%201,%20%22max%22:%205%20%7D)
- [/apps/{ "by": "id", "start": 1, "order": "desc" }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%201,%20%22order%22:%20%22desc%22%20%7D)
- [/apps/{ "by": "id", "start": 5, "end": 10, "max": 10, "order": "asc" }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22id%22,%20%22start%22:%205,%20%22end%22:%2010,%20%22max%22:%2010,%20%22order%22:%20%22asc%22%20%7D)
- [/apps/{ "by": "name", "start": "my-app-001", "end": "my-app-050", "max": 10, "order": "asc" }](https://lenin-rivera-mdlive-qa-challen.herokuapp.com/apps/%7B%20%22by%22:%20%22name%22,%20%22start%22:%20%22my-app-001%22,%20%22end%22:%20%22my-app-050%22,%20%22max%22:%2010,%20%22order%22:%20%22asc%22%20%7D)

## Testing

The Automatic test covering the endpoint `/apps` was done using Jest and SuperTest. To setup testing you need to create a config folder in the root directory and create a test.env file `/config/test.env`.

Inside the `test.env` you need to change the MONGODB_URL, so that you can run your local version of MongoDB. To run the test you can use `npm run test:local`.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose.js
- Jest
- Supertest
- Embedded JavaScript templates
