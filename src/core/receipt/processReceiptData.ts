import { formatDate } from "../util/dateformat";

/**
 * レシートデータを処理し、統合データシートにコピーします。
 * 各行は取引種別「支出」として扱います。 
 * @param {Array<Array<any>>} receiptData - ③入力_レシートシートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processReceiptData(receiptData: Array<Array<any>>, integratedSheet: GoogleAppsScript.Spreadsheet.Sheet) {
  // ヘッダー行をスキップ
  if (receiptData.length <= 1) return;

  const dataToAppend: Array<Array<any>> = [];
  for (let i = 1; i < receiptData.length; i++) {
    const row = receiptData[i];
    // 実際には日付, 金額, 店名（摘要）, カテゴリ, 支払方法 の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:店名, 3:カテゴリ, 4:支払方法 とします。適宜調整してください。
    const date = formatDate(row[0]);
    const amount = parseFloat(row[1]) * -1; // レシートは支出なので、Cashew向けに負の数に変換
    const shopName = String(row[2]).trim();
    let category = String(row[3]).trim();
    const paymentMethod = String(row[4]).trim(); // 支払方法列が必須 

    // 「立替金」の管理 
    // 個人のお金で家族のものを支払った場合など、一時的に立て替えた支出は、カテゴリを「立替金」として記録する。 
    // 「立替金」は支出ではなく、返済されるべき「資産（貸付金）」として扱われる。 
    if (category === '立替金') {
      // レシートデータでの「立替金」は、そのままカテゴリとして保持
      // Cashewへの出力時に、振替ではなく「資産」として処理されるように調整
    }

    dataToAppend.push([
      date, // 日付
      '', // 勘定科目 (Cashewの仕様による)
      category, // カテゴリ (レシートOCRアプリから取得したカテゴリ)
      amount, // 金額 (支出なので負の数)
      shopName, // 摘要 (店名)
      paymentMethod, // 支払い方法 
      '', // 振替元口座
      '', // 振替先口座
      '支出' // 取引種別 
    ]);
  }
  if (dataToAppend.length > 0) {
    integratedSheet.getRange(integratedSheet.getLastRow() + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
  }
}