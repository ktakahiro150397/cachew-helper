
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * 統合データをCashewのインポート仕様に合わせて整形し、出力シートに書き出します。
 * @param {SpreadsheetData} sourceData - ④作業_統合データシートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} targetSheet - ⑤出力_Cashew用シート。
 */
export function formatForCashew(sourceData: SpreadsheetData, targetSheet: GoogleAppsScript.Spreadsheet.Sheet) {
  Logger.log("sourceData length: " + sourceData.length);
  
  if (sourceData.length === 0) return;

  const header = ['日付', 'カテゴリ', '金額', 'メモ', '支払い方法', '口座', '振替元', '振替先', '種別']; // CashewのインポートCSVヘッダー例
  const outputRows = [header];

  // 統合シートの各行をCashewの形式に変換
  // 入力フォーマット：[日付, 勘定科目, カテゴリ, 金額, 摘要, 支払い方法, 振替元口座, 振替先口座, 取引種別]
  // Cashew出力フォーマット例：[日付, カテゴリ, 金額, メモ, 支払い方法, 口座, 振替元, 振替先, 種別]
  // ※ Cashewの実際のインポートCSV形式に合わせて、列の順序や内容を調整してください。
  //   Cashewは口座を一つ指定する形式か、振替元/先で処理する形式か、確認が必要です。
  //   ここでは、支払い方法と口座を分けているCashewの例に沿って調整します。
  //   Cashewの「口座」は、その取引が行われた主な口座を指すと仮定します。
  //   「支払い方法」列は、レシートやカード明細から取得した「個人カード」「現金」などを入れます。
  //   「口座」列は、その取引がどの口座で行われたか（Cashew内の口座名）を入れます。
  //   振替の場合は「振替元」と「振替先」に具体的な口座名が入ります。
  for (let i = 0; i < sourceData.length; i++) {
    const row = sourceData[i];
    const date = row[0];
    const category = row[2];
    const amount = row[3];
    const description = row[4];
    const paymentMethod = row[5];
    const sourceAccount = row[6]; // 振替元口座
    const destinationAccount = row[7]; // 振替先口座
    const transactionType = row[8]; // 取引種別 (支出, 収入, 振替)

    let cashewAccount = ''; // Cashewで利用する口座名

    // 振替の場合
    if (transactionType === '振替') {
      // Cashewの振替は、振替元・振替先の口座で処理されるため、「口座」は空にするか、
      // 便宜的に振替元の口座を入れるか、Cashewの仕様次第。
      // ここでは振替元の口座を「口座」に設定するが、不要なら空に。
      // また、金額は振替元から出た金額として処理される（負の値）
      cashewAccount = sourceAccount;
    } else if (transactionType === '収入' || transactionType === '支出') {
      // 収入または支出の場合、支払い方法からCashewの口座を推測
      if (paymentMethod.includes('カード')) {
        cashewAccount = 'クレジットカード'; // 例: Cashewでのクレジットカード口座名
      } else if (paymentMethod.includes('現金')) {
        cashewAccount = '現金'; // 例: Cashewでの現金口座名 
      } else {
        // 銀行明細からの収入/支出の場合、適切な銀行口座名を設定
        cashewAccount = '銀行口座'; // 例: SMBC口座
      }
    }

    // 「立替金」の扱い 
    // Cashewで立替金をどう表現するかは、Cashewの機能による。
    // 例: 特定のカテゴリとして扱う、あるいは「資産」としての項目があるか。
    // ここでは、カテゴリとしてそのまま出力します。
    // 後日精算された際に、「立替金」を消し込む処理を行う。 
    // これはGASのロジック外、Cashewでの手動処理または別途GASで精算処理が必要です。

    outputRows.push([
      date,
      category,
      amount,
      description,
      paymentMethod, // Cashewの「支払い方法」列に該当
      cashewAccount, // Cashewの「口座」列に該当
      sourceAccount, // Cashewの「振替元」列に該当
      destinationAccount, // Cashewの「振替先」列に該当
      transactionType // Cashewの「種別」列に該当 (支出, 収入, 振替)
    ]);
  }

  if (outputRows.length > 1) {
    targetSheet.getRange(1, 1, outputRows.length, outputRows[0].length).setValues(outputRows);
  }
}