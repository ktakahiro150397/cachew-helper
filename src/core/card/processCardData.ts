import { formatDate } from "../util/dateformat";
import { determineCardTypeFromDescription } from "./determineCardTypeFromDescription";
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * カード明細を処理し、レシートと重複しないものを統合データシートにコピーします。
 * @param {SpreadsheetData} cardData - ②入力_カードシートの全データ。
 * @param {Map<string, boolean>} receiptTotalsMap - createReceiptTotalsMapで作成されたマップ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processCardData(
  cardData: SpreadsheetData,
  receiptTotalsMap: Map<string, boolean>,
  integratedSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  // ヘッダー行をスキップ
  if (cardData.length <= 1) return;

  const dataToAppend: SpreadsheetData = [];
  for (let i = 1; i < cardData.length; i++) {
    const row = cardData[i];
    // 実際には日付, 金額, 摘要（description）の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:摘要 とします。適宜調整してください。
    const date = formatDate(row[0]); // 日付のフォーマットを統一
    const amount = parseFloat(row[1]);
    const description = String(row[2]).trim();
    const assumedPaymentMethod = String(row[3]).trim(); // 支払方法列（例: 個人カード, 家族カード）

    const key = `${date}_${assumedPaymentMethod}_${amount}`; // 金額は絶対値で比較

    // マップに一致するデータがあるか照合
    if (receiptTotalsMap.has(key)) {
      // 一致した場合（レシートあり）：このカード明細行は無視する。
      Logger.log(
        `key = ${key} カード明細 (レシートあり): ${date}, ${amount}, ${description} は無視します。`
      );
    } else {
      Logger.log(
        `key = ${key}, カード明細 (レシートなし): ${date}, ${amount}, ${description} を処理します。`
      );
      // 一致しない場合（レシートなし）：このカード明細行を、取引種別「支出」として④作業_統合データにコピーする。
      // Cashew向け出力形式を考慮し、必要な列を整形して追加
      // 例: [日付, 勘定科目, カテゴリ, 金額, 摘要, 支払い方法, 振替元口座, 振替先口座, 取引種別]
      // カード明細なので、取引種別は「支出」
      // 支払い方法は assumedPaymentMethod
      // 振替元・先口座は空
      dataToAppend.push([
        date, // 日付
        "", // 勘定科目 (Cashewの仕様による)
        "", // カテゴリ (後で手動設定またはGASで自動判定)
        amount, // 金額 (通常マイナス値)
        description, // 摘要
        assumedPaymentMethod, // 支払い方法
        "", // 振替元口座
        "", // 振替先口座
        "支出", // 取引種別
      ]);
    }
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
