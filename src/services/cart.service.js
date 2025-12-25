import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';

export class CartService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
  }

  async createCart() {
    return await this.cartRepository.create();
  }

  async getCartById(id) {
    return await this.cartRepository.findById(id);
  }

  async addProductToCart(cartId, productId, quantity = 1) {

    const product = await this.productRepository.findById(productId);

    if (!product. status) {
      const error = new Error('Product is not available');
      error.code = 'PRODUCT_UNAVAILABLE';
      throw error;
    }

    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} units available`);
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    return await this.cartRepository.addProduct(cartId, productId, quantity);
  }

  async removeProductFromCart(cartId, productId) {
    return await this.cartRepository.removeProduct(cartId, productId);
  }

  async updateProductQuantity(cartId, productId, quantity) {

    const product = await this.productRepository.findById(productId);

    if (product.stock < quantity) {
      const error = new Error(`Only ${product.stock} units available`);
      error.code = 'INSUFFICIENT_STOCK';
      throw error;
    }

    return await this.cartRepository.updateProductQuantity(cartId, productId, quantity);
  }

  async clearCart(cartId) {
    return await this.cartRepository.clearCart(cartId);
  }

  async deleteCart(id) {
    return await this.cartRepository.delete(id);
  }
}