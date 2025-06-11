import { formatDate } from "../util/dateformat";

/**
 * 銀行明細を処理し、統合データシートにコピーします。
 * 明細の内容から取引種別（支出, 収入, 振替）を判定します。 
 * @param {Array<Array<any>>} bankData - ①入力_銀行シートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} integratedSheet - ④作業_統合データシート。
 */
export function processBankData(bankData: Array<Array<any>>, integratedSheet: GoogleAppsScript.Spreadsheet.Sheet) {
  // ヘッダー行をスキップ
  if (bankData.length <= 1) return;

  const dataToAppend: Array<Array<any>> = [];
  for (let i = 1; i < bankData.length; i++) {
    const row = bankData[i];
    // 実際には日付, 金額, 摘要（description）の列インデックスを特定する必要があります。
    // 仮に0:日付, 1:金額, 2:摘要 とします。適宜調整してください。
    const date = formatDate(row[0]);
    const amount = parseFloat(row[1]);
    const description = String(row[2]).trim();

    let transactionType = '支出'; // デフォルトは支出
    let sourceAccount = '';
    let destinationAccount = '';
    let paymentMethod = ''; // 銀行明細の場合、支払い方法の概念は薄い

    // 金額で収入/支出を判定
    if (amount > 0) {
      transactionType = '収入';
    } else {
      transactionType = '支出';
    }

    // 銀行明細の内容から「振替」を判定するロジック（例: ATM引き出し、口座間移動、カード引き落とし） 
    // 例① カード代金の支払い：銀行口座からカード会社への「借金の返済」であり、支出ではない。 
    // 例② ATMでの現金引き出し：「銀行口座」から「現金（財布）」へのお金の移動。 
    // 例③ 口座間の資金移動：「自分口座」から「家族口座」へのお金の移動。 
    if (description.includes('ATM')) {
      transactionType = '振替'; // ATM引き出しは振替 
      sourceAccount = '銀行口座名'; // 例: SMBC, SBIネット銀行
      destinationAccount = '現金'; // 「現金（お財布）」も一つの独立した口座として扱う 
    } else if (description.includes('カード') && (description.includes('引落') || description.includes('支払'))) {
      transactionType = '振替'; // カード代金の支払いは振替 
      sourceAccount = '銀行口座名';
      destinationAccount = 'カード会社名'; // 例: 個人カード, 家族カード
    } else if (description.includes('口座振替') || description.includes('口座間移動')) {
      transactionType = '振替'; // 口座間移動 
      sourceAccount = '移動元口座名';
      destinationAccount = '移動先口座名';
    }

    dataToAppend.push([
      date, // 日付
      '', // 勘定科目 (Cashewの仕様による)
      '', // カテゴリ (後で手動設定またはGASで自動判定)
      amount, // 金額
      description, // 摘要
      paymentMethod, // 支払い方法
      sourceAccount, // 振替元口座
      destinationAccount, // 振替先口座
      transactionType // 取引種別 
    ]);
  }
  if (dataToAppend.length > 0) {
    integratedSheet.getRange(integratedSheet.getLastRow() + 1, 1, dataToAppend.length, dataToAppend[0].length).setValues(dataToAppend);
  }
}