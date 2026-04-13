const Location = require("../models/location");

// POST → save multiple locations
exports.saveLocations = async (req, res) => {
  try {
    const data = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const saved = await Location.insertMany(data);

    res.status(201).json({
      message: "Locations saved",
      count: saved.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET → fetch all
// exports.getLocations = async (req, res) => {
//   try {
//     const data = await Location.find().sort({ createdAt: -1 });
//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
