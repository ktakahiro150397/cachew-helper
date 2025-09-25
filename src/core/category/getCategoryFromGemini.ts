import { CategoryItem } from "../../interface/MasterSheet";

export interface CategoryGetResult {
    prompt: string;
    category: string;
    reason: string;
}

export interface CategoryGetter {
    getCategory(content: string): CategoryGetResult;
}

export abstract class CategoryGetterBase implements CategoryGetter {
    constructor(protected categoryMaster: Array<CategoryItem>) {}

    abstract getCategory(content: string): CategoryGetResult;
}

export class CategoryGetterFromGemini extends CategoryGetterBase {
    private prompt: string = ``
    private existingResults: Array<CategoryGetResult> = [];

    constructor(private apiKey: string, 
                private saveSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null,
                categoryMaster: Array<CategoryItem>) {
        super(categoryMaster);

        // 現在の保存シートの内容を読み込み
        this.existingResults = this.getCategoryResultFromSaveSheet();
        Logger.log(`既存のカテゴリ取得結果を読み込み: ${this.existingResults.length} 件`);

        
                }

    private callGeminiToGetCategory(content: string): CategoryGetResult {
        // Gemini APIを呼び出してカテゴリを取得するロジックを実装
        this.prompt = `以下のカテゴリマスタを参考に、与えられた内容に最も適したカテゴリを選択してください。
カテゴリマスタ:
${this.categoryMaster.map(item => `- ${item.category}`).join("\n")}

内容:
${content}

上記の内容に基づいて、最も適したカテゴリを一つ選び、その理由を簡潔に説明してください。`;

        // 既に同じ内容で取得した結果があれば、それを返す
        const existing = this.existingResults.find(res => res.prompt === content);
        if (existing) {
            Logger.log(`既存の結果を使用: ${JSON.stringify(existing)}`);
            return existing;
        }

        // ここでは仮の実装として、contentに基づいてカテゴリを決定する例を示します
        const result = {
            prompt: content,
            category: "Sample Category",
            reason: "This is a sample reason based on content analysis."
        };

        this.appendCategoryResult(result);

        return result;
    }

    private appendCategoryResult(result: CategoryGetResult) {
        if (this.saveSheet) {
            const lastRow = this.saveSheet.getLastRow();
            this.saveSheet.appendRow([
                result.prompt,
                result.category,
                result.reason
            ]);
        }
        this.existingResults.push(result);
    }

    private getCategoryResultFromSaveSheet() : Array<CategoryGetResult> {
        const results: Array<CategoryGetResult> = [];
        if (this.saveSheet) {
            const values = this.saveSheet.getDataRange().getValues();
            for (let i = 1; i < values.length; i++) { // ヘッダー行をスキップ
                results.push({
                    prompt: String(values[i][0]),
                    category: String(values[i][1]),
                    reason: String(values[i][2])
                });
            }
        }
        return results;
    }

    getCategory(content: string): CategoryGetResult {
        const categoryFromGemini = this.callGeminiToGetCategory(content);
        return categoryFromGemini;
    }

}