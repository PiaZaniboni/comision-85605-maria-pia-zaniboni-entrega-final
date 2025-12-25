export class TicketDTO {
  
  static fromModel(ticket) {
    return {
      id: ticket._id || ticket.id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      products: ticket. products.map(item => ({
        product: {
          id:  item.product._id || item. product.id,
          title: item.product.title,
          code: item.product.code
        },
        quantity: item. quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))
    };
  }

  static forList(ticket) {
    return {
      id: ticket._id || ticket.id,
      code: ticket.code,
      purchase_datetime: ticket.purchase_datetime,
      amount: ticket.amount,
      purchaser: ticket.purchaser
    };
  }

  static forEmail(ticket) {
    return {
      code: ticket.code,
      purchase_datetime: new Date(ticket.purchase_datetime).toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      amount: ticket. amount,
      purchaser: ticket.purchaser,
      products: ticket.products.map(item => ({
        title: item.product.title,
        code: item.product.code,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      }))
    };
  }
  
}