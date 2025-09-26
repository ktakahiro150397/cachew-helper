import { IdealSheetRow } from '../../interface/IdealSheet'
import { CategoryGetter } from './getCategoryFromGemini'

export function setCategory (
  ideal: GoogleAppsScript.Spreadsheet.Sheet,
  categoryGetter: CategoryGetter
) {
  if (!ideal) {
    throw new Error('データデータが見つかりません。')
  }

  const sheetValues = ideal.getDataRange().getValues()

  const invokeDate = Date.now()
  const elapsedSecondForTrigger = 300 // 5分以内におさめる

  for (let i = 1; i < sheetValues.length; i++) {
    // トリガー制限回避のため、5分以上経過していたら処理を中断する
    if (Date.now() - invokeDate > elapsedSecondForTrigger * 1000) {
      Logger.log(
        `処理時間が${elapsedSecondForTrigger}秒を超えたため、処理を中断します。`
      )
      setTrigger()
      break
    }

    const row = new IdealSheetRow(
      new Date(String(sheetValues[i][0])),
      sheetValues[i][1] as any,
      String(sheetValues[i][2]).trim(),
      String(sheetValues[i][3]).trim(),
      parseFloat(String(sheetValues[i][4])),
      String(sheetValues[i][5]).trim()
    )

    if (row.category != '') {
      // カテゴリが設定されている場合はスキップ
      Logger.log(`カテゴリが設定されているためスキップ: ${row.category}`)
      continue
    }

    // V\d\d\d\d\d... の部分を除去する
    row.content = row.content.replace(/V\d{1,}/g, '').trim()

    // カテゴリが未設定の場合のみカテゴリを設定する
    const promptCategory = `# 摘要 
${row.content}`

    const categoryFromContent = categoryGetter.getCategory(promptCategory)
    ideal.getRange(i + 1, 3).setValue(categoryFromContent.category) // カテゴリ列（C列）のみ更新
  }
}

function setTrigger () {
  let triggers = ScriptApp.getProjectTriggers()
  for (let i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'convertDataToIdealSheet') {
      ScriptApp.deleteTrigger(triggers[i])
    }
  }
  // 1分後にトリガーをセット(1分 = 60秒 = 1秒*60 = 1000ミリ秒 * 60)
  ScriptApp.newTrigger('convertDataToIdealSheet')
    .timeBased()
    .after(1000 * 60)
    .create()
}
