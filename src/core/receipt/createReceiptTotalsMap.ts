import { formatDate } from "../util/dateformat";
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * レシートデータから、カード払いレシートの合計金額マップを作成します。
 * マップのキーは '日付_支払方法_金額' の形式で、レシートが存在することを示す値を持つ。
 * レシートOCRデータは「支払方法」列が必須。
 *
 * @param {SpreadsheetData} receiptData - ③入力_レシートシートの全データ。
 * @returns {Map<string, boolean>} - カード払いレシートの合計金額マップ。
 */
export function createReceiptTotalsMap(
  receiptData: SpreadsheetData
): Map<string, boolean> {
  Logger.log("createReceiptTotalsMap");

  const map = new Map();
  // ヘッダー行をスキップ
  if (receiptData.length <= 1) return map;

  for (let i = 1; i < receiptData.length; i++) {
    Logger.log(`Processing row ${i}: ${receiptData[i].join(", ")}`);

    const row = receiptData[i];
    // 実際には日付、金額、支払方法の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:支払方法 とします。適宜調整してください。
    const date = formatDate(row[0]); // 日付のフォーマットを統一
    const amount = parseFloat(row[1]);
    const paymentMethod = String(row[2]).trim(); // 支払方法列

    // カード払いと判断される支払方法を定義（例: 個人カード, 家族カード）
    if (paymentMethod.includes("カード") && !isNaN(amount)) {
      // 日付と金額、支払方法で一意のキーを作成
      // カード明細との照合時に、日付と金額だけでなく支払方法も考慮に入れる
      const key = `${date}_${paymentMethod}_${amount}`;
      map.set(key, true); // レシートが存在することを示す
    }
  }

  Logger.log(`Created receipt totals map with ${map.size} entries.`);
  // マップの内容をログに出力（デバッグ用）
  map.forEach((value, key) => {
    Logger.log(`Key: ${key}, Value: ${value}`);
  });
  
  return map;
}
