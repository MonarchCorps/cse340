import express from 'express';

import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm, organizationValidation } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, showEditProjectForm, processEditProjectForm, projectValidation } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';
import { processAddVolunteer, processRemoveVolunteer } from './controllers/volunteers.js';
import { showUserRegistrationForm, processUserRegistrationForm, registrationValidation, showLoginForm, processLoginForm, processLogout, requireLogin, requireRole, showDashboard, showUsersPage } from './controllers/users.js';

const router = express.Router();

const requireAdmin = [requireLogin, requireRole('admin')];

router.get('/', showHomePage);

// Organizations
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/new-organization', ...requireAdmin, showNewOrganizationForm);
router.post('/new-organization', ...requireAdmin, organizationValidation, processNewOrganizationForm);
router.get('/edit-organization/:id', ...requireAdmin, showEditOrganizationForm);
router.post('/edit-organization/:id', ...requireAdmin, organizationValidation, processEditOrganizationForm);

// Projects
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/new-project', ...requireAdmin, showNewProjectForm);
router.post('/new-project', ...requireAdmin, projectValidation, processNewProjectForm);
router.get('/edit-project/:id', ...requireAdmin, showEditProjectForm);
router.post('/edit-project/:id', ...requireAdmin, projectValidation, processEditProjectForm);

// Categories
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
router.get('/new-category', ...requireAdmin, showNewCategoryForm);
router.post('/new-category', ...requireAdmin, categoryValidation, processNewCategoryForm);
router.get('/edit-category/:id', ...requireAdmin, showEditCategoryForm);
router.post('/edit-category/:id', ...requireAdmin, categoryValidation, processEditCategoryForm);

// Assign categories (admin only)
router.get('/project/:projectId/assign-categories', ...requireAdmin, showAssignCategoriesForm);
router.post('/project/:projectId/assign-categories', ...requireAdmin, processAssignCategoriesForm);

// Registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', registrationValidation, processUserRegistrationForm);

// Login / logout routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);

// Volunteer routes (login required)
router.post('/project/:id/volunteer', requireLogin, processAddVolunteer);
router.post('/project/:id/unvolunteer', requireLogin, processRemoveVolunteer);

// Protected routes
router.get('/dashboard', requireLogin, showDashboard);
router.get('/users', ...requireAdmin, showUsersPage);

// error-handling routes
router.get('/test-error', testErrorPage);

export default router;
