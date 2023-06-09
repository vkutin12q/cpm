const express = require("express");
const router = express.Router();
const { authenticate, requireRole } = require('../helpers/roleValidator');
const {
    createTask,
    getTaskById,
    deleteTask,
    getTasks,
    getTasksByProjectId,
    updateTask,
    completedPercentage,
    latePercentage,
    doneCheck,
    getTaskByUserId,
    completionByTeam,
    findByName
} = require("../controller/TaskController");

router.get('/name', authenticate, requireRole({ collection: 1, task: 0 }), findByName);
router.get('/team', authenticate, requireRole({ collection: 2, task: 1 }), completionByTeam);
router.get('/user', authenticate, requireRole({ collection: 1, task: 0 }), getTaskByUserId);
router.post('/done/:id', authenticate, requireRole({ collection: 1, task: 0 }), doneCheck);
router.get('/lated/:id', authenticate, requireRole({ collection: 1, task: 0 }), latePercentage);
router.get("/completed/:id", authenticate, requireRole({ collection: 1, task: 0 }), completedPercentage);
router.get("/project/:id", authenticate, requireRole({ collection: 1, task: 0 }), getTasksByProjectId);
router.post("/", authenticate, requireRole({ collection: 1, task: 1 }), createTask);
router.get("/:id", authenticate, requireRole({ collection: 1, task: 0 }), getTaskById);
router.delete("/:id", authenticate, requireRole({ collection: 1, task: 3 }), deleteTask);
router.put("/:id", authenticate, requireRole({ collection: 1, task: 2 }), updateTask);
router.get("/", authenticate, requireRole({ collection: 1, task: 0 }), getTasks);

module.exports = router;
