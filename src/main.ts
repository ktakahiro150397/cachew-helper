import { sample } from "./sample";
import { CashewExportRow } from "./interface/cashew-export";
import { CashewCategory } from "./enum/cashew-category";
import { CashewAccount } from "./enum/cashew-account";
import { processTransaction } from "./handler/process-transaction";

// GAS上のエントリポイント

// (global as any).sample = sample;
// (global as any).CashewCategory = CashewCategory;
// (global as any).CashewAccount = CashewAccount;

(global as any).processTransaction = processTransaction;

// const record: CashewExportRow = {
//     Date: new Date(),
//     Amount: 0,
//     Category: CashewCategory.Groceries,
//     Title: "",
//     Note: "",
//     Account: CashewAccount.SMBC_Main,
// };

// console.log(record);


// const ss = SpreadsheetApp.getActiveSpreadsheet();
// const bankSheet = ss.getSheetByName('①入力_銀行');
// const cardSheet = ss.getSheetByName('②入力_カード');
// const receiptSheet = ss.getSheetByName('③入力_レシート');
// const integratedSheet = ss.getSheetByName('④作業_統合データ');
// const outputSheet = ss.getSheetByName('⑤出力_Cashew用');

// // if (!bankSheet || !cardSheet || !receiptSheet || !integratedSheet || !outputSheet) {
// // Browser.msgBox('エラー', '必要なシートが見つかりません。シート名が正しいか確認してください。（①入力_銀行, ②入力_カード, ③入力_レシート, ④作業_統合データ, ⑤出力_Cashew用）', Browser.Buttons.OK);
// // return;
// // }