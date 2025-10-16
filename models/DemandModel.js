import { getConnection } from '../config/database.js';
import Product from './ProductModel.js';

class Demand {
  constructor(data) {
    this.id = data.id;
    this.date = data.date;
    this.rno = data.rno;
    this.distributorId = data.distributor_id;
    this.productId = data.product_id;
    this.qty = data.qty;
    this.rate = data.rate;
    this.amount = data.amount;
    this.gstPercent = data.gst_percent;
    this.gstAmt = data.gst_amt;
    this.total = data.total;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Create demand entries (product-wise)
  static async createDemand(distributorId, date, rno, products) {
    const connection = await getConnection();
    const insertIds = [];
    const currentDate = date || new Date();

    try {
      await connection.beginTransaction();

      for (const productData of products) {
        const { productId, qty } = productData;
        if (!productId || !qty || qty <= 0) {
          throw new Error(`Invalid product data: productId and positive qty required`);
        }

        // Fetch product to validate and get rate/gst
        const product = await Product.findById(productId);
        if (!product) {
          throw new Error(`Product not found with ID: ${productId}`);
        }

        const rate = productData.rate !== undefined ? productData.rate : product.rate;
        const gstPercent = productData.gstPercent !== undefined ? productData.gstPercent : product.gst;

        if (rate <= 0) {
          throw new Error(`Rate must be positive for product ID: ${productId}`);
        }
        if (gstPercent < 0 || gstPercent > 100) {
          throw new Error(`GST percent must be between 0 and 100 for product ID: ${productId}`);
        }

        const amount = qty * rate;
        const gstAmt = amount * (gstPercent / 100);
        const total = amount + gstAmt;

        const query = `
          INSERT INTO demand_dispatch (date, rno, distributor_id, product_id, qty, rate, amount, gst_percent, gst_amt, total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
          currentDate,
          rno,
          distributorId,
          productId,
          qty,
          rate,
          amount,
          gstPercent,
          gstAmt,
          total
        ];

        const [result] = await connection.execute(query, values);
        insertIds.push(result.insertId);
      }

      await connection.commit();
      return insertIds;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Get all demands (optional, for future use)
  static async findAll() {
    const connection = await getConnection();
    const query = 'SELECT * FROM demand_dispatch ORDER BY date DESC, id DESC';
    const [rows] = await connection.execute(query);
    connection.release();
    return rows.map(row => new Demand(row));
  }

  // Find demand by ID (optional)
  static async findById(id) {
    const connection = await getConnection();
    const query = 'SELECT * FROM demand_dispatch WHERE id = ?';
    const [rows] = await connection.execute(query, [id]);
    connection.release();
    return rows.length > 0 ? new Demand(rows[0]) : null;
  }

  // Update dispatch details for a demand entry
  static async updateDispatch(id, dispatchData) {
    const connection = await getConnection();
    const { dispatch_qty, dispatch_date, dispatch_no, gate_pass_no, vehicle_no } = dispatchData;

    const fields = [];
    const values = [];

    if (dispatch_qty !== undefined) {
      fields.push('dispatch_qty = ?');
      values.push(dispatch_qty);
    }
    if (dispatch_date) {
      fields.push('dispatch_date = ?');
      values.push(dispatch_date);
    }
    if (dispatch_no) {
      fields.push('dispatch_no = ?');
      values.push(dispatch_no);
    }
    if (gate_pass_no) {
      fields.push('gate_pass_no = ?');
      values.push(gate_pass_no);
    }
    if (vehicle_no) {
      fields.push('vehicle_no = ?');
      values.push(vehicle_no);
    }

    if (fields.length === 0) {
      throw new Error('No dispatch fields provided for update');
    }

    fields.push('status = ?');
    values.push('dispatched');
    values.push(id);

    const query = `UPDATE demand_dispatch SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await connection.execute(query, values);
    connection.release();

    if (result.affectedRows === 0) {
      throw new Error('Demand not found or no changes made');
    }

    return result;
  }
}

export default Demand;
