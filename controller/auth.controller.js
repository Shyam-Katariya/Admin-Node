import { createLog } from '../logger/logger.js';
import { registerDetail } from '../services/auth.service.js';
import { successCommon } from '../utils/success.utils.js';
import axios from 'axios';

const logger = createLog('index');

/**
 * Registers a new user in the database.
 * @param {*} req - The request object containing user registration details in the body.
 * @param {*} res - The response object used to send back a success message.
 * @param {*} next - The next middleware function to handle errors.
 * @returns {Promise} - Sends a success response upon successful registration or passes an error to the next middleware.
 */
export const registerUser = async (req, res, next) => {
    try {
        await registerDetail(req.body, req.file, 'User not registered', 'user');
        logger.info(`User registered -> ${req.body.name}`);
        return successCommon(res, 200, 'User registered Successfully!');
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**********************************************************************/
/**************************** Render Pages ****************************/
/**********************************************************************/

/**
 * Renders the login selection page.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the login selection page.
 * @param {*} next - The next middleware function to handle errors.
 * @returns {Promise} - Renders the login selection page or passes an error to the next middleware.
 */
export const selectLogin = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.render('select-login', {
                layout: 'basic',
            });
        }
        const user = req.user;
        if (user.role == 'admin') {
            return res.redirect('/admin/dashboard');
        }
        if (user.role == 'user') {
            return res.redirect('/user/dashboard');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**
 * Renders the user login page if the user is not authenticated.
 * If the user is already authenticated, redirects to the home page.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the login page.
 * @param {*} next - The next middleware function to handle errors.
 * @returns {Promise} - Renders the user login page or redirects if the user is authenticated.
 */
export const loginPage = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            res.render('user-login', {
                layout: 'basic',
            });
        } else {
            return res.redirect('/user/dashboard');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**
 * Renders the user registration page if the user is not authenticated.
 * If the user is already authenticated, redirects to the home page.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the registration page.
 * @param {*} next - The next middleware function to handle errors.
 * @returns {Promise} - Renders the registration page or redirects if the user is authenticated.
 */
export const registrationPage = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            const country = await axios.get('https://top100movies-5f84e.web.app/city/allcountries');
            res.render('register', {
                layout: 'basic',
                country: country.data,
            });
        } else {
            return res.redirect('/user/dashboard');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};
