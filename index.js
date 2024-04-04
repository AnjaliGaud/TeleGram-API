require("dotenv").config();

const app = require("./app");
const db = require("./db");

(async () => {
  try {
    await db.connectDB();
    await app.startServer();
  } catch (err) {
    console.log(err);
  }
})();
