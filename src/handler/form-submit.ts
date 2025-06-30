
export function onFormSubmit(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {
  // フォーム送信イベントからデータを取得
  const formData = e.values;

  // 送信されたデータをログに出力
  Logger.log("フォーム送信データ: " + JSON.stringify(formData));

  // フォーム送信データ: 
  // [
  // "2025/06/30 16:58:55",
  // "共有マスターカード",
  // "https://drive.google.com/open?id=xxxxxxxxx",
  // "xxxxxxxxx@gmail.com"
  // ]
}