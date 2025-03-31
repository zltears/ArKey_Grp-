const express = require("express");
const taskController = require("../controllers/taskController");

const router = express.Router();

// Rutas CRUD
router.get("/", taskController.getTasks);
router.post("/", taskController.addTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;