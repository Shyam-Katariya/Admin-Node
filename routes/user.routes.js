import { Router } from 'express';
import passport from 'passport';
import { loginPage, registrationPage, registerUser } from '../controller/auth.controller.js';
import { successCommonWithData } from '../utils/success.utils.js';
import { isEmailValid } from '../middleware/validator.js';
import { dashboard, updateUserStatus, manageUser, updateUserDetail, getStateByCountry, getCityByState } from '../controller/user.controller.js';
const router = Router();

router.get('/', (req, res, next) => {
    try {
        return res.redirect('/user/dashboard');
    } catch (error) {
        next(error);
    }
});

router.get('/login', loginPage);

router.get('/register', registrationPage);

router.get('/dashboard', dashboard);

router.post('/add', isEmailValid, registerUser);

router.post('/country', getStateByCountry);

router.post('/state', getCityByState);

router.put('/update/:id', updateUserDetail);

router.patch('/status/:id', updateUserStatus);

router.get('/manage/:id', manageUser);

router.post('/login', isEmailValid, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).json({ type: 'error', message: 'Invalid form detail!' });
        }
        if (err) {
            return res.status(500).json({ type: 'error', message: 'Internal server error!' });
        }
        if (!user) {
            return res.status(404).json({ type: 'error', message: 'User Not Found!' });
        }
        req.logIn(user, (loginErr) => {
            try {
                if (loginErr) {
                    throw new Error('Invalid login credential');
                }
                const { _id, name, email, role, isActive } = user;
                if (role == 'user' && isActive == true) {
                    return successCommonWithData(
                        res,
                        200,
                        { _id, name, email, role },
                        'Login successfully'
                    );
                } else {
                    return res.status(404).json({ type: 'error', message: 'User Not Found!' });
                }
            } catch (error) {
                next(error);
            }
        });
    })(req, res, next);
});

export default router;
