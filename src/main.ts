import { sample } from "./sample";
import { CashewExportRow } from "./interface/cashew-export";
import { CashewCategory } from "./enum/cashew-category";
import { CashewAccount } from "./enum/cashew-account";
import { processTransaction } from "./handler/process-transaction";
import { createReceiptTotalsMap } from "./core/receipt/createReceiptTotalsMap";
import { formatDate } from "./core/util/dateformat";
import { processCardData } from "./core/card/processCardData";
import { determineCardTypeFromDescription } from "./core/card/determineCardTypeFromDescription";
import { processBankData } from "./core/bank/processBankData";
import { processReceiptData } from "./core/receipt/processReceiptData";
import { formatForCashew } from "./core/cashew/formatForCashew";

// GAS上のエントリポイント
(global as any).processTransaction = processTransaction;
(global as any).createReceiptTotalsMap = createReceiptTotalsMap;
(global as any).formatDate = formatDate;
(global as any).processCardData = processCardData;
(global as any).determineCardTypeFromDescription = determineCardTypeFromDescription;
(global as any).processBankData = processBankData;
(global as any).processReceiptData = processReceiptData;
(global as any).formatForCashew = formatForCashew;

// const record: CashewExportRow = {
//     Date: new Date(),
//     Amount: 0,
//     Category: CashewCategory.Groceries,
//     Title: "",
//     Note: "",
//     Account: CashewAccount.SMBC_Main,
// };

// console.log(record);
