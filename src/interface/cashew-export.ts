import { CashewCategory } from "../enum/cashew-category";
import { CashewAccount } from "../enum/cashew-account";

/*
    Cashewエクスポートの行を表すインターフェース
*/
export interface CashewExportRow {
    Date: Date;
    Amount: number;
    Category: CashewCategory;
    Title: string;
    Note: string;
    Account: CashewAccount;
}
