import { getAllCategories, getCategoryById, getCategoriesByProjectId, updateCategoryAssignments, createCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategoryId, getProjectById } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3, max: 100 }).withMessage('Category name must be between 3 and 100 characters'),
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const projects = await getProjectsByCategoryId(categoryId);
    const title = category ? category.name : 'Category Details';

    res.render('category', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const project = await getProjectById(projectId);
    const allCategories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, project, allCategories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const categoryIds = req.body.categoryIds
        ? (Array.isArray(req.body.categoryIds) ? req.body.categoryIds : [req.body.categoryIds])
        : [];

    await updateCategoryAssignments(projectId, categoryIds);
    req.flash('success', 'Categories updated successfully!');
    res.redirect(`/project/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/new-category');
    }

    try {
        const { name } = req.body;
        const newCategoryId = await createCategory(name);
        req.flash('success', 'Category created successfully!');
        res.redirect(`/category/${newCategoryId}`);
    } catch (error) {
        console.error('Error creating category:', error);
        req.flash('error', 'There was an error creating the category.');
        res.redirect('/new-category');
    }
};

const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);
    const title = category ? `Edit: ${category.name}` : 'Edit Category';

    res.render('edit-category', { title, category });
};

const processEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        const { name } = req.body;
        await updateCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect(`/edit-category/${categoryId}`);
    }
};

export { showCategoriesPage, showCategoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, showNewCategoryForm, processNewCategoryForm, showEditCategoryForm, processEditCategoryForm, categoryValidation };
