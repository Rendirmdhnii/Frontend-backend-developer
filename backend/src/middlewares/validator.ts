import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: 'Username, email, dan password wajib diisi!' });
    return;
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ message: 'Format email tidak valid!' });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Username dan password wajib diisi!' });
    return;
  }

  next();
};

export const validateTodo = (req: Request, res: Response, next: NextFunction): void => {
  const { task } = req.body;

  if (!task || typeof task !== 'string') {
    res.status(400).json({ message: 'Task wajib diisi dengan format string!' });
    return;
  }

  next();
};
