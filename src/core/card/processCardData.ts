import { formatDate } from "../util/dateformat";
import { determineCardTypeFromCardNo } from "./determineCardTypeFromDescription";
import { SpreadsheetData } from "../../types/spreadsheet-types";
import { IntegratedSheetDataRow } from "../../interface/IntegratedSheetDataRow";
import { IntegratedSheetDataSource } from "../../enum/IntegratedSheetDataSource";

/*
シート入力データ

NAME_1	5334-90**-****-****	三井住友カードマスター（ＮＬ）				
2024/07/08	Content_1	1755	１	１	1755	
2024/07/17	Content_2	980	１	１	980	
2024/07/22	Content_3	1825	１	１	1825	２４年　７月
2024/07/23	Content_4	8959	１	１	8959	２４年　７月
2024/07/30	Content_5	641	１	１	641	
NAME_2	5334-99**-****-****	ＡｐｐｌｅＰａｙ				
2024/07/23	Content_6	2905	１	１	2905	2905.00　JPY　1.0000　07 24
NAME_3	6900-11**-****-****	ＡｐｐｌｅＰａｙ／ｉＤ				
2024/07/01	Content_7	1002	１	１	1002	ｾﾌﾞﾝｲﾚﾌﾞﾝｱｶｼｵｵｱｶｼ/ID
2024/07/01	Content_8	1250	１	１	1250	ｾﾌﾞﾝｲﾚﾌﾞﾝｱｶｼｵｵｱｶｼ/ID
					30475	
NAME_4	5334-90**-****-****	三井住友カードマスター（ＮＬ）				
2024/07/08	Content_9	2095	１	１	2095	
2024/07/13	Content_10	4330	１	１	4330	
					18842	
					49317	

*/

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
  const dataToAppend: SpreadsheetData = [];
  let cardNumber = ""; // 現在のカード番号を保持
  for (let i = 0; i < cardData.length; i++) {
    const row = cardData[i];

    // 1セル目のデータが日付かどうかをチェック
    const firstCell = String(row[0]).trim(); // 1セル目は日付と仮定
    if (firstCell === "" || firstCell === null) {
      // 1セル目が空の場合は処理をスキップ
      Logger.log("1セル目が空の行をスキップします。");
      continue;
    }

    if (isNaN(Date.parse(firstCell))) {
      // 日付でない場合はカード番号を保存して次の行へ
      cardNumber = String(row[1]).trim(); // 2セル目にカード番号があると仮定
      Logger.log(
        `カード番号: ${cardNumber} を検出しました。次の行へ進みます。`
      );
      continue;
    }

    // データ行を処理
    const date = formatDate(row[0]); // 日付のフォーマットを統一
    const description = String(row[1]).trim(); // 2セル目は内容
    const amount = parseFloat(row[5]);
    const note = String(row[6]).trim(); // 6セル目はメモ

    const assumedPaymentMethod = determineCardTypeFromCardNo(cardNumber);
    Logger.log(
      `カード番号: ${cardNumber}, assumedPaymentMethod: ${assumedPaymentMethod}`
    );
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

      const integratedData = IntegratedSheetDataRow.create({
        date: new Date(date),
        account: "", // 勘定科目はCashewの仕様による
        category: "", // カテゴリは後で手動設定またはGASで自動判定
        amount: -Math.abs(amount), // 金額は通常マイナス値
        description: description, // 摘要
        paymentMethod: assumedPaymentMethod, // 支払い方法
        transferFrom: "", // 振替元口座は空
        transferTo: "", // 振替先口座は空
        transactionType: "支出", // 取引種別は「支出」
        note: note, // メモ
        dataSource: assumedPaymentMethod,
      });

      Logger.log(`統合データ行を追加: ${integratedData}`);
      dataToAppend.push(integratedData.getWriteData());
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
