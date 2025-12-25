import { Product } from '../models/Product.model.js';

export class ProductDAO {
  
  async create(productData) {
    return await Product.create(productData);
  }

  async findById(id) {
    return await Product.findById(id).lean();
  }

  async findByCode(code) {
    return await Product.findOne({ code:  code. toUpperCase() }).lean();
  }

  async findAll(filter = {}, options = {}) {
    const { limit = 10, page = 1, sort } = options;
    const skip = (page - 1) * limit;

    let query = Product.find(filter);

    if (sort) {
      query = query.sort(sort);
    }

    const products = await query.skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(filter);

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async update(id, updateData) {
    return await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).lean();
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id).lean();
  }

  async decrementStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true }
    ).lean();
  }

  async incrementStock(id, quantity) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true }
    ).lean();
  }
}