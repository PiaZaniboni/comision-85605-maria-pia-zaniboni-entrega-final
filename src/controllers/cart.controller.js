import { CartService } from '../services/cart.service.js';
import { CartDTO } from '../dto/cart.dto.js';

export class CartController {
  constructor() {
    this.cartService = new CartService();
  }

  // POST /api/carts - Crear carrito
  create = async (req, res, next) => {
    try {
      const cart = await this.cartService.createCart();
      res.status(201).json({ 
        ok: true, 
        cartId: cart._id 
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/carts/:cid - Obtener carrito por ID
  getById = async (req, res, next) => {
    try {
      const cart = await this.cartService.getCartById(req.params.cid);
      res.json(CartDTO.fromModel(cart));
    } catch (err) {
      if (err.code === 'CART_NOT_FOUND') {
        return res. status(404).json({ error: 'Cart not found' });
      }
      next(err);
    }
  }

  // POST /api/carts/:cid/products/:pid - Agregar producto al carrito
  addProduct = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity = 1 } = req.body;

      if (quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1' });
      }

      const cart = await this. cartService.addProductToCart(cid, pid, quantity);
      res.json(CartDTO. fromModel(cart));

    } catch (err) {
      if (err.code === 'CART_NOT_FOUND') {
        return res.status(404).json({ error: 'Cart not found' });
      }
      if (err.code === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Product not found' });
      }
      if (err.code === 'INSUFFICIENT_STOCK') {
        return res.status(400).json({ error: err.message });
      }
      if (err.code === 'PRODUCT_UNAVAILABLE') {
        return res.status(400).json({ error: 'Product is not available' });
      }
      next(err);
    }
  }

  // DELETE /api/carts/:cid/products/:pid - Eliminar producto del carrito
  removeProduct = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const cart = await this.cartService.removeProductFromCart(cid, pid);
      res.json(CartDTO.fromModel(cart));
    } catch (err) {
      if (err.code === 'CART_NOT_FOUND') {
        return res.status(404).json({ error: 'Cart not found' });
      }
      next(err);
    }
  }

  // PUT /api/carts/:cid/products/:pid - Actualizar cantidad
  updateProductQuantity = async (req, res, next) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req. body;

      if (! quantity || quantity < 1) {
        return res.status(400).json({ error: 'Quantity must be at least 1' });
      }

      const cart = await this.cartService.updateProductQuantity(cid, pid, quantity);
      res.json(CartDTO.fromModel(cart));

    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        return res.status(404).json({ error: 'Cart or product not found' });
      }
      if (err.code === 'INSUFFICIENT_STOCK') {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }

  // DELETE /api/carts/:cid - Vaciar carrito
  clearCart = async (req, res, next) => {
    try {
      const cart = await this.cartService.clearCart(req.params.cid);
      res.json(CartDTO.fromModel(cart));
    } catch (err) {
      if (err.code === 'CART_NOT_FOUND') {
        return res.status(404).json({ error: 'Cart not found' });
      }
      next(err);
    }
  }
}