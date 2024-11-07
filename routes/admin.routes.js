import { Router } from 'express';
import passport from 'passport';
import { successCommonWithData } from '../utils/success.utils.js';
import { adminLogin, adminDashboard, addAdminUser, registerAdmin } from '../controller/admin.controller.js';
import { isEmailValid } from '../middleware/validator.js';
import { uploadFileAndJson }  from '../middleware/validFormData.js';
import { commonError } from '../utils/commonError.js';
const router = Router();

/* admin routes */

router.get('/', (req, res, next) => {
    try {
        return res.redirect('/admin/dashboard');
    } catch (error) {
        next(error);
    }
});

router.get('/login', adminLogin);

router.get('/dashboard', adminDashboard);

router.post('/add', uploadFileAndJson, isEmailValid, addAdminUser);

router.get('/register', registerAdmin);

router.post('/login', isEmailValid, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(404)
                .json({ type: 'error', message: 'Invalid form detail!' });
        }
        if (err) {
            return res
                .status(500)
                .json({ type: 'error', message: 'Internal server error' });
        }
        if (!user) {
            return res
                .status(404)
                .json({ type: 'error', message: 'User not Found!!' });
        }
        req.logIn(user, (loginErr) => {
            try {
                if (loginErr) {
                    throw new Error('Invalid login credential');
                }
                const { name, email, role } = user;
                if (role == 'admin') {
                    return successCommonWithData(
                        res,
                        200,
                        { name, email, role },
                        'Login successfully'
                    );
                } else {
                    return commonError(res, 404, 'Invalid login credential!!')
                }
            } catch (error) {
                next(error);
            }
        });
    })(req, res, next);
});

export default router;
