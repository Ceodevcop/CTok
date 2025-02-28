import { PiService } from "./pi.service";
import { Transaction } from "../models/Transaction";

export class EscrowService {
  private piService: PiService = new PiService();

  async createEscrow(fromUserId: string, toVendorId: string, amount: number) {
    // Create Pi blockchain transaction
    const payment = await this.piService.createPayment(fromUserId, toVendorId, amount);
    
    // Save to MongoDB
    const transaction = new Transaction({
      txHash: payment.txid,
      fromUserId,
      toUserId: toVendorId,
      amount,
      status: "PENDING"
    });
    
    await transaction.save();
    return transaction;
  }
  }
