const app = require("./server/app"),
  port = 8080;

app.listen(port, () => console.log(`Express server is up on port ${port}`));
