import { CartRepository } from '../repositories/cart.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { TicketRepository } from '../repositories/ticket.repository.js';
import { EmailService } from './email.service.js';

export class PurchaseService {
  constructor() {
    this.cartRepository = new CartRepository();
    this.productRepository = new ProductRepository();
    this.ticketRepository = new TicketRepository();
    this.emailService = new EmailService();
  }

  /**
   * Procesar la compra de un carrito
   */
  async purchaseCart(cartId, purchaserEmail) {
    //Obtener el carrito
    const cart = await this.cartRepository.findById(cartId);

    if (!cart. products || cart.products.length === 0) {
      const error = new Error('Cart is empty');
      error.code = 'CART_EMPTY';
      throw error;
    }

    //Separar productos con stock suficiente vs insuficiente
    const productsWithStock = [];
    const productsWithoutStock = [];
    let totalAmount = 0;

    for (const item of cart.products) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      //Verificar stock actual
      const currentProduct = await this.productRepository.findById(product._id || product.id);

      if (currentProduct.stock >= requestedQuantity) {
        // HAY STOCK:  agregar al ticket
        productsWithStock.push({
          product:  product._id || product.id,
          quantity: requestedQuantity,
          price: product.price
        });
        totalAmount += product.price * requestedQuantity;

        //Descontar stock
        await this.productRepository.decrementStock(
          product._id || product.id, 
          requestedQuantity
        );
      } else {
        // NO HAY STOCK:  dejar en el carrito
        productsWithoutStock.push({
          product: product._id || product.id,
          title: product.title,                    
          code: product.code,                      
          quantity: requestedQuantity,
          availableStock: currentProduct.stock     
        });
      }
    }

    //Si no habia productos con stock, no generar ticket
    if (productsWithStock.length === 0) {
      const error = new Error('No products with sufficient stock');
      error.code = 'NO_STOCK';
      error.failedProducts = productsWithoutStock;
      throw error;
    }

    const ticketCode = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    //Crear el ticket
    const ticket = await this.ticketRepository.create({
      code: ticketCode,
      amount: totalAmount,
      purchaser: purchaserEmail.toLowerCase(),
      products: productsWithStock
    });

    const ticketWithProducts = await this.ticketRepository. findById(ticket._id || ticket.id);

    //Actualizar el carrito (solo dejar productos sin stock)
    if (productsWithoutStock.length > 0) {
      await this.cartRepository.update(cartId, { products: productsWithoutStock });
    } else {
      // Si todos los productos tenian stock, vaciar el carrito
      await this.cartRepository.clearCart(cartId);
    }

    //Enviar email de confirmación
    try {
      await this.emailService.sendPurchaseConfirmation(purchaserEmail, ticketWithProducts);
    } catch (emailError) {
      console.error('❌ Error enviando email de confirmación:', emailError);
      // No fallar la compra si el email falla
    }

    //Retornar resultado
    return {
      ticket:  ticketWithProducts,
      failedProducts: productsWithoutStock
    };
  }
}