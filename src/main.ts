import { processTransaction } from "./handler/process-transaction";
import { createReceiptTotalsMap } from "./core/receipt/createReceiptTotalsMap";
import { formatDate } from "./core/util/dateformat";
import { processCardData } from "./core/card/processCardData";
import { determineCardTypeFromCardNo } from "./core/card/determineCardTypeFromDescription";
import { processSMBCBankData } from "./core/SMBCBank/processSMBCBankData";
import { processReceiptData } from "./core/receipt/processReceiptData";
import { formatForCashew } from "./core/cashew/formatForCashew";
import { writeIntegratedSheetHeader } from "./core/util/integrated-sheet";
import { getCategoryFromCashewData } from "./core/cashew/getCategoryFromCashewData";

// GAS上のエントリポイント
(global as any).processTransaction = processTransaction;
(global as any).createReceiptTotalsMap = createReceiptTotalsMap;
(global as any).formatDate = formatDate;
(global as any).processCardData = processCardData;
(global as any).determineCardTypeFromDescription = determineCardTypeFromCardNo;
(global as any).processBankData = processSMBCBankData;
(global as any).processReceiptData = processReceiptData;
(global as any).formatForCashew = formatForCashew;
(global as any).writeIntegratedSheetHeader = writeIntegratedSheetHeader;
(global as any).getCategoryFromCashewData = getCategoryFromCashewData;

// const record: CashewExportRow = {
//     Date: new Date(),
//     Amount: 0,
//     Category: CashewCategory.Groceries,
//     Title: "",
//     Note: "",
//     Account: CashewAccount.SMBC_Main,
// };

// console.log(record);
