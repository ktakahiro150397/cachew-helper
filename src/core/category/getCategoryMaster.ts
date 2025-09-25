import { CategoryItem } from "../../interface/MasterSheet";
import { SpreadsheetData } from "../../types/spreadsheet-types";

/**
 * カテゴリマスタを取得して文字列で返す
 * @param ss 
 * @returns 
 */
export function getCategoryMaster(categorySheetData: SpreadsheetData): Array<CategoryItem> {
  if (!categorySheetData) {
    throw new Error("カテゴリマスタシートが見つかりません。");
  }

    const categoryMap = new Array<CategoryItem>();
    for (let i = 1; i < categorySheetData.length; i++) {
        const row = categorySheetData[i];
        const category = String(row[0]).trim();
        if (category !== "") {
            categoryMap.push({
                category: category,
            });
        }
    }

    return categoryMap;
}


