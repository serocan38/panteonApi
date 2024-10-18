import { Router, Request, Response } from 'express';

const router = Router();

router.get('/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    res.json({ message: `User with id: ${id}` });
});

router.post('/', (req: Request, res: Response) => {
    const { name, age } = req.body;
    res.json({ message: `User created: ${name}, age: ${age}` });
});

export default router;
