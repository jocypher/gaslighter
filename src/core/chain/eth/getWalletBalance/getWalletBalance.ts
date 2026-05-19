import { ethers } from "ethers";
import providers from "../../../providers";

async function GetEthWalletBalance(walletAddress: string) {
  try {
    const balance = await providers.ethereum.getBalance(walletAddress);
    if (balance < 0) {
      throw new Error("Balance cannot be less than 0");
    }
    const formatBalance = ethers.formatEther(balance);
    return formatBalance;
  } catch (error) {
    throw new Error("error occurred");
  }
}

export default GetEthWalletBalance;
