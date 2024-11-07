import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import userRoutes from './user.routes.js';
import { selectLogin } from '../controller/auth.controller.js';
import { successCommon } from '../utils/success.utils.js';
const router = Router();

/* Main route */
router.get('/', selectLogin);

/* Admin router */
router.use('/admin', adminRoutes);

/* User router */
router.use('/user', userRoutes);

/* logout API */
router.post('/logout', (req, res, next) => {
    try {
        req.logout((err) => {
            if (err) {
                next(err);
            }
            return successCommon(res, 200, 'Logout successfully');
        });
    } catch (error) {
        next(error);
    }
});

export default router;
