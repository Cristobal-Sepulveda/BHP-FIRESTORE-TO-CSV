const express = require("express");
const { generateAndSendCsv } = require("../controllers/controller");

const router = express.Router();

router.get("/generateAndSendCsv", generateAndSendCsv);

module.exports = router;