import { ethers } from 'ethers';
import envConstants from '../constants/envConstants';

const providers = {
  ethereum: new ethers.JsonRpcProvider(envConstants.ALCHEMY_URL.ETH),
  ethereumWs: new ethers.WebSocketProvider(envConstants.WS_ALCHEMY_URL.ETH),
  polygon: new ethers.JsonRpcProvider(envConstants.ALCHEMY_URL.POL),
  polygonWs: new ethers.WebSocketProvider(envConstants.ALCHEMY_URL.POL),
};

export default providers;
