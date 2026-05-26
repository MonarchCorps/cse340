import { getUpcomingProjects, getProjectById, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Project title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isDate().withMessage('Please provide a valid date'),
    body('organizationId')
        .notEmpty().withMessage('Organization is required')
        .isInt().withMessage('Please select a valid organization'),
    body('timeCommitment')
        .trim()
        .notEmpty().withMessage('Time commitment is required')
        .isLength({ max: 100 }).withMessage('Time commitment cannot exceed 100 characters'),
    body('volunteersNeeded')
        .notEmpty().withMessage('Number of volunteers needed is required')
        .isInt({ min: 1 }).withMessage('Volunteers needed must be at least 1'),
];

const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects();
    const title = 'Service Projects';

    res.render('projects', { title, projects });
};

const showProjectDetailsPage = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    const categories = await getCategoriesByProjectId(projectId);
    const title = project ? project.title : 'Project Details';

    res.render('project', { title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

const processNewProjectForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, date, organizationId, timeCommitment, volunteersNeeded } = req.body;

    try {
        const newProjectId = await createProject(title, description, location, date, organizationId, timeCommitment, volunteersNeeded);
        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const project = await getProjectById(projectId);
    const organizations = await getAllOrganizations();
    const title = project ? `Edit: ${project.title}` : 'Edit Project';

    res.render('edit-project', { title, project, organizations });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, date, organizationId, timeCommitment, volunteersNeeded } = req.body;

    try {
        await updateProject(projectId, title, description, location, date, organizationId, timeCommitment, volunteersNeeded);
        req.flash('success', 'Project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

export { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation };
