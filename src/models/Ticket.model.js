import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  purchase_datetime: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  amount: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  purchaser: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },
  products: [{
    product: { 
      type: mongoose.Schema. Types.ObjectId, 
      ref: 'Product', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    price: { 
      type: Number, 
      required: true, 
      min: 0 
    }
  }]
}, { timestamps: true });

// Generar codigo unico
TicketSchema.pre('save', function(next) {
  if (!this.code) {
    // Generar codigo:  TICKET-1234567890
    this.code = `TICKET-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }
  next();
});

export const Ticket = mongoose.model('Ticket', TicketSchema);