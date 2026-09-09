import { Request, Response } from 'express';
import { TodoModel } from '../models/todoModel';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = res.locals.userId as number;
    const todos = await TodoModel.getByUserId(userId);

    res.status(200).json({
      success: true,
      data: todos,
    });
  } catch (error: any) {
    console.error('getTodos error:', error);
    res.status(500).json({ message: 'Gagal mengambil data.' });
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { task } = req.body;
    const userId = res.locals.userId as number;

    const newId = await TodoModel.create(userId, task);

    res.status(201).json({
      message: 'Tugas berhasil ditambahkan!',
      data: {
        id: newId,
        task,
        is_completed: false,
      },
    });
  } catch (error: any) {
    console.error('createTodo error:', error);
    res.status(500).json({ message: 'Gagal menambahkan tugas.' });
  }
};
