import { processBankData } from "../core/bank/processBankData";
import { processCardData } from "../core/card/processCardData";
import { formatForCashew } from "../core/cashew/formatForCashew";
import { createReceiptTotalsMap } from "../core/receipt/createReceiptTotalsMap";
import { processReceiptData } from "../core/receipt/processReceiptData";
import { clearSheet } from "../sheetoperation/sheet-operation";
import { writeIntegratedSheetHeader } from "../core/util/integrated-sheet";
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

  if (
    !bankSheet ||
    !cardSheet ||
    !receiptSheet ||
    !integratedSheet ||
    !outputSheet
  ) {
    Browser.msgBox(
      "エラー",
      "必要なシートが見つかりません。シート名が正しいか確認してください。（①入力_銀行, ②入力_カード, ③入力_レシート, ④作業_統合データ, ⑤出力_Cashew用）",
      Browser.Buttons.OK
    );
    Logger.log("必要なシートが見つかりません。処理を中止します。");
    return;
  }

  try {
    // 1. 初期化処理
    // ④作業_統合データ と ⑤出力_Cashew用 の2つのシートの内容をクリアする。
    clearSheet(integratedSheet);
    clearSheet(outputSheet);

    // ④作業_統合データシートのヘッダーを設定する
    writeIntegratedSheetHeader(integratedSheet);

    Logger.log("初期化処理が完了しました。");

    // 2. レシートデータの前処理（合計金額マップを作成）
    // ③入力_レシート のデータを読み込み、カード払いのレシートを対象に
    // 「同じ日付」「同じ支払方法」でグループ化し、支払いの合計金額を計算したマップを作成する。
    const receiptData = receiptSheet.getDataRange().getValues();
    const receiptTotalsMap = createReceiptTotalsMap(receiptData);
    Logger.log("レシートデータの前処理が完了しました。");

    // 3. カード明細の処理
    // ②入力_カード のデータを1行ずつ読み込み、手順2で作成したマップに一致するデータがあるか照合する。
    // 一致した場合（レシートあり）：このカード明細行は無視する。
    // 一致しない場合（レシートなし）：このカード明細行を、取引種別「支出」として④作業_統合データにコピーする。
    const cardData = cardSheet.getDataRange().getValues();
    processCardData(cardData, receiptTotalsMap, integratedSheet);
    Logger.log("カード明細の処理が完了しました。");

    // 4. 銀行明細の処理
    // ①入力_銀行 のデータを1行ずつ読み込み、明細の内容から取引種別（支出, 収入, 振替）を判定し、④作業_統合データにコピーする。
    const bankData = bankSheet.getDataRange().getValues();
    processBankData(bankData, integratedSheet);
    Logger.log("銀行明細の処理が完了しました。");

    // 5. レシートデータの処理
    // ③入力_レシートの全データを④作業_統合データにコピーする。各行は取引種別「支出」として扱う。
    // ※ レシートデータは、カード明細との重複排除後に残ったもの、または現金払いのものとして処理されます。
    processReceiptData(receiptData, integratedSheet);
    Logger.log("レシートデータの処理が完了しました。");

    // // 6. 最終データへの整形・出力
    // // ④作業_統合データの全データを、Cashewのインポート仕様に合わせて整形し、⑤出力_Cashew用シートに書き出す。
    const integratedData = integratedSheet.getDataRange().getValues();
    Logger.log(
      "統合データの取得が完了しました。行数: " + integratedData.length
    );
    formatForCashew(integratedData, outputSheet);
    Logger.log("最終データへの整形・出力が完了しました。");
  } catch (e: any) {
    Browser.msgBox(
      "エラーが発生しました。",
      "処理中にエラーが発生しました。詳細はログを確認してください。\nエラーメッセージ: " +
        e.message,
      Browser.Buttons.OK
    );
    Logger.log("エラー: " + e.message + " Stack: " + e.stack);
  }

  Browser.msgBox(
    "処理が完了しました。",
    "取引情報の処理が完了しました。",
    Browser.Buttons.OK
  );
  Logger.log("processTransaction completed at " + new Date().toISOString());
}
