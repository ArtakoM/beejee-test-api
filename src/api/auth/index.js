import { Router } from 'express';
import { login } from './auth';
import { signUp } from './signUp';

const router = Router();

router.post('/login', login);
router.post('/sign-up', signUp);

export default router;
