import { TicketDAO } from '../dao/ticket.dao.js';

export class TicketRepository {
  constructor() {
    this.ticketDAO = new TicketDAO();
  }

  async create(ticketData) {
    return await this.ticketDAO.create(ticketData);
  }

  async findById(id) {
    const ticket = await this.ticketDAO.findById(id);
    if (!ticket) {
      const error = new Error('Ticket not found');
      error.code = 'TICKET_NOT_FOUND';
      throw error;
    }
    return ticket;
  }

  async findByPurchaser(email) {
    return await this.ticketDAO.findByPurchaser(email);
  }

  async findAll(filter = {}, options = {}) {
    return await this.ticketDAO.findAll(filter, options);
  }
}