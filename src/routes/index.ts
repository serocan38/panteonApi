import { Router } from 'express';
import panteonRoutes from './panteonRoutes';

const router = Router();

router.use('/panteon', panteonRoutes);

export default router;