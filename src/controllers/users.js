import bcrypt from 'bcrypt';
import { body, validationResult } from 'express-validator';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const SALT_ROUNDS = 10;

const registrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
];

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const results = validationResult(req);

    if (!results.isEmpty()) {
        results.array().forEach((error) => req.flash('error', error.msg));
        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        await createUser(name, email, passwordHash);
        req.flash('success', 'Registration successful! You can now log in.');
        res.redirect('/');
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'An account with that email already exists.');
        } else {
            req.flash('error', 'There was an error creating your account. Please try again.');
        }
        res.redirect('/register');
    }
};

const requireRole = (roleName) => (req, res, next) => {
    if (!req.session.user || req.session.user.role_name !== roleName) {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/dashboard');
    }
    next();
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'Registered Users', users });
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', { title: 'Dashboard', name, email });
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);

    if (user) {
        req.session.user = user;
        req.flash('success', 'You are now logged in.');
        console.log('Logged in user:', user);
        return res.redirect('/dashboard');
    }

    req.flash('error', 'Invalid email or password.');
    res.redirect('/login');
};

const processLogout = (req, res) => {
    req.session.regenerate(() => {
        req.flash('success', 'You have been logged out.');
        res.redirect('/login');
    });
};

export { showUserRegistrationForm, processUserRegistrationForm, registrationValidation, showLoginForm, processLoginForm, processLogout, requireLogin, requireRole, showDashboard, showUsersPage };
