import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/db';

export interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
}

export const UserModel = {
  findByUsername: async (username: string): Promise<UserRow | null> => {
    const [rows] = await pool.execute<UserRow[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  create: async (username: string, email: string, hashedPassword: string): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    return result.insertId;
  },
};

export default UserModel;
