import { getConnection } from '../config/database.js';

class ProductPrice {
  constructor(data) {
    this.id = data.id;
    this.productId = data.productId;
    this.distributorId = data.distributorId;
    this.price = data.price;
    this.unit = data.unit;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create product price
  static async create(priceData) {
    const connection = await getConnection();

    const query = `
      INSERT INTO productprices (productId, distributorId, price, unit, isActive)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [
      priceData.productId,
      priceData.distributorId,
      priceData.price,
      priceData.unit || 'unit',
      priceData.isActive !== undefined ? priceData.isActive : true
    ];

    const [result] = await connection.execute(query, values);
    connection.release();
    return result.insertId;
  }

  // Find by distributor and product
  static async findByDistributorAndProduct(distributorId, productId) {
    const connection = await getConnection();
    const query = 'SELECT * FROM productprices WHERE distributorId = ? AND productId = ?';
    const [rows] = await connection.execute(query, [distributorId, productId]);
    connection.release();
    return rows.length > 0 ? new ProductPrice(rows[0]) : null;
  }

  // Find by distributor
  static async findByDistributorId(distributorId) {
    const connection = await getConnection();
    const query = 'SELECT * FROM productprices WHERE distributorId = ? ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query, [distributorId]);
    connection.release();
    return rows.map(row => new ProductPrice(row));
  }

  // Find by ID
  static async findById(id) {
    const connection = await getConnection();
    const query = 'SELECT * FROM productprices WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    connection.release();
    return rows.length > 0 ? new ProductPrice(rows[0]) : null;
  }

  // Get all product prices
  static async findAll() {
    const connection = await getConnection();
    const query = 'SELECT * FROM productprices ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query);
    connection.release();
    return rows.map(row => new ProductPrice(row));
  }

  // Update product price
  static async update(id, updateData) {
    const connection = await getConnection();
    const fields = [];
    const values = [];

    if (updateData.price !== undefined) {
      fields.push('price = ?');
      values.push(updateData.price);
    }
    if (updateData.unit) {
      fields.push('unit = ?');
      values.push(updateData.unit);
    }
    if (updateData.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updateData.isActive);
    }

    if (fields.length === 0) {
      connection.release();
      return;
    }

    const query = `UPDATE productprices SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await connection.execute(query, values);
    connection.release();
  }

  // Delete product price
  static async delete(id) {
    const connection = await getConnection();
    const query = 'DELETE FROM productprices WHERE id = ?';
    await connection.execute(query, [id]);
    connection.release();
  }
}

export default ProductPrice;
