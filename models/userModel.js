import { getConnection } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  // Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateAuthToken() {
    return jwt.sign(
      { id: this.id, email: this.email, role: this.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
  }

  // Get user without password
  toSafeObject() {
    const user = { ...this };
    delete user.password;
    return user;
  }

  // Create user
  static async create(userData) {
    const connection = await getConnection();
    const hashedPassword = await this.hashPassword(userData.password);

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
      userData.role || 'Sub-Admin',
      userData.createdBy || null,
      userData.isActive !== undefined ? userData.isActive : true
    ];

    const [result] = await connection.execute(query, values);
    connection.release();
    return result.insertId;
  }

  // Find user by email
  static async findByEmail(email) {
    const connection = await getConnection();
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await connection.execute(query, [email]);
    connection.release();
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find user by ID
  static async findById(id) {
    const connection = await getConnection();
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    connection.release();
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Get all users
  static async findAll() {
    const connection = await getConnection();
    const query = 'SELECT * FROM users ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query);
    connection.release();
    return rows.map(row => new User(row));
  }

  // Get distributors
  static async findDistributors() {
    const connection = await getConnection();
    const query = 'SELECT * FROM users WHERE role = ? ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query, ['Distributor']);
    connection.release();
    return rows.map(row => new User(row));
  }

  // Update user
  static async update(id, updateData) {
    const connection = await getConnection();
    const fields = [];
    const values = [];

    if (updateData.name) {
      fields.push('name = ?');
      values.push(updateData.name);
    }
    if (updateData.mobile !== undefined) {
      fields.push('mobile = ?');
      values.push(updateData.mobile);
    }
    if (updateData.route !== undefined) {
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
    if (updateData.role) {
      fields.push('role = ?');
      values.push(updateData.role);
    }
    if (updateData.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updateData.isActive);
    }

    if (fields.length === 0) {
      connection.release();
      return;
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await connection.execute(query, values);
    connection.release();
  }

  // Delete user
  static async delete(id) {
    const connection = await getConnection();
    const query = 'DELETE FROM users WHERE id = ?';
    await connection.execute(query, [id]);
    connection.release();
  }

  // Find one user with conditions
  static async findOne(conditions) {
    const connection = await getConnection();
    let query = 'SELECT * FROM users WHERE ';
    const values = [];
    const conditionsArray = [];

    if (conditions._id) {
      conditionsArray.push('id = ?');
      values.push(conditions._id);
    }
    if (conditions.role) {
      conditionsArray.push('role = ?');
      values.push(conditions.role);
    }
    if (conditions.email) {
      conditionsArray.push('email = ?');
      values.push(conditions.email);
    }

    query += conditionsArray.join(' AND ');

    const [rows] = await connection.execute(query, values);
    connection.release();
    return rows.length > 0 ? new User(rows[0]) : null;
  }

  // Find one and update
  static async findOneAndUpdate(conditions, updateData, options = {}) {
    const connection = await getConnection();

    // First find the user
    const existingUser = await this.findOne(conditions);
    if (!existingUser) {
      connection.release();
      return null;
    }

    // Update the user
    await this.update(existingUser.id, updateData);

    // Return updated user if new: true
    if (options.new) {
      const updatedUser = await this.findById(existingUser.id);
      connection.release();
      return updatedUser;
    }

    connection.release();
    return existingUser;
  }

  // Find one and delete
  static async findOneAndDelete(conditions) {
    const connection = await getConnection();

    // First find the user
    const user = await this.findOne(conditions);
    if (!user) {
      connection.release();
      return null;
    }

    // Delete the user
    await this.delete(user.id);
    connection.release();
    return user;
  }
}

export default User;
