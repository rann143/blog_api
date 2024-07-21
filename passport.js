/* eslint-disable no-undef */
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const fs = require("fs");
const path = require("path");

const User = require("./models/user");
require("dotenv").config();

// const pathToKey = path.join(__dirname, "id_rsa_pub.pem");
// const PUB_KEY = fs.readFileSync(pathToKey, "utf8");
const pubKey = process.env.PUB_KEY;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: pubKey,
  algorithms: ["RS256"],
};

const jwtStrat = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub }).exec();

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err);
  }
});

module.exports = (passport) => {
  passport.use(jwtStrat);
};
