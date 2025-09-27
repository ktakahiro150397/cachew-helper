import { CategoryItem } from '../../interface/MasterSheet'

export interface CategoryGetResultRaw {
  category: string
  reason: string
}

export interface CategoryGetResult {
  prompt: string
  category: string
  reason: string
}

export interface CategoryGetter {
  getCategory(content: string): CategoryGetResult
}

export abstract class CategoryGetterBase implements CategoryGetter {
  constructor (protected categoryMaster: Array<CategoryItem>) {}

  abstract getCategory(content: string): CategoryGetResult
}

export class CategoryGetterFromGemini extends CategoryGetterBase {
  protected prompt: string = ``
  protected existingResults: Array<CategoryGetResult> = []

  protected readonly model = 'gemini-2.0-flash'
  protected readonly maxRetries = 3
  protected readonly RateLimitDelay = 60 // 秒

  protected apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?key=${this.apiKey}`

  static GetGeminiAPIKeyFromMasterSheet (
    masterSheet: GoogleAppsScript.Spreadsheet.Sheet
  ): string {
    // B2セルにAPIキーが記載
    return String(masterSheet.getRange('B2').getValue()).trim()
  }

  constructor (
    protected apiKey: string,
    private saveSheet: GoogleAppsScript.Spreadsheet.Sheet | null = null,
    categoryMaster: Array<CategoryItem>
  ) {
    super(categoryMaster)

    // 現在の保存シートの内容を読み込み
    this.existingResults = this.getCategoryResultFromSaveSheet()
    Logger.log(
      `既存のカテゴリ取得結果を読み込み: ${this.existingResults.length} 件`
    )
  }

  protected callGeminiToGetCategory (content: string): CategoryGetResult {
    // Gemini APIを呼び出してカテゴリを取得するロジックを実装
    this.prompt = `以下のカテゴリマスタを参考に、与えられた内容に最も適したカテゴリを選択してください。
カテゴリマスタ:
${this.categoryMaster.map(item => `- ${item.category}`).join('\n')}

以下の情報を参考にしてください。
- 「CT」から始まるもの:「ことら送金」の略称です。
- 「ﾆﾎﾝｶﾞｸｾｲｼｴﾝｷｺｳ」：ローンです。
- スーパーマーケット：「食費」です。

上記ルールでもどうしても不明な場合はさらに以下のルールを参照してください。
- どこかに振込を行っていると思われるもの：「送金」です。(ただし、どこかから振込を受けている場合は「送金」を選択しないでください)
- 銀行名が含まれるもの：「送金」です。

不明な場合は「不明」を選択してください。

内容:
${content}

上記の内容に基づいて、最も適したカテゴリを一つ選び、その理由を簡潔に説明してください。`

    // 既に同じ内容で取得した結果があれば、それを返す
    const existing = this.existingResults.find(res => res.prompt === content)
    if (existing) {
      //   Logger.log(`既存の結果を使用: ${JSON.stringify(existing)}`)
      return existing
    }

    // ここでは仮の実装として、contentに基づいてカテゴリを決定する例を示します
    const payload = this.createGeminiApiPayload(this.prompt)
    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    }

    let combinedContent = ''

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      // エクスポネンシャルバックオフ
      if (attempt > 1) {
        const delay = Math.pow(2, attempt) * 1000 // ミリ秒
        Logger.log(`Retrying after ${delay} ms...`)
        Utilities.sleep(delay)
      }

      try {
        const response = UrlFetchApp.fetch(this.apiUrl, options)

        if (response.getResponseCode() === 429) {
          // レート制限エラー
          Logger.log(
            `Rate limit exceeded. Retrying after ${this.RateLimitDelay}s...`
          )
          Utilities.sleep(this.RateLimitDelay * 1000)
          continue
        }

        const responseText = response.getContentText()

        // レスポンスをJSONとしてパース（配列形式）
        const responseArray = JSON.parse(responseText)

        // 各チャンクからtextを抽出して結合
        combinedContent = ''
        if (Array.isArray(responseArray)) {
          for (const chunk of responseArray) {
            if (
              chunk.candidates &&
              chunk.candidates[0]?.content?.parts[0]?.text
            ) {
              combinedContent += chunk.candidates[0].content.parts[0].text
            }
          }
        }

        break // 成功したらループを抜ける
      } catch (error) {
        Logger.log(`Error calling Gemini API: ${(error as Error).message}`)

        if (attempt === this.maxRetries) {
          throw new Error(
            `Gemini APIの呼び出しに失敗しました: ${(error as Error).message}`
          )
        }
      }
    }

    if (!combinedContent) {
      throw new Error('Gemini APIからの応答が空です。')
    }

    let parsedResponse: CategoryGetResultRaw
    try {
      parsedResponse = JSON.parse(combinedContent)

      const result = {
        prompt: content,
        category: parsedResponse.category,
        reason: parsedResponse.reason
      }

      this.appendCategoryResult(result)
      //   Logger.log(`取得結果: ${JSON.stringify(result)}`)
      return result
    } catch (parseError) {
      throw new Error(`Gemini APIの応答のパースに失敗しました: ${parseError}`)
    }
  }

  protected createGeminiApiPayload (prompt: string): object {
    return {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string'
            },
            reason: {
              type: 'string'
            }
          },
          propertyOrdering: ['category', 'reason']
        }
      }
    }
  }

  protected appendCategoryResult (result: CategoryGetResult) {
    if (this.saveSheet) {
      const lastRow = this.saveSheet.getLastRow()
      this.saveSheet.appendRow([result.prompt, result.category, result.reason])
    }
    this.existingResults.push(result)
  }

  private getCategoryResultFromSaveSheet (): Array<CategoryGetResult> {
    const results: Array<CategoryGetResult> = []
    if (this.saveSheet) {
      const values = this.saveSheet.getDataRange().getValues()
      for (let i = 1; i < values.length; i++) {
        // ヘッダー行をスキップ
        results.push({
          prompt: String(values[i][0]),
          category: String(values[i][1]),
          reason: String(values[i][2])
        })
      }
    }
    return results
  }

  getCategory (content: string): CategoryGetResult {
    const categoryFromGemini = this.callGeminiToGetCategory(content)
    return categoryFromGemini
  }
}
