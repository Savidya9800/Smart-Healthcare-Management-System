const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const Doctor = require("../Models/DoctorManagement/doctorModel"); // Import Doctor model

// Register a User (Signup)
const registerUser = async (req, res) => {
  const { name, email, password, mobile, regDate, bloodGroup, country, city, gender, dateOfBirth } = req.body;

  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      mobile,
      regDate,
      bloodGroup,
      country,
      city,
      gender,
      dateOfBirth,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", user, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Register a Doctor (Signup)
const registerDoctor = async (req, res) => {
  const { name, email, password, phone, specialization, qualifications, experience, address, availability, gender, dateOfBirth, regDate } = req.body;

  try {
    let existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create doctor
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
      specialization,
      qualifications,
      experience,
      address,
      availability,
      gender,
      dateOfBirth,
      regDate,
    });

    await newDoctor.save();

    // Generate JWT Token
    const token = jwt.sign(
      { id: newDoctor._id, email: newDoctor.email, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Doctor registered successfully",
      doctor: newDoctor,
      token: token,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Doctor Login
const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(req.body);
    const doctor = await Doctor.findOne({ email });
    console.log(doctor);
    if (!doctor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: doctor._id, email: doctor.email, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Doctor login successful", doctor, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Export Controllers
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.registerDoctor = registerDoctor;
exports.loginDoctor = loginDoctor;



