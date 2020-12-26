const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../model/user');
const config = require('./index');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

module.exports = passport =>
  passport.use(
    // eslint-disable-next-line new-cap
    new JwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) return done(null, user);

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
