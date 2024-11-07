import { createLog } from '../logger/logger.js';
import User from '../model/user.model.js';
import { registerDetail } from '../services/auth.service.js';
import { commonError } from '../utils/commonError.js';
import { successCommon } from '../utils/success.utils.js';

const logger = createLog('index');

/**
 * Adds a new admin user by calling the registerDetail function.
 * @param {*} req - The request object containing admin user details in the body.
 * @param {*} res - The response object used to send back the success message.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Sends a success response upon successful registration or passes an error to the next middleware.
 */
export const addAdminUser = async (req, res, next) => {
    try {
        await registerDetail(req.body, req.file,'Admin User not registered', 'admin');
        logger.info(`Admin User registered -> ${req.body.name}`);
        return successCommon(res, 200, 'Admin User registered');
    } catch (error) {
        logger.error(error.message);
        return commonError(res, 500, error.message);
    }
};

/**********************************************************************/
/**************************** Render Pages ****************************/
/**********************************************************************/

/**
 * Renders the admin login page.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the login page.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Renders the admin login page or passes an error to the next middleware.
 */
export const adminLogin = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            res.render('admin-login', {
                layout: 'basic',
            });
        } else {
            return res.redirect('/admin/dashboard');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**
 * Renders the admin dashboard displaying user statistics and information.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the dashboard.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Renders the admin dashboard or redirects to the home page if the user is not authenticated.
 */
export const adminDashboard = async (req, res, next) => {
    try {
        const user = req.user;
        if (req.isAuthenticated() && user.role == 'admin') {
            const users = await User.find({ role: 'user' }).lean() || [];
            const admin = await User.find({ role: 'admin' }).lean() || [];
            const activeUser = (await User.find({ isActive: true, role: 'user' }).lean()) || 0;
            const inactiveUser = (await User.find({ isActive: false, role: 'user' }).lean()) || 0;
            res.render('a-dashboard', {
                users,
                activeUser,
                inactiveUser,
                admin,
                total: activeUser.length + inactiveUser.length,
            });
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**
 * Renders the admin registration page for creating new admin users.
 * @param {*} req - The request object.
 * @param {*} res - The response object used to render the registration page.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Renders the admin registration page or redirects to the home page if the user is not authenticated.
 */
export const registerAdmin = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/');
        }
        res.render('a-register', {});
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};