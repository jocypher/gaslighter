// src/db/seeds/alertType.seed.ts

import { AlertType } from "../entities/AlertType";

export async function seedAlertTypes() {
  const alertTypes = [
    "WALLET_BALANCE",
    "GAS_PRICE",
    "INCOMING_ETH",
    "OUTGOING_ETH"
  ];

  for (const type of alertTypes) {
    const exists = await AlertType.findOne({
      where: { type },
    });

    if (!exists) {
      const alertType = AlertType.create({ type });
      await alertType.save();

      console.log(`Seeded alert type: ${type}`);
    }
  }
}
