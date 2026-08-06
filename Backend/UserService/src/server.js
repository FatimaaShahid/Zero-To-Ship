require("dotenv").config();
const createApp = require("./app");

const PORT = process.env.PORT || 8000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`user-service listening on port ${PORT}`);
});
