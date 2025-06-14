import { formatDate } from "../util/dateformat";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { IntegratedSheetDataRow } from "../../interface/IntegratedSheetDataRow";
import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";

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
    // 実際には日付, 金額, 店名（摘要）, カテゴリ, 支払方法 の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:店名, 3:カテゴリ, 4:支払方法 とします。適宜調整してください。
    const date = formatDate(row[0]);
    const amount = parseFloat(row[1]); // レシートは支出なので、Cashew向けに負の数に変換
    const shopName = String(row[2]).trim();
    let category = String(row[3]).trim();
    const paymentMethod = String(row[4]).trim(); // 支払方法列が必須

    // 「立替金」の管理
    // 個人のお金で家族のものを支払った場合など、一時的に立て替えた支出は、カテゴリを「立替金」として記録する。
    // 「立替金」は支出ではなく、返済されるべき「資産（貸付金）」として扱われる。
    if (category === "立替金") {
      // レシートデータでの「立替金」は、そのままカテゴリとして保持
      // Cashewへの出力時に、振替ではなく「資産」として処理されるように調整
    }

    const integratedData = IntegratedSheetDataRow.create({
      date: new Date(date),
      account: "", // 勘定科目はCashewの仕様による
      category: category, // カテゴリはレシートOCRアプリから取得したもの
      amount: amount * -1, // 金額は支出なので負の数
      description: shopName, // 摘要（店名）
      paymentMethod: paymentMethod, // 支払い方法
      transferFrom: "", // 振替元口座は空
      transferTo: "", // 振替先口座は空
      transactionType: "支出", // 取引種別は「支出」
      note: "", // メモは空
      dataSource: IntegratedSheetDataSource.OTHER,
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
