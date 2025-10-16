import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database.js';

class User {
  constructor(data) {
    this.id = data.id;
    this.partyCode = data.partyCode;
    this.name = data.name;
    this.mobile = data.mobile;
    this.route = data.route;
    this.openingBalance = data.openingBalance;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.createdBy = data.createdBy;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create user
  static async create(userData) {
    const connection = getConnection();

    // Hash password before saving
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const query = `
      INSERT INTO users (partyCode, name, mobile, route, openingBalance, email, password, role, createdBy, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      userData.partyCode || null,
      userData.name,
      userData.mobile || null,
      userData.route || null,
      userData.openingBalance || 0,
      userData.email,
      hashedPassword,
      userData.role || 'Distributor',
      userData.createdBy || null,
      userData.isActive !== undefined ? userData.isActive : true
    ];

    const [result] = await connection.execute(query, values);
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = getConnection();
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await connection.execute(query, [email]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find user by ID
  static async findById(id) {
    const connection = getConnection();
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Get all users
  static async findAll() {
    const connection = getConnection();
    const query = 'SELECT * FROM users ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query);
    return rows.map(row => new User(row));
  }

  // Get all distributors
  static async findDistributors() {
    const connection = getConnection();
    const query = "SELECT * FROM users WHERE role = 'Distributor' ORDER BY createdAt DESC";
    const [rows] = await connection.execute(query);
    return rows.map(row => new User(row));
  }

  // Update user
  static async update(id, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];

    if (updateData.partyCode !== undefined) {
      fields.push('partyCode = ?');
      values.push(updateData.partyCode);
    }
    if (updateData.name) {
      fields.push('name = ?');
      values.push(updateData.name);
    }
    if (updateData.mobile) {
      fields.push('mobile = ?');
      values.push(updateData.mobile);
    }
    if (updateData.route) {
      fields.push('route = ?');
      values.push(updateData.route);
    }
    if (updateData.openingBalance !== undefined) {
      fields.push('openingBalance = ?');
      values.push(updateData.openingBalance);
    }
    if (updateData.email) {
      fields.push('email = ?');
      values.push(updateData.email);
    }
    if (updateData.password) {
      // Hash new password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(updateData.password, salt);
      fields.push('password = ?');
      values.push(hashedPassword);
    }
    if (updateData.role) {
      fields.push('role = ?');
      values.push(updateData.role);
    }
    if (updateData.createdBy !== undefined) {
      fields.push('createdBy = ?');
      values.push(updateData.createdBy);
    }
    if (updateData.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updateData.isActive);
    }

    if (fields.length === 0) return;

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await connection.execute(query, values);
  }

  // Delete user
  static async delete(id) {
    const connection = getConnection();
    const query = 'DELETE FROM users WHERE id = ?';
    await connection.execute(query, [id]);
  }

  // Compare entered password with hashed password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateAuthToken() {
    const token = jwt.sign(
      {
        id: this.id,
        email: this.email,
        role: this.role
      },
      process.env.JWT_SECRET || 'fallback_secret',
      {
        expiresIn: '7d'
      }
    );
    return token;
  }

  // Get user object without sensitive information
  toSafeObject() {
    const user = { ...this };
    delete user.password;
    return user;
  }
}

export default User;
