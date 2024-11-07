import User from '../model/user.model.js';
import { createLog } from '../logger/logger.js';
import { successCommon, successCommonWithData } from '../utils/success.utils.js';
import axios from 'axios';
const logger = createLog('index');

/**
 * Updates the status of a user based on the provided user ID in the request parameters.
 * @param {*} req - The request object containing user ID in params and new status in body.
 * @param {*} res - The response object used to send back the updated user status.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Sends a success response with a message or passes an error to the next middleware.
 */
export const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(
            { _id: id },
            { isActive: req.body.status }
        );
        logger.info(`User updated -> ${id}`);
        return successCommon(res, 200, 'User status updated successfully');
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

// Function to fetch the list of states based on the provided country code
export const getStateByCountry = async (req, res, next) => {
    try {
        // Destructure the country code from the request body
        const { country } = req.body;
        // Call the external API to get states based on country code
        const findState = await axios.get(`https://top100movies-5f84e.web.app/city/states-by-countrycode?countrycode=${country}`);
        // Log the successful retrieval of state data for debugging and monitoring
        logger.info(`state list fetched based on country -> ${country}`);
        // Return success response with the retrieved state data
        return successCommonWithData(res, 200, findState.data, 'state list fetched successfully');
    } catch (error) {
        // Log error message if API call fails or an exception occurs
        logger.error(error.message);
        // Return error response to the client with error message
        return commonError(res, 400, error.message);
    }
};

// Function to fetch the list of cities based on the provided country and state codes
export const getCityByState = async (req, res, next) => {
    try {
        // Destructure country and state codes from the request body
        const { country, state } = req.body;
        // Call the external API to get cities based on country and state codes
        const findCity = await axios.get(`https://top100movies-5f84e.web.app/city/cities-by-countrycode-and-statecode?countrycode=${country}&statecode=${state}`);
        // Log the successful retrieval of city data for debugging and monitoring
        logger.info(`city list fetched based on country -> ${country} & state -> ${state}`);
        // Return success response with the retrieved city data
        return successCommonWithData(res, 200, findCity.data, 'city list fetched successfully');
    } catch (error) {
        // Log error message if API call fails or an exception occurs
        logger.error(error.message);
        // Return error response to the client with error message
        return commonError(res, 400, error.message);
    }
};


/**
 * Updates the user's details such as name and email based on the provided user ID in the request parameters.
 * @param {*} req - The request object containing user ID in params and new user details in body.
 * @param {*} res - The response object used to send back the updated user data.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Sends a success response with the updated user data or passes an error to the next middleware.
 */
export const updateUserDetail = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const { _id } = await User.findByIdAndUpdate(
            { _id: id },
            { name: name, email: email }
        );
        const user = await User.findById(_id);
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        logger.info(`User updated -> ${id}`);
        return successCommonWithData(
            res,
            200,
            userData,
            'User updated successfully'
        );
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};

/**********************************************************************/
/**************************** Render Pages ****************************/
/**********************************************************************/

/**
 * Renders the user management page for a specific user based on the user ID provided in the request parameters.
 * @param {*} req - The request object containing user ID in params.
 * @param {*} res - The response object used to render the manage user page.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Renders the user management page or passes an error to the next middleware.
 */
export const manageUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (req.isAuthenticated() && user.role == 'user') {
            const { id } = req.params;
            const user = await User.findOne({ _id: id }).lean();
            res.render('manage-user', {
                user,
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
 * Renders the dashboard for an authenticated user based on the user ID provided in the request parameters.
 * @param {*} req - The request object containing user ID in params and authentication status.
 * @param {*} res - The response object used to render the dashboard page.
 * @param {*} next - The next middleware function in the stack to handle errors.
 * @returns {Promise} - Renders the dashboard page for the authenticated user or redirects unauthenticated users to the homepage.
 */
export const dashboard = async (req, res, next) => {
    try {
        const user = req.user;
        if (req.isAuthenticated() && user.role == 'user') {
            const userFound = await User.findOne({ _id: user._id }).lean();
            res.render('dashboard', {
                user: userFound,
            });
        } else {
            return res.redirect('/');
        }
    } catch (error) {
        logger.error(error.message);
        next(error);
    }
};
