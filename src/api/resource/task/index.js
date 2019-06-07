import { Router } from 'express';
import { list, create, edit, fetchOne } from './task';

const router = Router();

router.get('/', list);
router.get('/:id', fetchOne);
router.post('/create', create);
router.post('/edit/:id', edit);

export default router;
