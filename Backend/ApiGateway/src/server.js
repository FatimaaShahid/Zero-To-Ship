const createApp = require("./app");
const { port, services } = require("./config/config");

const app = createApp();

app.listen(port, () => {
  console.log(`api-gateway listening on port ${port}`);
  console.log("routing to:", services);
});
