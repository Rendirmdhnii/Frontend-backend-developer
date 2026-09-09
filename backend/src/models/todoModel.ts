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

  create: async (userId: number, task: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO todos (user_id, task) VALUES (?, ?)',
      [userId, task]
    );
    return result.insertId;
  },
};

export default TodoModel;
