const registerUser = (req, res) => {
  try {
    console.log(req.fields);
    console.log(req.fiels);
    res.status(201).json({
      message: "user is created",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { registerUser };
