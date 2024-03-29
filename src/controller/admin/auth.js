const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const shortid = require('shortid')

exports.signup = (req,res) => {
  User.findOne({ email: req.body.email }).exec(async(error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already exists",
      });

    const { firstName, lastName, email,username,password } = req.body;

    const hash_password =await bcrypt.hash(password,10)

    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      userName: shortid.generate(),
      role:'seller'
    });

    User.create(_user,(error, data) => {
      if (error) {
        return res.status(400).json({
          message: "Something went wrong",
          error:error
        });
      }
      if (data) {
        return res.status(201).json({
          message:'Admin created successfully',
        });
      }
    });
  });
};

exports.signin = (req,res) => {
  User.findOne({ email: req.body.email }).exec(async(error, user) => {
    if (error) return res.status(400).send(error);
    if (user) {
      const isPassword = await user.authenticate(req.body.password)
      if (isPassword && user.role === "seller") {
        const token = jwt.sign(
          { _id: user._id, role: user.role },
          process.env.JWT_SECRET,
          {
            expiresIn: "24h",
          }
        );
        const { _id, firstName, lastName, email, role, fullName } = user;
        res.cookie("token", token, { expiresIn: "24h" });
        res.status(200).json({
          token,
          user: { _id, firstName, lastName, email, role, fullName },
        });
      } else {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  });
};

exports.signout = (req,res)=>{
 res.clearCookie('token')
 res.status(200).json({
  message:'Signout successfully'
 })
}