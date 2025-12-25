import { ProductDAO } from '../dao/product.dao.js';

export class ProductRepository {
  constructor() {
    this.productDAO = new ProductDAO();
  }

  async create(productData) {
    const exists = await this.productDAO.findByCode(productData.code);
    if (exists) {
      const error = new Error('Product code already exists');
      error.code = 'CODE_EXISTS';
      throw error;
    }

    return await this.productDAO.create(productData);
  }

  async findById(id) {
    const product = await this.productDAO. findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    return product;
  }

  async findByCode(code) {
    return await this.productDAO.findByCode(code);
  }

  async findAll(filter = {}, options = {}) {
    return await this.productDAO.findAll(filter, options);
  }

  async update(id, updateData) {
    if (updateData.code) {
      const existing = await this.productDAO.findByCode(updateData.code);
      if (existing && existing._id.toString() !== id.toString()) {
        const error = new Error('Product code already exists');
        error.code = 'CODE_EXISTS';
        throw error;
      }
    }

    const updated = await this.productDAO.update(id, updateData);
    if (!updated) {
      const error = new Error('Product not found');
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    return updated;
  }

  async delete(id) {
    const deleted = await this.productDAO.delete(id);
    if (!deleted) {
      const error = new Error('Product not found');
      error.code = 'PRODUCT_NOT_FOUND';
      throw error;
    }
    return deleted;
  }

  async decrementStock(id, quantity) {
    const product = await this.findById(id);
    
    if (product.stock < quantity) {
      const error = new Error('Insufficient stock');
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    return await this.productDAO.decrementStock(id, quantity);
  }

  async incrementStock(id, quantity) {
    return await this.productDAO.incrementStock(id, quantity);
  }
}