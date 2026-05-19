import { ethers } from "ethers";
import providers from "../../providers";
import { AlertRule } from "../../../db/entities/AlertRule";
import { AlertType } from "../../../db/entities/AlertType";
import { AlertTypeNames } from "../../constants/alertTypeNames";
import { AlertRuleStatus } from "../../enums/alertRuleStatus";
import { match } from "node:assert";
import { AlertHistory } from "../../../db/entities/AlertHistory";
import { AlertHistoryStatus } from "../../enums/alertHistoryStatus";

export class EthereumListenerService{

    private provider: ethers.WebSocketProvider

    constructor(){
        this.provider = providers.ethereumWs
    }

    async startListening(){
        console.log("Listening for transaction")

        this.provider.on('block', async (blockNumber)=>{
            console.log(`New block: ${blockNumber}`);

            const rules = await AlertRule.find({
                where:{
                    isActive: true,
                    alertType:{ type: AlertTypeNames.WALLET_BALANCE}
                },
                relations:{
                    user:true,
                    alertType:true
                }

            })
            for(const rule of rules){
                await this.checkBalanceRule(rule)
            }
        })
    }

    private async checkBalanceRule(rule: AlertRule) {
        try {
            const balanceInWei = await this.provider.getBalance(rule.targetAddress)
            
            let matches = false

            switch(rule.alertRuleStatus){
                case AlertRuleStatus.GREATER_THAN:
                    matches = balanceInWei > rule.thresholdValue
                    break

                case AlertRuleStatus.LESS_THAN:
                    matches = balanceInWei < rule.thresholdValue
                    break
                case AlertRuleStatus.EQUALS:
                    matches = balanceInWei === rule.thresholdValue
            }

            if(matches){
                // send email
                // update alert history
                const alertHistory =  AlertHistory.create({
                    alertRule: {id: rule.id},
                    triggeredAt: new Date(Date.now()),
                    eventData: {"balance":ethers.formatEther(balanceInWei)},
                    status: AlertHistoryStatus.SENT,
                    
                })
                await alertHistory.save()
            }

        } catch (error) {
            console.error(`Error checking rule ${rule.id}:`, error);
        }
    }
}