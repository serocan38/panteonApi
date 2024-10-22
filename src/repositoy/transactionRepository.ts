import BaseRepository from "../core/repository/baseRepository"
import { User } from "../entity/user"
import { Transaction } from "../entity/transaction";
import { databaseManager } from "../core/database/databaseManager";
import { RESET_WEEKLY_BALANCES } from "../constants/queryConstants";

export default class TransactionRepository extends BaseRepository<Transaction> {
    protected getEntity() {
        return Transaction
    }

    async resetWeeklyBalance(): Promise<void> {
        await databaseManager.runQuery(RESET_WEEKLY_BALANCES);
    }
}