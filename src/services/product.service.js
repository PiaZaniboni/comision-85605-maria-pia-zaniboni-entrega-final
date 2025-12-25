import { ProductRepository } from '../repositories/product.repository.js';

export class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  async createProduct(productData) {
    if (productData.code) {
      productData.code = productData.code.toUpperCase().trim();
    }

    return await this.productRepository.create(productData);
  }

  async getProductById(id) {
    return await this.productRepository.findById(id);
  }

  async getProductByCode(code) {
    return await this.productRepository.findByCode(code);
  }

  async getAllProducts(filter = {}, options = {}) {
    return await this.productRepository.findAll(filter, options);
  }

  async updateProduct(id, updateData) {
    //No permitir actualizar stock aca, se maneja en la logica de compra
    const { stock, ...safeData } = updateData;

    return await this.productRepository.update(id, safeData);
  }

  async deleteProduct(id) {
    return await this. productRepository.delete(id);
  }
}