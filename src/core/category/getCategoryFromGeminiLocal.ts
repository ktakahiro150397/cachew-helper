import { CategoryItem } from '../../interface/MasterSheet'
import {
  CategoryGetResult,
  CategoryGetResultRaw,
  CategoryGetterFromGemini
} from './getCategoryFromGemini'
import { GoogleGenAI, Type } from '@google/genai'

export class CategoryGetterFromGeminiLocal extends CategoryGetterFromGemini {
  // private prompt: string = ``
  // private existingResults: Array<CategoryGetResult> = []

  // private readonly model = 'gemini-2.0-flash'
  // private readonly maxRetries = 3
  // private readonly RateLimitDelay = 60 // 秒

  // private apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:streamGenerateContent?key=${this.apiKey}`

  // static GetGeminiAPIKeyFromMasterSheet (
  //   masterSheet: GoogleAppsScript.Spreadsheet.Sheet
  // ): string {
  //   // B2セルにAPIキーが記載
  //   return String(masterSheet.getRange('B2').getValue()).trim()
  // }

  private ai: GoogleGenAI
  private config = {
    temperature: 0,
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      required: ['category', 'reason'],
      properties: {
        category: {
          type: Type.STRING
        },
        reason: {
          type: Type.STRING
        }
      }
    }
  }

  constructor (
    apiKey: string,
    categoryMaster: Array<CategoryItem>,
    existingResults: Array<CategoryGetResult> = []
  ) {
    super(apiKey, null, categoryMaster)

    // 現在の保存シートの内容を読み込み
    this.existingResults = existingResults
    Logger.log(
      `既存のカテゴリ取得結果を読み込み: ${this.existingResults.length} 件`
    )

    this.ai = new GoogleGenAI({ apiKey: this.apiKey })
  }

  protected override callGeminiToGetCategory (
    content: string
  ): CategoryGetResult {
    console.log(`Calling Gemini API for content: ${content}`)

    // 同期的にPromiseを待機（ブロッキング）
    let result: CategoryGetResult | undefined
    let error: Error | undefined

    console.log(`callGeminiToGetCategoryInner start`)
    this.callGeminiToGetCategoryInner(content)
      .then(res => {
        console.log(`callGeminiToGetCategoryInner success`)
        result = res
      })
      .catch(err => {
        console.log(`callGeminiToGetCategoryInner error: ${err}`)
        error = err
      })

    // ビジーウェイトでPromiseの完了を待つ（非推奨）
    while (result === undefined && error === undefined) {
      console.log(`Waiting for Gemini API response...`)
      Utilities.sleep(1000) // 1000ms待機
    }

    if (error) throw error
    return result!
  }

  private async callGeminiToGetCategoryInner (
    content: string
  ): Promise<CategoryGetResult> {
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

    let combinedContent = ''
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      // エクスポネンシャルバックオフ
      if (attempt > 1) {
        const delay = Math.pow(2, attempt) * 1000 // ミリ秒
        Logger.log(`Retrying after ${delay} ms...`)
        Utilities.sleep(delay)
      }

      try {
        console.log(`API URL: ${this.apiUrl}`)
        console.log(
          `Payload: ${JSON.stringify(this.createGeminiApiPayload(this.prompt))}`
        )

        // URLへリクエストを送信し、レスポンスを取得する
        console.log(`Waiting for fetch response...`)
        const response = await this.ai.models.generateContentStream({
          model: this.model,
          config: this.config
          content: [
            {
              role: "user",
              parts: [
                text: this.prompt,
              ]
            }
          ]
        })


        console.log(`Fetch response received.`)
        const response = await fetch(this.apiUrl, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.createGeminiApiPayload(this.prompt))
        })
        console.log(`Fetch response received.`)

        if (!response.ok) {
          if (response.status === 429) {
            // レート制限エラーの場合、一定時間待機してリトライ
            Logger.log(
              `Rate limit exceeded. Waiting for ${this.RateLimitDelay} seconds before retrying...`
            )
            Utilities.sleep(this.RateLimitDelay * 1000)
            continue
          } else {
            throw new Error(
              `Error from Gemini API: ${response.status} ${response.statusText}`
            )
          }
        }

        // レスポンスをJSONとしてパース（配列形式）
        const responseArray = await response.json()

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

  protected override appendCategoryResult (result: CategoryGetResult) {
    this.existingResults.push(result)
  }

  getCategory (content: string): CategoryGetResult {
    const categoryFromGemini = this.callGeminiToGetCategory(content)
    return categoryFromGemini
  }
}
