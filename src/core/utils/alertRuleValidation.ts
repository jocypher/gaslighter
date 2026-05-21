import { ethers } from "ethers";
import { AlertType } from "../../db/entities/AlertType";
import { AlertRuleStatus } from "../enums/alertRuleStatus";
import { User } from "../../db/entities/User";

export class AlertRuleValidations {
  static validateEthereumAddress(address: string): void {
    if (!ethers.isAddress(address)) {
      throw new Error(`Invalid wallet address: ${address}`);
    }
  }

  static async findAlertTypeRecord(alertType: string): Promise<AlertType> {
    
    const alertTypeRecord = await AlertType.findOne({
      where: {
        type: alertType,
      },
    });
    if (!alertTypeRecord) {
      throw new Error("Alert type not found");
    }
    console.log("The alertType record is", alertTypeRecord)

    return alertTypeRecord;
  }

  static convertAlertStatusEnum(status: string): AlertRuleStatus {
    switch (status) {
      case "greater_than":
        return AlertRuleStatus.GREATER_THAN;
      case "less_than":
        return AlertRuleStatus.LESS_THAN;
      case "equals":
        return AlertRuleStatus.EQUALS;
      default:
        throw new Error(
          "Invalid condition. Use: greater_than, less_than, or equals",
        );
    }
  }

  static validateThresholdValue(thresholdValue: string): bigint {
    try {
      return BigInt(thresholdValue);
    } catch {
      throw new Error("Invalid threshold value. Must be a valid number");
    }
  }

  static async findUser(userId: string): Promise<User> {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

 
  
}