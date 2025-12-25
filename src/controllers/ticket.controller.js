import { TicketService } from '../services/ticket.service.js';
import { TicketDTO } from '../dto/ticket.dto.js';

export class TicketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  // GET /api/tickets - Listar tickets (admin: todos, user: solo suyos)
  getAll = async (req, res, next) => {
    try {
      const { limit = 10, page = 1 } = req.query;
      
      const filter = {};
      
      // Si no es admin, solo mostrar sus propios tickets
      if (req.user. role !== 'admin') {
        filter.purchaser = req.user. email;
      }

      const options = {
        limit: Number(limit),
        page: Number(page)
      };

      const result = await this.ticketService.getAllTickets(filter, options);

      res.json({
        status: 'success',
        payload: result.tickets. map(t => TicketDTO.forList(t)),
        totalPages: result.totalPages,
        page: result.page
      });

    } catch (err) {
      next(err);
    }
  }

  // GET /api/tickets/:id - Obtener ticket por ID
  getById = async (req, res, next) => {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.id);

      //Solo el comprador o admin pueden ver el ticket
      if (req.user.role !== 'admin' && ticket.purchaser !== req.user. email) {
        return res. status(403).json({ error: 'Forbidden' });
      }

      res.json(TicketDTO. fromModel(ticket));

    } catch (err) {
      if (err.code === 'TICKET_NOT_FOUND') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      next(err);
    }
  }

  // GET /api/tickets/my-tickets - Mis tickets
  getMyTickets = async (req, res, next) => {
    try {
      const tickets = await this.ticketService.getTicketsByPurchaser(req.user.email);
      res.json({
        status: 'success',
        payload: tickets.map(t => TicketDTO.forList(t))
      });
    } catch (err) {
      next(err);
    }
  }
}