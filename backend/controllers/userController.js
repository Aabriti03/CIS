const User = require("../models/User");

// Get workers by specific category (via URL param)
const getWorkersByCategory = async (req, res) => {
  try {
    let normalizedCategory = req.params.category
      .toLowerCase()
      .replace(/[\s\-]/g, "");

    const validCategories = [
      "electric",
      "babysitting",
      "gardening",
      "househelp",
      "plumbing"
    ];
    if (!validCategories.includes(normalizedCategory)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const workers = await User.find({
      role: "worker",
      category: normalizedCategory,
    }).select("_id name email phone category createdAt");

    const formatted = workers.map((worker) => ({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      category: worker.category,
      dateJoined: new Date(worker.createdAt).toDateString(),
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in getWorkersByCategory:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Search workers by name or category (via query param ?q=...)
const searchWorkers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const regex = new RegExp(q, "i");

    const workers = await User.find({
      role: "worker",
      $or: [{ name: regex }, { category: regex }],
    }).select("_id name email phone category createdAt");

    const formatted = workers.map((worker) => ({
      _id: worker._id,
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      category: worker.category,
      dateJoined: new Date(worker.createdAt).toDateString(),
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Error in searchWorkers:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a single worker by ID (public)
const getWorkerById = async (req, res) => {
  try {
    const { id } = req.params;

    const worker = await User.findById(id).select("-password -__v");
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }

    return res.status(200).json(worker);
  } catch (error) {
    console.error("Error in getWorkerById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getWorkersByCategory,
  searchWorkers,
  getWorkerById,
};
