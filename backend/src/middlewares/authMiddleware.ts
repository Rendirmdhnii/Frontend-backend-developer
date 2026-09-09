import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan!' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan!' });
    return;
  }

  const secretKey = process.env.JWT_SECRET || 'pwf_2026';

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload & { id?: number; userId?: number };
    const userId = decoded.id ?? decoded.userId;

    if (!userId) {
      res.status(403).json({ message: 'Sesi tidak valid atau kedaluwarsa!' });
      return;
    }

    res.locals.userId = userId;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Sesi tidak valid atau kedaluwarsa!' });
    return;
  }
};
