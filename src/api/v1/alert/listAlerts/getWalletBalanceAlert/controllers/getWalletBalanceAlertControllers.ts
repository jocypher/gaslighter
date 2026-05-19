import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../../../../core/middlewares/authMiddlewares";
import GetEthWalletBalance from "../../../../../../core/chain/eth/getWalletBalance/getWalletBalance";
import { ethers } from "ethers";
import appConstants from "../../../../../../core/constants/appConstants";

async function GetWalletBalanceAlertController(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const address = req.params.address as string;

    if (!ethers.isAddress(address)) {
      return res.status(appConstants.statusCode.SUCCESS).json({
        success: false,
        message: "Invalid Ethereum address",
      });
    }

    const balance = await GetEthWalletBalance(address);

    return res.status(appConstants.statusCode.SUCCESS).json({
      success: true,
      data: {
        address,
        balance,
        unit: "ETH",
      },
    });
  } catch (error) {
    next(error);
  }
}

export default GetWalletBalanceAlertController;
