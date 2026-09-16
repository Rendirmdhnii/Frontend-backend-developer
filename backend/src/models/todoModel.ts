import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';

export interface TodoRow extends RowDataPacket {
  id: number;
  task: string;
  user_id: number;
  is_completed: boolean;
}

export const TodoModel = {
  getByUserId: async (userId: number): Promise<TodoRow[]> => {
    const [rows] = await pool.execute<TodoRow[]>(
      'SELECT * FROM todos WHERE user_id = ?',
      [userId]
    );
    return rows;
  },

  getById: async (id: number, userId: number) => {
    const [rows]: any = await pool.query(
      'SELECT * FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0]; // Kembalikan 1 data, atau undefined jika tidak ditemukan
  },

  create: async (userId: number, task: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO todos (user_id, task) VALUES (?, ?)',
      [userId, task]
    );
    return result.insertId;
  },

  // Update task atau status is_completed
  update: async (id: number, task: string, isCompleted: boolean, userId: number) => {
    const [result]: any = await pool.query(
      'UPDATE todos SET task = ?, is_completed = ? WHERE id = ? AND user_id = ?',
      [task, isCompleted, id, userId]
    );
    return result.affectedRows;
  },

  // Hapus todo berdasarkan id dan userId
  delete: async (id: number, userId: number) => {
    const [result]: any = await pool.query(
      'DELETE FROM todos WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows;
  },
};

export default TodoModel;
