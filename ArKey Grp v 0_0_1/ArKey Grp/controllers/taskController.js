let tasks = []; // Simulación de una base de datos

// Obtener todas las tareas
exports.getTasks = (req, res) => {
  res.json(tasks);
};

// Agregar una nueva tarea
exports.addTask = (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ message: "Descripción requerida" });
  }
  const newTask = { id: tasks.length + 1, description };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

// Actualizar una tarea
exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { description } = req.body;
  const task = tasks.find((t) => t.id === parseInt(id));
  if (task) {
    task.description = description;
    res.json(task);
  } else {
    res.status(404).json({ message: "Tarea no encontrada" });
  }
};

// Eliminar una tarea
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== parseInt(id));
  res.status(204).send();
};