/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToPrivKey = path.join(__dirname, "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivKey, "utf8");

function issueJWT(user) {
  const _id = user._id;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

module.exports.issueJWT = issueJWT;
