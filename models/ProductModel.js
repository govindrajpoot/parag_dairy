import { getConnection } from '../config/database.js';

class Product {
  constructor(data) {
    this.id = data.id;
    this.productCode = data.productCode;
    this.productName = data.productName;
    this.rate = data.rate;
    this.gst = data.gst;
    this.unit = data.unit;
    this.crate = data.crate;
    this.isActive = data.isActive;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create product
  static async create(productData) {
    const connection = getConnection();

    const query = `
      INSERT INTO products (productCode, productName, rate, gst, unit, crate, isActive)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      productData.productCode,
      productData.productName,
      productData.rate,
      productData.gst,
      productData.unit,
      productData.crate,
      productData.isActive !== undefined ? productData.isActive : true
    ];

    const [result] = await connection.execute(query, values);
    return result.insertId;
  }

  // Find product by productCode
  static async findByProductCode(productCode) {
    const connection = getConnection();
    const query = 'SELECT * FROM products WHERE productCode = ?';
    const [rows] = await connection.execute(query, [productCode]);
    return rows.length > 0 ? new Product(rows[0]) : null;
  }

  // Find product by ID
  static async findById(id) {
    const connection = getConnection();
    const query = 'SELECT * FROM products WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    return rows.length > 0 ? new Product(rows[0]) : null;
  }

  // Get all products
  static async findAll() {
    const connection = getConnection();
    const query = 'SELECT * FROM products ORDER BY createdAt DESC';
    const [rows] = await connection.execute(query);
    return rows.map(row => new Product(row));
  }

  // Update product
  static async update(id, updateData) {
    const connection = getConnection();
    const fields = [];
    const values = [];

    if (updateData.productCode) {
      fields.push('productCode = ?');
      values.push(updateData.productCode);
    }
    if (updateData.productName) {
      fields.push('productName = ?');
      values.push(updateData.productName);
    }
    if (updateData.rate !== undefined) {
      fields.push('rate = ?');
      values.push(updateData.rate);
    }
    if (updateData.gst !== undefined) {
      fields.push('gst = ?');
      values.push(updateData.gst);
    }
    if (updateData.unit) {
      fields.push('unit = ?');
      values.push(updateData.unit);
    }
    if (updateData.crate !== undefined) {
      fields.push('crate = ?');
      values.push(updateData.crate);
    }
    if (updateData.isActive !== undefined) {
      fields.push('isActive = ?');
      values.push(updateData.isActive);
    }

    if (fields.length === 0) return;

    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    await connection.execute(query, values);
  }

  // Delete product
  static async delete(id) {
    const connection = getConnection();
    const query = 'DELETE FROM products WHERE id = ?';
    await connection.execute(query, [id]);
  }
}

export default Product;
