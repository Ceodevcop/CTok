import { PiNetwork } from "@pi-network/server-sdk";

export class PiService {
  private pi: PiNetwork;

  constructor() {
    this.pi = new PiNetwork({
      apiKey: process.env.PI_API_KEY!,
      secret: process.env.PI_API_SECRET!,
    });
  }

  async authenticateUser(sessionToken: string) {
    return this.pi.authenticate(sessionToken);
  }

  async createPayment(fromUserId: string, toUserId: string, amount: number) {
    return this.pi.createPayment({
      from: fromUserId,
      to: toUserId,
      amount: amount.toString(), // Pi uses string amounts
      memo: "C-Tok Transaction",
    });
  }
      }
