import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/userModel';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create(username, email, hashedPassword);

    res.status(201).json({
      message: 'Registrasi berhasil!',
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Username atau Email sudah terdaftar!' });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error server.' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findByUsername(username);
    if (!user) {
      res.status(401).json({ message: 'Username atau password salah!' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Username atau password salah!' });
      return;
    }

    const secretKey = process.env.JWT_SECRET || 'pwf_2026';
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '2h' });

    res.status(200).json({
      message: 'Login berhasil!',
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error server.' });
  }
};
