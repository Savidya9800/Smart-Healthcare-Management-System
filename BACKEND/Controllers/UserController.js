const User = require("../Models/UserModel");

//Data Display
const getAllUsers = async (req, res, next) => {
  let Users;

  //Get all Users
  try {
    Users = await User.find();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  //not found
  if (!Users) {
    return res.status(404).json({ message: "No Users found" });
  }

  //Display all users
  return res.status(200).json(Users);
};

//Data Insert
const addUsers = async (req, res, next) => {
  const { name, email, password } = req.body;

  let users;

  //Insert User
  try {
    users = new User({ name, email, password });
    await users.save();
  } catch (err) {
    console.log(err);
  }

  //not insert users
  if (!users) {
    return res.status(404).json({ message: "unable to add users" });
  }
  return res.status(200).json(users);
};

//Get by Id
const getById = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findById(id);
  } catch (err) {
    console.log(err);
  }

  //not available users
  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }
  return res.status(200).json(user);
};

//Update User Details
const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const { name, email, password } = req.body;

  let users;
  try {
    users = await User.findByIdAndUpdate(id, {
      name: name,
      email: email,
      password: password,
    });
    users = await users.save();
  } catch (err) {
    console.log(err);
  }

  //not available users
  if (!users) {
    return res.status(404).json({ message: "Unable to update user Details" });
  }
  return res.status(200).json(users);
};

//Delete User
const deleteUser = async (req, res, next) => {
  const id = req.params.id;

  let user;
  try {
    user = await User.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
  }

  //not available users
  if (!user) {
    return res.status(404).json({ message: "Unable to delete user" });
  }
  return res.status(200).json(user);
};
exports.getAllUsers = getAllUsers;
exports.addUsers = addUsers;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
