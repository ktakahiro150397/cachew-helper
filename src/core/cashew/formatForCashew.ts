import { getAccountName } from "../../enum/IntegratedSheetDataSource";
import { getIntegratedSheetTransferSourceName } from "../../enum/TransferSource";
import { CashewExportRow } from "../../interface/cashew-export";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { getCategoryFromCashewData } from "./getCategoryFromCashewData";

const DATA_DATE_START_THRESHOLD = new Date("2025-04-01");

/**
 * 統合データをCashewのインポート仕様に合わせて整形し、出力シートに書き出します。
 * @param {SpreadsheetData} sourceData - ④作業_統合データシートの全データ。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} targetSheet - ⑤出力_Cashew用シート。
 */
export function formatForCashew(
  sourceData: SpreadsheetData,
  targetSheet: GoogleAppsScript.Spreadsheet.Sheet
) {
  Logger.log("sourceData length: " + sourceData.length);

  if (sourceData.length === 0) return;
  const outputRows = [];

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
  for (let i = 1; i < sourceData.length; i++) {
    const row = sourceData[i];
    const date = row[0];
    const amount = row[3];
    let category = row[2] || "CashewHelper";
    const description = row[4];

    let note = row[9] || "";
    const account: string = row[10];

    const sourceAccount = row[6]; // 振替元口座
    const destinationAccount = row[7]; // 振替先口座

    // 指定日時より前のデータは無視する
    if (date < DATA_DATE_START_THRESHOLD) {
      continue;
    }

    if (sourceAccount && destinationAccount) {
      // 振替の場合、カテゴリを「振替」に設定
      category = "振替";
      note = `振替元: ${sourceAccount}, 振替先: ${destinationAccount} ${note}`;

      // 振替先のレコードを追加で作成
      {
        const transferRow = CashewExportRow.create({
          Date: date,
          Amount: amount * -1, // 振替はマイナス金額で表現
          Category: category,
          Title: description,
          Note: note,
          Account: getAccountName(
            getIntegratedSheetTransferSourceName(destinationAccount)
          ), // 振替先口座を取得
        });

        outputRows.push(transferRow.getWriteData());
      }
    } else {
      category = getCategoryFromCashewData(description);
    }

    // const paymentMethod = row[5];
    // const transactionType = row[8]; // 取引種別 (支出, 収入, 振替)

    const exportRow = CashewExportRow.create({
      Date: date,
      Amount: amount,
      Category: category, // カテゴリは適宜設定
      Title: description, // 摘要はタイトルとして扱う
      Note: note, // メモは空（必要に応じて追加）
      Account: account, // 口座は振替元口座名を入れる
    });

    outputRows.push(exportRow.getWriteData());
  }

  if (outputRows.length > 1) {
    targetSheet
      .getRange(2, 1, outputRows.length, outputRows[0].length)
      .setValues(outputRows);
  }
}
