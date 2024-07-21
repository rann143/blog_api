const auth = (function () {
  const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(401).json({ msg: "You are not permitted to view this page" });
    }
  };

  return {
    isAdmin,
  };
})();

module.exports = auth;
