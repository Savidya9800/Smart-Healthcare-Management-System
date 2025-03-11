const express = require("express");
const router = express.Router();

//Insert Model
const User = require("../Models/UserModel");

//Insert user controller
const UserController = require("../Controllers/UserController");

router.get("/", UserController.getAllUsers);
router.post("/", UserController.addUsers);
router.get("/:id", UserController.getById);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

//export
module.exports = router;
