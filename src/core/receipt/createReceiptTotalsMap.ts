import { formatDate } from "../util/dateformat";
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * レシートデータから、カード払いレシートの合計金額マップを作成します。
 * マップのキーは '支払方法_日付_合計金額' の形式で、レシートが存在することを示す値を持つ。
 * レシートIDでグループ化して合計金額を計算します。
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

  // レシートIDごとのグループ化用マップ
  const receiptGroups = new Map<string, {
    paymentMethod: string;
    date: string;
    totalAmount: number;
  }>();

  for (let i = 1; i < receiptData.length; i++) {
    const row = receiptData[i];
    // データ構造: レシートID	支払方法	日付	利用店舗名	摘要	価格	備考	合計金額不一致	読み取り注意事項
    const receiptId = String(row[0]).trim();
    const paymentMethod = String(row[1]).trim();
    const date = formatDate(row[2]);
    const shopName = String(row[3]).trim();
    const description = String(row[4]).trim();
    const amount = parseFloat(row[5]);
    
    // 有効なデータかチェック
    if (!receiptId || !paymentMethod || !date || isNaN(amount)) {
      Logger.log(`Invalid data row skipped: ${JSON.stringify(row)}`);
      continue;
    }

    // カード払いと判断される支払方法を定義（例: 個人カード, 家族カード, マスターカード）
    if (paymentMethod.includes("カード")) {
      // レシートIDでグループ化
      if (receiptGroups.has(receiptId)) {
        // 既存のグループに金額を追加
        const group = receiptGroups.get(receiptId)!;
        group.totalAmount += amount;
      } else {
        // 新しいグループを作成
        receiptGroups.set(receiptId, {
          paymentMethod: paymentMethod,
          date: date,
          totalAmount: amount
        });
      }
    }
  }

  // グループ化されたデータからマップを作成
  receiptGroups.forEach((group, receiptId) => {
    // 支払方法_日付_合計金額 の形式でキーを作成
    const key = `${group.paymentMethod}_${group.date}_${group.totalAmount}`;
    map.set(key, true); // レシートが存在することを示す
    Logger.log(`Receipt group: ${receiptId} -> Key: ${key}, Total: ${group.totalAmount}`);
  });

  Logger.log(`Created receipt totals map with ${map.size} entries.`);
  // マップの内容をログに出力（デバッグ用）
  map.forEach((value, key) => {
    Logger.log(`Key: ${key}, Value: ${value}`);
  });

  return map;
}
