import { IdealSheetRow } from "../../interface/IdealSheet";

export function setCategory(ideal: GoogleAppsScript.Spreadsheet.Sheet, categoryMaster: Array<string>) {

    if (!ideal) {
        throw new Error("データデータが見つかりません。");
    }

    const sheetValues = ideal.getDataRange().getValues();

    for (let i = 1; i < sheetValues.length; i++) {
        const row = new IdealSheetRow(
            new Date(String(sheetValues[i][0])),
            sheetValues[i][1] as any,
            String(sheetValues[i][2]).trim(),
            String(sheetValues[i][3]).trim(),
            parseFloat(String(sheetValues[i][4])),
            String(sheetValues[i][5]).trim(),
        );

        if (row.category != "") {
            // カテゴリが設定されている場合はスキップ
            continue;
        }

        // カテゴリが未設定の場合のみカテゴリを設定する
        const categoryFromContent = getCategory(row.content + row.note, categoryMaster);

        row.category = categoryFromContent;

        // シート更新
        const dataToWrite = row.getWriteData();
        ideal.getRange(i+1,1,1,dataToWrite.length).setValue(dataToWrite);
}}


function getCategory(content: string, categoryMaster: Array<string>): string {
    return `${content} : test category set`;
}