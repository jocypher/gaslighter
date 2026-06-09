import { AlertRule } from '../../../db/entities/AlertRule';
import { AlertType } from '../../../db/entities/AlertType';
import client from '../../config/redisConfig';
import appConstants from '../../constants/appConstants';

const setAlerts = async (alerts: AlertRule[]) => {
  await client.set(appConstants.CACHE_KEYS.ALERT_RULES, JSON.stringify(alerts), {
    EX: appConstants.CACHE_TTL.ALERT_RULE,
  });
};

const getAlerts = async () => {
  return await client.get(appConstants.CACHE_KEYS.ALERT_RULES);
};

const setAlertTypes = async (alertType: AlertType[]) => {
  await client.set(appConstants.CACHE_KEYS.ALERT_TYPE, JSON.stringify(alertType), {
    EX: appConstants.CACHE_TTL.ALERT_TYPE,
  });
};

const getAlertTypes = async () => {
  return await client.get(appConstants.CACHE_KEYS.ALERT_TYPE);
};

export default {
  setAlerts,
  getAlerts,
  setAlertTypes,
  getAlertTypes,
};
