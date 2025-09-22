import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * カテゴリマスタを取得して文字列で返す
 * @param ss 
 * @returns 
 */
export function getCategoryMaster(categorySheetData: SpreadsheetData): Array<string> {
  if (!categorySheetData) {
    throw new Error("カテゴリマスタシートが見つかりません。");
  }

    const categoryMap = new Array<string>();
    for (let i = 1; i < categorySheetData.length; i++) {
        const row = categorySheetData[i];
        const category = String(row[0]).trim();
        if (categoryMap.includes(category) === false && category !== "") {
            categoryMap.push(category);
        }
    }

    return categoryMap;
}


