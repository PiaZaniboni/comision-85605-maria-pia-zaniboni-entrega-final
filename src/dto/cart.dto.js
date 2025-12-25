export class CartDTO {
  
  static fromModel(cart) {
    return {
      id: cart._id || cart.id,
      products: cart.products. map(item => ({
        product: {
          id: item.product._id || item.product.id,
          title: item.product. title,
          code: item.product.code,
          price: item.product.price,
          stock: item.product.stock
        },
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      })),
      total: cart.products.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    };
  }
}