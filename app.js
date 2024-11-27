const express = require("express");
const dotenv = require("dotenv");
const app = express();
const PORT = process.env.PORT || 8000;
const routes = require("./src/routes/routes.js");

app.use(express.json());
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
