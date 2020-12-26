const errorHandler = (err, req, res, next) => {
  if (err) {
    console.error(`Error: ${ err }`);
    res.status(404).json({ message: err });
  } else {
    next();
  }
};

module.exports = {
  errorHandler
}