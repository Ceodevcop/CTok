import { Request, Response } from "express";
import { PiService } from "../services/pi.service";
import { User } from "../models/User";

const piService = new PiService();

export const piLogin = async (req: Request, res: Response) => {
  try {
    const { sessionToken } = req.body;
    
    // Authenticate with Pi Network
    const piUser = await piService.authenticateUser(sessionToken);
    
    // Find or create user
    let user = await User.findOne({ piUserId: piUser.uid });
    if (!user) {
      user = new User({ piUserId: piUser.uid });
      await user.save();
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ error: "Pi Authentication Failed" });
  }
};
