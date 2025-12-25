import { CartDAO } from '../dao/cart.dao.js';

export class CartRepository {
  constructor() {
    this.cartDAO = new CartDAO();
  }

  async create() {
    return await this.cartDAO.create();
  }

  async findById(id) {
    const cart = await this.cartDAO. findById(id);
    if (!cart) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async update(id, updateData) {
    const cart = await this.cartDAO.update(id, updateData);
    if (!cart) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async addProduct(cartId, productId, quantity) {
    const cart = await this.cartDAO.addProduct(cartId, productId, quantity);
    if (!cart) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async removeProduct(cartId, productId) {
    const cart = await this.cartDAO.removeProduct(cartId, productId);
    if (!cart) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async updateProductQuantity(cartId, productId, quantity) {
    if (quantity < 1) {
      const error = new Error('Quantity must be at least 1');
      error.code = 'INVALID_QUANTITY';
      throw error;
    }

    const cart = await this.cartDAO.updateProductQuantity(cartId, productId, quantity);
    if (!cart) {
      const error = new Error('Cart or product not found');
      error.code = 'NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async clearCart(cartId) {
    const cart = await this.cartDAO.clearCart(cartId);
    if (!cart) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return cart;
  }

  async delete(id) {
    const deleted = await this.cartDAO.delete(id);
    if (!deleted) {
      const error = new Error('Cart not found');
      error.code = 'CART_NOT_FOUND';
      throw error;
    }
    return deleted;
  }
}