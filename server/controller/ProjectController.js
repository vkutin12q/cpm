const mongoose = require('mongoose');
const Project = require('../models/project.model');
const Team = require('../models/team.model');
const jwt = require('jsonwebtoken');

const addProject = async (req, res) => {
    try {
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
            status: req.body.status,
            team: new mongoose.Types.ObjectId(req.body.team),
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getProjects = async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    try {
        if (req.user.role == 'admin') {
            const projects = await Project.find().limit(limit).skip(limit * (page - 1));
            res.json(projects);
        } else {
            const teams = await Team.find({ members: { $elemMatch: { $eq: req.user.id } } });
            const teamIds = teams.map((team) => team._id);
            const projects = await Project.find({ team: { $in: teamIds } }).limit(limit).skip(limit * (page - 1));
            res.json(projects);
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        if (req.user.role != 'admin') {
            const teams = await Team.find({ members: { $elemMatch: { $eq: req.user.id } } });
            const teamIds = teams.map((team) => team._id);
            const projects = await Project.find({ team: { $in: teamIds } });
            const projectExists = projects.some((p) => p._id.equals(project._id));
            if (!projectExists) {
                return res.status(404).json({ error: 'Project not found' });
            }
        }
        res.json(project);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const findProject = async (req, res) => {
    const { page = 1, limit = 3 } = req.query;
    const { search } = req.query;
    console.log(search);
    try {
        if (req.user.role === 'admin') {
            const projects = await Project.find({ title: { $regex: search, $options: 'i' } }).limit(limit).skip(limit * (page - 1));
            res.json(projects);
        } else {
            const teams = await Team.find({ members: { $elemMatch: { $eq: req.user.id } } });
            const teamIds = teams.map((team) => team._id);
            const projects = await Project.find({ team: { $in: teamIds }, title: { $regex: search, $options: 'i' } }).limit(limit).skip(limit * (page - 1));
            res.json(projects);
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
module.exports = {
    addProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    findProject
};