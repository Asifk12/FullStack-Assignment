const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ➤ Get All Genders (GET)
router.get("/genders", async (req, res) => {
  try {
    const genderOptions = ["Male", "Female", "Other"];
    res.status(200).json(genderOptions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gender list" });
  }
});

// ➤ Create User (POST)
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User created successfully!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ Get All Users (GET)
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get User by ID (GET)
router.get("/:id", async (req, res) => {
  // If the request is for "genders", return early
  if (req.params.id === "genders") {
    return res.status(200).json(["Male", "Female", "Other"]);
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});


// ➤ Update User (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ➤ Delete User (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
