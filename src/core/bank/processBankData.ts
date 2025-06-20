import { formatDate } from "../util/dateformat";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { IntegratedSheetDataRow } from "../../interface/IntegratedSheetDataRow";
import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";
import { CashewAccount } from "../../enum/cashew-account";
import { TransactionType } from "../../enum/TransactionType";
import { TransferSource } from "../../enum/TransferSource";

/**
 * 銀行明細を処理し、統合データシートにコピーします。
 * 明細の内容から取引種別（支出, 収入, 振替）を判定します。
 * @param {SpreadsheetData} bankData - ①入力_銀行シートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processBankData(
  bankData: SpreadsheetData,
  integratedSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  // ヘッダー行をスキップ
  if (bankData.length <= 1) return;

  const dataToAppend: SpreadsheetData = [];
  for (let i = 1; i < bankData.length; i++) {
    const row = bankData[i];
    // 実際には日付, 金額, 摘要（description）の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:摘要 とします。適宜調整してください。
    const date = formatDate(row[0]);
    const amount_out = parseFloat(row[1]);
    const amount_in = parseFloat(row[2]);
    const description = String(row[3]).trim();

    let transactionType = TransactionType.EXPENSE; // デフォルトは支出
    let sourceAccount: TransferSource = TransferSource.NONE;
    let destinationAccount: TransferSource = TransferSource.NONE;
    let paymentMethod = IntegratedSheetDataSource.SMBC;

    // 金額で収入/支出を判定
    if (!isNaN(amount_out)) {
      transactionType = TransactionType.EXPENSE;
    } else {
      transactionType = TransactionType.INCOME;
    }

    // 銀行明細の内容から「振替」を判定するロジック（例: ATM引き出し、口座間移動、カード引き落とし）
    // 例① カード代金の支払い：銀行口座からカード会社への「借金の返済」であり、支出ではない。
    // 例② ATMでの現金引き出し：「銀行口座」から「現金（財布）」へのお金の移動。
    // 例③ 口座間の資金移動：「自分口座」から「家族口座」へのお金の移動。
    if (description.includes("ENET")) {
      transactionType = TransactionType.TRANSFER; // ATM引き出しは振替
      sourceAccount = TransferSource.SMBC;
      destinationAccount = TransferSource.REAL_WALLET;
    } else if (description.includes("ﾐﾂｲｽﾐﾄﾓｶ-ﾄﾞ (ｶ")) {
      transactionType = TransactionType.TRANSFER; // カード代金の支払いは振替
      sourceAccount = TransferSource.SMBC;
      destinationAccount = TransferSource.VPASS_CARD;
    } else if (description.includes("SMBC(ｽﾐｼﾝSBIﾈﾂ")) {
      transactionType = TransactionType.TRANSFER; // 口座間移動
      sourceAccount = TransferSource.SMBC;
      destinationAccount = TransferSource.SBI_BANK;
    }

    const amount = isNaN(amount_out) ? amount_in : amount_out * -1;

    const integratedData = IntegratedSheetDataRow.create({
      date: new Date(date),
      account: "", // 勘定科目はCashewの仕様による
      category: "", // カテゴリは後で手動設定またはGASで自動判定
      amount: amount, // 金額は絶対値で記録
      description: description, // 摘要
      paymentMethod: paymentMethod, // 支払い方法（銀行明細では薄い）
      transferFrom: sourceAccount, // 振替元口座
      transferTo: destinationAccount, // 振替先口座
      transactionType: transactionType, // 取引種別
      note: "", // メモは空
      dataSource: IntegratedSheetDataSource.SMBC,
    });

    Logger.log(`統合データ行を追加: ${integratedData}`);
    dataToAppend.push(integratedData.getWriteData());
  }
  if (dataToAppend.length > 0) {
    integratedSheet
      .getRange(
        integratedSheet.getLastRow() + 1,
        1,
        dataToAppend.length,
        dataToAppend[0].length
      )
      .setValues(dataToAppend);
  }
}
