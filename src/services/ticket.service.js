import { TicketRepository } from '../repositories/ticket.repository.js';

export class TicketService {
  constructor() {
    this.ticketRepository = new TicketRepository();
  }

  async createTicket(ticketData) {
    return await this.ticketRepository.create(ticketData);
  }

  async getTicketById(id) {
    return await this.ticketRepository.findById(id);
  }

  async getTicketsByPurchaser(email) {
    return await this.ticketRepository.findByPurchaser(email);
  }

  async getAllTickets(filter = {}, options = {}) {
    return await this.ticketRepository.findAll(filter, options);
  }
}