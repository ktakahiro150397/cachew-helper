import { sample } from "./sample";
import { CashewExportRow } from "./interface/cashew-export";
import { CashewCategory } from "./enum/cashew-category";
import { CashewAccount } from "./enum/cashew-account";
import { processTransaction } from "./handler/process-transaction";
import { createReceiptTotalsMap } from "./core/receipt/receipt";
import { formatDate } from "./core/util/dateformat";

// GAS上のエントリポイント
(global as any).processTransaction = processTransaction;
(global as any).createReceiptTotalsMap = createReceiptTotalsMap;
(global as any).formatDate = formatDate;

// const record: CashewExportRow = {
//     Date: new Date(),
//     Amount: 0,
//     Category: CashewCategory.Groceries,
//     Title: "",
//     Note: "",
//     Account: CashewAccount.SMBC_Main,
// };

// console.log(record);
