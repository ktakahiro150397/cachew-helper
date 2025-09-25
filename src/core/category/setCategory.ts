import { IdealSheetRow } from "../../interface/IdealSheet";
import { CategoryItem } from "../../interface/MasterSheet";
import { CategoryGetter } from "./getCategoryFromGemini";

export function setCategory(ideal: GoogleAppsScript.Spreadsheet.Sheet, 
    categoryGetter: CategoryGetter) {

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
            Logger.log(`カテゴリが設定されているためスキップ: ${row.category}`);
            continue;
        }

        // カテゴリが未設定の場合のみカテゴリを設定する
        const promptCategory = `# 摘要 
${row.content}`

        const categoryFromContent = categoryGetter.getCategory(promptCategory);
        // const categoryFromContent = getCategory(row.content + row.note, categoryMaster);
        ideal.getRange(i+1,3).setValue(categoryFromContent.category); // カテゴリ列（C列）のみ更新

        // row.category = categoryFromContent;

        // シート更新
        // const dataToWrite = [row.getWriteData()];
        // Logger.log(`カテゴリを設定: ${dataToWrite}`);
        // ideal.getRange(i+1,1,1,dataToWrite[0].length).setValues(dataToWrite);
}}


// function getCategory(content: string, categoryMaster: Array<CategoryItem>): string {
//     // Logger.log(`Category Master: ${JSON.stringify(categoryMaster)}`);
//     return `${content} : test category set`;
// }