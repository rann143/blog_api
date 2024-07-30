/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// const pathToPrivKey = path.join(__dirname, "id_rsa_priv.pem");
// const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf8");
const privKey = process.env.PRIV_KEY;

function issueJWT(user) {
  const _id = user._id;
  const expiresIn = "2d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, privKey, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

module.exports.issueJWT = issueJWT;
