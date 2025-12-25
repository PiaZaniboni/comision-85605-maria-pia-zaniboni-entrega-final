import { Ticket } from '../models/Ticket.model.js';
export class TicketDAO {
  
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }

  async findById(id) {
    return await Ticket.findById(id).populate('products.product').lean();
  }

  async findByPurchaser(email) {
    return await Ticket.find({ purchaser: email.toLowerCase() })
      .populate('products.product')
      .sort({ purchase_datetime: -1 })
      .lean();
  }

  async findAll(filter = {}, options = {}) {
    const { limit = 10, page = 1 } = options;
    const skip = (page - 1) * limit;

    const tickets = await Ticket.find(filter)
      .populate('products.product')
      .sort({ purchase_datetime: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Ticket.countDocuments(filter);

    return {
      tickets,
      total,
      page,
      totalPages: Math.ceil(total/limit)
    };
  }
}