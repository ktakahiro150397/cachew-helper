import { createReceiptTotalsMap } from "../core/receipt/receipt";
import { clearSheet } from "../sheetoperation/sheet-operation";

/**
 * メイン実行関数（スプレッドシートのボタンに紐付けます）
 * 複数のデータソースから取引情報を収集し、Googleスプレッドシート上で統合・整形、
 * 最終的に家計簿アプリ（Cashew）に取り込むための完成されたデータを作成します。
 */
export function processTransaction() {
  Logger.log("processTransaction called at " + new Date().toISOString());

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const bankSheet = ss.getSheetByName("①入力_銀行");
  const cardSheet = ss.getSheetByName("②入力_カード");
  const receiptSheet = ss.getSheetByName("③入力_レシート");
  const integratedSheet = ss.getSheetByName("④作業_統合データ");
  const outputSheet = ss.getSheetByName("⑤出力_Cashew用");

  if (!bankSheet || !cardSheet || !receiptSheet || !integratedSheet || !outputSheet) {
    Browser.msgBox('エラー', '必要なシートが見つかりません。シート名が正しいか確認してください。（①入力_銀行, ②入力_カード, ③入力_レシート, ④作業_統合データ, ⑤出力_Cashew用）', Browser.Buttons.OK);
    Logger.log("必要なシートが見つかりません。処理を中止します。");
    return;
  }

  try {
    // 1. 初期化処理
    // ④作業_統合データ と ⑤出力_Cashew用 の2つのシートの内容をクリアする。 
    clearSheet(integratedSheet);
    clearSheet(outputSheet);
    Logger.log('初期化処理が完了しました。');

    // 2. レシートデータの前処理（合計金額マップを作成）
    // ③入力_レシート のデータを読み込み、カード払いのレシートを対象に
    // 「同じ日付」「同じ支払方法」でグループ化し、支払いの合計金額を計算したマップを作成する。 
    const receiptData = receiptSheet.getDataRange().getValues();
    const receiptTotalsMap = createReceiptTotalsMap(receiptData);
    Logger.log('レシートデータの前処理が完了しました。');

  } catch (e: any) {
    Browser.msgBox('エラーが発生しました。', '処理中にエラーが発生しました。詳細はログを確認してください。\nエラーメッセージ: ' + e.message, Browser.Buttons.OK);
    Logger.log('エラー: ' + e.message + ' Stack: ' + e.stack);
  }

  Browser.msgBox('処理が完了しました。', '取引情報の処理が完了しました。', Browser.Buttons.OK);
  Logger.log("processTransaction completed at " + new Date().toISOString());
}
