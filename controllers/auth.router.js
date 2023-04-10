const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authRouter = Router();

//admin
const USER = {
  username: "admin",
  email: "admin@admin.com",
  password: "$2b$10$pQ2ACLjPHUmOcCO8trvo0e/Ezown75QBxdr1RMhZdJHlnnlQEHRgG",
};

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const passwordMatch = await bcrypt.compare(password, USER.password);
  if (email !== USER.email || !passwordMatch) {
    res.status(401).json({ message: "Bad credentials" });
    return;
  }
  let token;
  try {
    //Creating jwt token
    token = jwt.sign({ userId: 1, email }, process.env.JWT_SECRET, {
      expiresIn: "72h",
    });
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }
  res.status(200).json({ access_token: token });
});

module.exports = { authRouter };
