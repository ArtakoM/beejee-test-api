import { Router } from 'express';
import user from './user';
import task from './task';

const router = Router();
router.use('/user', user);
router.use('/task', task);

export default router;
