import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { pbkdf2 as _pbkdf2, randomBytes, timingSafeEqual } from 'crypto';
import User from '../model/user.model.js';
import { encryption } from '../config/auth.config.js';
import { promisify } from 'util';

const pbkdf2 = promisify(_pbkdf2);

/**
 * Registers a new user by adding their details to the user collection.
 * @param {Object} params - User registration details.
 * @param {String} message - Error message for registration failures.
 * @param {String} role - Role assigned to the user (e.g., 'user', 'admin').
 * @returns {Object} - The created user object.
 * @throws {Error} - Throws an error if registration fails.
 */
export const registerDetail = async (params, file, message, role) => {
    const { password, name, email, country, state, city } = params;
    // Validate input parameters
    if (!password || !name || !email) {
        throw new Error('All Form fields are required');
    }
    // check for duplicate email
    const sameEmailFound = await User.findOne({ email });
    if (sameEmailFound) {
        throw new Error('Email already registered');
    }
    try {
        const hashedPassword = await hashPassword(password);
        const userDetail = {
            name,
            email,
            password: hashedPassword,
            role,
            isActive: true,
        };
        if (file) {
            userDetail.file = file.filename;
        }
        if (country) userDetail.country = country
        if(state) userDetail.state = state
        if (city) userDetail.city = city
        return await User.create(userDetail);
    } catch (error) {
        throw new Error(message);
    }
};

/**
 * Hashes a password using PBKDF2 and returns a salt:hash string.
 * @param {string} password - User's plain text password.
 * @returns {Promise<string>} - Combined salt and hashed password.
 */
export const hashPassword = async (password) => {
    const salt = randomBytes(16).toString('hex');
    const hash = await pbkdf2(
        password,
        salt,
        encryption.ITERATIONS,
        encryption.KEY_LENGTH,
        encryption.ALGORITHM
    );
    return `${salt}:${hash.toString('hex')}`; // Return salt:hash format
};

/**
 * Verifies the provided password against the stored password hash.
 * @param {string} password - Plain text password entered by the user.
 * @param {string} storedPassword - Salted and hashed password from the database.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 */
export const verifyPassword = async (password, storedPassword) => {
    const [salt, storedHash] = storedPassword.split(':');
    const hash = await pbkdf2(
        password,
        salt,
        encryption.ITERATIONS,
        encryption.KEY_LENGTH,
        encryption.ALGORITHM
    );
    return timingSafeEqual(Buffer.from(storedHash, 'hex'), hash);
};

/**
 * Configures Passport.js for local authentication.
 * @param {*} passport - Passport instance for configuration.
 */
export const configPassport = (passport) => {
    // Use local strategy for authentication with email as the username field
    passport.use(
        new LocalStrategy(
            { usernameField: 'email' }, // Specify the username field
            async (email, password, done) => {
                try {
                    // Validate that both email and password are provided
                    if (!email || !password) {
                        return done(null, false, new Error('Both email and password are required.'));
                    }
                    // Find the user by email
                    const user = await User.findOne({ email });
                    if (!user) {
                        return done(null, false, new Error('Incorrect username or password.'));
                    }
                    // Verify the password using the stored hash
                    const isPasswordValid = await verifyPassword( password, user.password );
                    if (!isPasswordValid) {
                        return done(null, false, new Error('Incorrect username or password.'));
                    }
                    // If everything is valid, return the user
                    return done(null, user);
                } catch (error) {
                    // Handle any errors that occur during the process
                    return done(error, false);
                }
            }
        )
    );

    // Serialize user to store the user ID in the session
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // Deserialize user by retrieving the user from the database using the stored ID
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            // Return the user object
            done(null, user); 
        } catch (error) {
            // Handle error if user is not found
            done(error, false); 
        }
    });
};
