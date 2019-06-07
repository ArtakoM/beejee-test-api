import { Router } from 'express';
import { fetchProfile } from './user';

const router = Router();

router.get('/me', fetchProfile);

export default router;
