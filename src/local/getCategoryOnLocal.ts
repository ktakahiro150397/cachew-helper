// ローカル実行用のカテゴリ取得処理

import { CategoryGetterFromGeminiLocal } from '../core/category/getCategoryFromGeminiLocal'
import { categoryMasterForLocal } from './categoryMasterForLocal'
import { existingResultsForLocal } from './existingResultsForLocal'
import { getCategoryTargetForLocal } from './getCategoryTargetContents'
import fs from 'fs'
// ローカル実行時用のログ出力処理上書き
;(globalThis as any).Logger = {
  log: console.log
}
;(globalThis as any).Utilities = {
  sleep: (ms: number) => {
    // 同期的なsleep実装
    const start = Date.now()
    while (Date.now() - start < ms) {
      // 同期的に待機
    }
  }
}

async function main () {
  console.log('カテゴリ取得(ローカル実行)')

  // const response = await fetch('https://www.google.com')
  // console.log(`Fetch test response status: ${response.status}`)

  // const result = await response.text()
  // console.log(`Fetch test response text: ${result}`)

  const categoryGetter = new CategoryGetterFromGeminiLocal(
    'AIzaSyB0yEB_MZxL_mCn13rbr3G_2tBK-4bsJNI',
    categoryMasterForLocal,
    existingResultsForLocal
  )

  const result = await categoryGetter.getCategory(getCategoryTargetForLocal[0])
  console.log(result)

  // // 対象の文字列に対してカテゴリを取得し、タブ区切りでローカルに保存
  // const path = 'category_results_local.tsv'
  // const writeStream = fs.createWriteStream(path, { flags: 'a' })
  // writeStream.write('Content\tCategory\tReason\n') // ヘッダー行

  // for (const content of getCategoryTargetForLocal) {
  //   const result = categoryGetter.getCategory(content)
  //   writeStream.write(
  //     `${result.prompt}\t${result.category}\t${result.reason}\n`
  //   )
  //   console.log(
  //     `Content: ${result.prompt}, Category: ${result.category}, Reason: ${result.reason}`
  //   )
  // }
  // writeStream.end()

  // console.log(`結果を ${path} に保存しました。`)
  // console.log('カテゴリ取得(ローカル実行) 終了')
}

main()
