import {Queue} from "bullmq";
import appConstants from "../../constants/appConstants";


const incomingEthQueue = new Queue(appConstants.QUEUE_NAMES.INCOMING_ETH_QUEUE)

const walletBalanceQueue = new Queue(
  appConstants.QUEUE_NAMES.WALLET_BALANCE_QUEUE,
);

const outgoingEthQueue = new Queue(appConstants.QUEUE_NAMES.OUTGOING_ETH_QUEUE);

const gasPriceQueue = new Queue(appConstants.QUEUE_NAMES.GAS_PRICE_QUEUE)

export default {
    incomingEthQueue,
    outgoingEthQueue,
    walletBalanceQueue,
    gasPriceQueue
}