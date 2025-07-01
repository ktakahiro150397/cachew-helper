import { formatDate } from "../util/dateformat";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { IntegratedSheetDataRow } from "../../interface/IntegratedSheetDataRow";
import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";
import { TransferSource } from "../../enum/TransferSource";
import { TransactionType } from "../../enum/TransactionType";

/**
 * レシートデータを処理し、統合データシートにコピーします。
 * 各行は取引種別「支出」として扱います。
 * @param {SpreadsheetData} receiptData - ③入力_レシートシートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processReceiptData(
  receiptData: SpreadsheetData,
  integratedSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  // ヘッダー行をスキップ
  if (receiptData.length <= 1) return;

  const dataToAppend: SpreadsheetData = [];
  for (let i = 1; i < receiptData.length; i++) {
    const row = receiptData[i];
    // データ構造: レシートID	支払方法	日付	利用店舗名	摘要	価格	備考	合計金額不一致	読み取り注意事項
    const receiptId = String(row[0]).trim();
    const paymentMethod = String(row[1]).trim();
    const date = formatDate(row[2]);
    const shopName = String(row[3]).trim();
    const description = String(row[4]).trim();
    const amount = parseFloat(row[5]);
    const note = String(row[6]).trim();
    
    // 有効なデータかチェック
    if (!paymentMethod || !date || isNaN(amount)) {
      Logger.log(`Invalid data row skipped: ${JSON.stringify(row)}`);
      continue;
    }

    // 「立替金」の管理
    // 個人のお金で家族のものを支払った場合など、一時的に立て替えた支出は、カテゴリを「立替金」として記録する。
    // 「立替金」は支出ではなく、返済されるべき「資産（貸付金）」として扱われる。
    let category = ""; // カテゴリは空白に設定

    // 備考とレシートIDを組み合わせたノート
    const formattedNote = note ? `${note}\n\nレシートID：${receiptId}` : `レシートID：${receiptId}`;

    // 支払い方法からデータソースを決定
    let dataSource = IntegratedSheetDataSource.SMBC; // デフォルト値
    if (paymentMethod.includes("共有マスターカード") ) {
      dataSource = IntegratedSheetDataSource.VPASS_FAMILY;
    } else if (paymentMethod.includes("現金") || paymentMethod.includes("財布")) {
      dataSource = IntegratedSheetDataSource.REAL_WALLET;
    }

    const integratedData = IntegratedSheetDataRow.create({
      date: new Date(date),
      account: paymentMethod, // 勘定科目を支払い方法に設定
      category: category, // カテゴリは空白
      amount: amount * -1, // 金額は支出なので負の数
      description: shopName ? shopName : description, // 摘要（店名または摘要）
      paymentMethod: paymentMethod, // 支払い方法
      transferFrom: TransferSource.NONE, // 振替元口座は空
      transferTo: TransferSource.NONE, // 振替先口座は空
      transactionType: TransactionType.EXPENSE, // 取引種別は「支出」
      note: formattedNote, // メモに備考とレシートIDを設定
      dataSource: dataSource, // データソースを決定
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
