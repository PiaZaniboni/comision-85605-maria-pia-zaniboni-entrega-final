import { Cart } from '../models/Cart.model.js';

export class CartDAO {
  
  async create() {
    return await Cart.create({ products: [] });
  }

  async findById(id) {
        const cart = await Cart.findById(id);
        if (!cart) return null;
        
        if (cart. products && cart.products.length > 0) {
            await cart.populate('products.product');
        }
        
        return cart.toObject();
 }

  async update(id, updateData) {
    return await Cart.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('products.product').lean();
  }

  async delete(id) {
    return await Cart.findByIdAndDelete(id).lean();
  }

  async addProduct(cartId, productId, quantity) {
    const cart = await Cart.findById(cartId);
    
    if (!cart) return null;

    const existingProduct = cart.products.find(
      p => p.product.toString() === productId.toString()
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      // Agregar nuevo producto
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    return await Cart.findById(cartId).populate('products.product').lean();
  }

  async removeProduct(cartId, productId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { product: productId } } },
      { new: true }
    ).populate('products.product').lean();
  }

  async updateProductQuantity(cartId, productId, quantity) {
    return await Cart.findOneAndUpdate(
      { _id: cartId, 'products.product': productId },
      { $set: { 'products.$.quantity': quantity } },
      { new: true }
    ).populate('products.product').lean();
  }

  async clearCart(cartId) {
    return await Cart.findByIdAndUpdate(
      cartId,
      { products: [] },
      { new:  true }
    ).lean();
  }
}