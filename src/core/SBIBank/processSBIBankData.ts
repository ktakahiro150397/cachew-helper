import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";
import { TransactionType } from "../../enum/TransactionType";
import { TransferSource } from "../../enum/TransferSource";
import { IntegratedSheetDataRow } from "../../interface/IntegratedSheetDataRow";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { formatDate } from "../util/dateformat";

export function processSBIBankData(
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
    const description = String(row[1]).trim();
    const amount_out = parseFloat(row[2]);
    const amount_in = parseFloat(row[3]);
    const note = String(row[5]).trim(); // 4セル目はメモ

    let transactionType = TransactionType.EXPENSE; // デフォルトは支出
    let sourceAccount: TransferSource = TransferSource.NONE;
    let destinationAccount: TransferSource = TransferSource.NONE;
    let paymentMethod = IntegratedSheetDataSource.SBI_BANK;

    // 金額で収入/支出を判定
    if (!isNaN(amount_out)) {
      transactionType = TransactionType.EXPENSE;
    } else {
      transactionType = TransactionType.INCOME;
    }

    const amount = isNaN(amount_out) ? amount_in : amount_out * -1;

    // 統合データシートに追加する行を作成
    const integratedData = IntegratedSheetDataRow.create({
      date: new Date(date),
      account: "", // 勘定科目はCashewの仕様による
      category: "", // カテゴリは後で手動設定またはGASで自動判定
      amount: amount,
      description: description,
      paymentMethod: paymentMethod,
      transferFrom: sourceAccount,
      transferTo: destinationAccount,
      transactionType: transactionType,
      note: note,
      dataSource: IntegratedSheetDataSource.SBI_BANK,
    });

    dataToAppend.push(integratedData.getWriteData());
  }

  if (dataToAppend.length > 0) {
    // 統合データシートにデータを追加
    integratedSheet
      .getRange(
        integratedSheet.getLastRow() + 1,
        1,
        dataToAppend.length,
        dataToAppend[0].length
      )
      .setValues(dataToAppend);
  }
  Logger.log(
    `SBI銀行データの処理が完了しました。${dataToAppend.length} 行を追加しました。`
  );
}
