// src/db/seeds/alertType.seed.ts

import { AlertType } from "../entities/AlertType";
import redisService from "../../core/services/redis/redisService";

export async function seedAlertTypes() {
  const alertTypes = [
    "WALLET_BALANCE",
    "GAS_PRICE",
    "INCOMING_ETH",
    "OUTGOING_ETH",
    "CONTRACT_INTERACTION",
    "TOKEN_TRANSFER",
    "LARGE_TRANSACTION"
  ];

 
    for (const typeName of alertTypes) {
    const exists = await AlertType.findOne({
      where: { type: typeName },
    });

    if (!exists) {
      const alertType = new AlertType();
      alertType.type = typeName;
      await alertType.save();
    }
  }

}



 export async function getCachedAlertTypes(){
  try{
    const cached = await redisService.getAlertTypes();
  
    if(cached){
      return JSON.parse(cached)
    }
    
    const alertTypes = await AlertType.find()
    if(!alertTypes){
      throw new Error("Alerts not founds")
    }
    await redisService.setAlertTypes(alertTypes)

    return alertTypes
  }catch(error){
    console.warn(`Failed to cache result`, error)
  }
}