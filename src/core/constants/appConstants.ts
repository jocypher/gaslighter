const appConstants = {
  STATUS_CODE: {
    UNAUTHORIZED: 400,
    SUCCESS: 200,
    NOTFOUND: 404,
  },
  ALERT_TYPE_NAMES: {
    WALLET_BALANCE: 'WALLET_BALANCE',
    GAS_PRICE: 'GAS_PRICE',
    INCOMING_ETH: 'INCOMING_ETH',
    OUTGOING_ETH: 'OUTGOING_ETH',
    CONTRACT_INTERACTION: 'CONTRACT_INTERACTION',
    TOKEN_TRANSFER: 'TOKEN_TRANSFER',
    LARGE_TRANSACTION: 'LARGE_TRANSACTION',
  },
  CACHE_KEYS: {
    ALERT_RULES: 'ALERT_RULES',
    ALERT_TYPE: 'ALERT_TYPE',
  },
  CACHE_TTL: {
    ALERT_RULE: 5 * 60,
    ALERT_TYPE: 24 * 60 * 60,
  },
  QUEUE_NAMES: {
    INCOMING_ETH_QUEUE: 'incomingEthQueue',
    WALLET_BALANCE_QUEUE: 'walletBalanceQueue',
    OUTGOING_ETH_QUEUE: 'outgoingEthQueue',
    GAS_PRICE_QUEUE: 'gasPriceQueue',
  },
  WORKER_NAMES: {
    INCOMING_ETH_WORKER: 'incomingEthWorker',
    WALLET_BALANCE_ETH_WORKER: 'walletBalanceEthWorker',
    OUTGOING_ETH_WORKER: 'outgoingEthWorker',
    GAS_PRICE_WORKER: 'gasPriceWorker',
  },
};

export default appConstants;
