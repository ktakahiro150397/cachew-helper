import { formatDate } from "../util/dateformat";
import { determineCardTypeFromDescription } from "./determineCardTypeFromDescription";

/**
 * カード明細を処理し、レシートと重複しないものを統合データシートにコピーします。
 * @param {Array<Array<any>>} cardData - ②入力_カードシートの全データ。
 * @param {Map<string, boolean>} receiptTotalsMap - createReceiptTotalsMapで作成されたマップ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processCardData(cardData:Array<Array<any>>, receiptTotalsMap: Map<string, boolean>, integratedSheet: GoogleAppsScript.Spreadsheet.Sheet) {
  // ヘッダー行をスキップ
  if (cardData.length <= 1) return;

  const dataToAppend = [];
  for (let i = 1; i < cardData.length; i++) {
    const row = cardData[i];
    // 実際には日付, 金額, 摘要（description）の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:摘要 とします。適宜調整してください。
    const date = formatDate(row[0]); // 日付のフォーマットを統一
    const amount = parseFloat(row[1]); // カード明細の金額は通常マイナスで来ることを想定
    const description = String(row[2]).trim();

    // カード明細には支払方法の直接的な情報がないため、
    // 照合キーは日付と金額（絶対値）で作成することが多い。
    // ただし、設計書では「支払方法」もキーに含めているため、ここでは「個人カード」または「家族カード」を仮定します。
    // 実際のCSVに「カード種類」のような列があればそれを使います。
    // ここでは、一旦カード明細全てを「個人カード」として扱い、レシート側の「個人カード」と照合を試みます。
    // より厳密な照合が必要な場合は、カードCSVにカード種類の列を追加するか、別のロジックが必要です。
    const assumedPaymentMethod = determineCardTypeFromDescription(description); // 摘要からカード種別を推測する関数
    
    const key = `${date}_${assumedPaymentMethod}_${Math.abs(amount)}`; // 金額は絶対値で比較

    // マップに一致するデータがあるか照合 
    if (receiptTotalsMap.has(key)) {
      // 一致した場合（レシートあり）：このカード明細行は無視する。 
      Logger.log(`カード明細 (レシートあり): ${date}, ${amount}, ${description} は無視します。`);
    } else {
      // 一致しない場合（レシートなし）：このカード明細行を、取引種別「支出」として④作業_統合データにコピーする。 
      // Cashew向け出力形式を考慮し、必要な列を整形して追加
      // 例: [日付, 勘定科目, カテゴリ, 金額, 摘要, 支払い方法, 振替元口座, 振替先口座, 取引種別]
      // カード明細なので、取引種別は「支出」
      // 支払い方法は assumedPaymentMethod
      // 振替元・先口座は空
      dataToAppend.push([
        date, // 日付
        '', // 勘定科目 (Cashewの仕様による)
        '', // カテゴリ (後で手動設定またはGASで自動判定)
        amount, // 金額 (通常マイナス値)
        description, // 摘要
        assumedPaymentMethod, // 支払い方法
        '', // 振替元口座
        '', // 振替先口座
        '支出' // 取引種別 
      ]);
    }
  }
  if (dataToAppend.length > 0) {
    integratedSheet.getRange(integratedSheet.getLastRow() + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
  }
}