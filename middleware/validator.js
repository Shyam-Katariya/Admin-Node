import validator from 'validator';
const { isEmail } = validator;

/**
 * Middleware to validate the email address from the request body.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function in the stack.
 */
export const isEmailValid = (req, res, next) => {
    try {
        const { email } = req.body;        
        // Use the validator to check if the email is valid
        if (isEmail(email)) {
            next();
        } else {
            // Throw an error if email is invalid
            throw new Error('Invalid email');
        }
    } catch (error) {
        return res.status(400).json({type: 'error', message: 'Invalid email' });
    }
};