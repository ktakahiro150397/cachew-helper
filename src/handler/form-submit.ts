
export function onFormSubmitTest() {
    // テスト用のフォーム送信イベントデータを作成
    const mockEvent: GoogleAppsScript.Events.SheetsOnFormSubmit = {
        values: [
            "2025/06/30 16:58:55",
            "共有マスターカード",
            "https://drive.google.com/open?id=xxxxxxxxx", // 画像URLは複数の場合、カンマ区切り
            "xxxxxxxxx@gmail.com"
        ],
        namedValues: {
            "タイムスタンプ": ["2025/06/30 16:58:55"],
            "支払い方法": ["共有マスターカード"],
            "レシート画像URL": ["https://drive.google.com/open?id=xxxxxxxxx"],
            "メールアドレス": ["xxxxxxxxx@gmail.com"]
        },
        range: SpreadsheetApp.getActiveSpreadsheet().getSheetByName("レシート登録フォームの回答")!.getRange("A2:D2"),
        authMode: ScriptApp.AuthMode.FULL,
        triggerUid: "1234567890",
        user: Session.getActiveUser(),
    }

    onFormSubmit(mockEvent);
    Logger.log("テスト完了: フォーム送信イベントを処理しました。");
}

export function onFormSubmit(e: GoogleAppsScript.Events.SheetsOnFormSubmit) {

  // フォーム列構成
  // [タイムスタンプ, 支払い方法, レシート画像URL(カンマ区切り), メールアドレス, 備考, 予約済み1, 予約済み2, 予約済み3, レシートID, 処理済みフラグ]

  // フォーム送信イベントからデータを取得
  const formData = e.values;

  // 送信されたデータをログに出力
  Logger.log("フォーム送信データ: " + JSON.stringify(formData));


  // 処理対象シート「レシート登録フォームの回答」
  // 未処理データに対して以下の処理を行う
  // 1.データにIDを付与
  // 2.画像を取得してOCR結果を取得
  // 3.結果を「③入力_レシート」シートに追加
  // 4.処理済みマークをレシートデータに付与

  // フォーム送信データ: 
  // [
  // "2025/06/30 16:58:55",
  // "共有マスターカード",
  // "https://drive.google.com/open?id=xxxxxxxxx", // 画像URLは複数の場合、カンマ区切り
  // "xxxxxxxxx@gmail.com"
  // ]


  // 未処理データ列の抽出
  const formSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("レシート登録フォームの回答");
  if (!formSheet) {
    Logger.log("レシート登録フォームの回答シートが見つかりません。");
    return;
  }

  const lastRow = formSheet.getLastRow();
    if (lastRow < 2) {
    Logger.log("レシート登録フォームの回答シートにデータがありません。");
    return;
    }

    const formDataRange = formSheet.getRange(2, 1, lastRow - 1, formSheet.getLastColumn());
    const formDataValues = formDataRange.getValues();

    // データの処理
    for (let i = 0; i < formDataValues.length; i++) {
        // 処理済みフラグがtrueでない行を抽出
        if (formDataValues[i][9] == true) {
            Logger.log("行 " + (i + 2) + " はすでに処理済みです。スキップします。");
            continue;
        }

        // 画像URLそれぞれに対して処理を行う
        const imageUrl = formDataValues[i][2].split(",");
        if (imageUrl.length === 0 || imageUrl[0].trim() === "") {
            Logger.log("行 " + (i + 2) + " の画像URLが空です。スキップします。");
            continue;
        }

        for(let j = 0; j < imageUrl.length; j++) {
             const receiptId = Utilities.getUuid(); // このレシートのIDを生成

             // レシート画像の取得
            const imageBlob = UrlFetchApp.fetch(imageUrl[j].trim()).getBlob();

            // 2.画像を取得してOCR結果を取得
            const ocrResult = performOCR(imageBlob);

            // 3.結果を「③入力_レシート」シートに追加
            const receiptSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("③入力_レシート");
            if (!receiptSheet) {
                Logger.log("③入力_レシートシートが見つかりません。");
                return;
            }

            const writeData = ocrResult.getWriteData();
            for (const rowData of writeData) {
                receiptSheet.appendRow(rowData);
            }
            Logger.log("OCR結果を「③入力_レシート」シートに追加しました。");
        }

        // 4.処理済みマークをレシートデータに付与
        formSheet.getRange(i + 2, 10).setValue(true);           
    }
}

class OCRResult {
    constructor(
        public date: string,
        public details: Array<{name: string, price: number}>,
        public note: string,
        public ocr_warning: string,
        public price_sum: number,
        public store_name: string
    ) {}

    public getWriteData(): Array<any> {
        const ret = [];
        for(const detail of this.details) {
            const rowData = [
                this.date,
                this.store_name,
                detail.name,
                detail.price,
                this.note,
                this.ocr_warning,
            ]

            ret.push(rowData);
        }
        return ret;
    }
}


function performOCR(imageBlob: GoogleAppsScript.Base.Blob): OCRResult {
    return new OCRResult(
        "2024/09/21",
        [
            {"name": "レギュラー+70", "price": 300}, 
            {"name": "ポテトM", "price": 360}, 
            {"name": "ミネストローネ", "price": -140}, 
            {"name": "レギュラーセットM", "price": 300}, 
            {"name": "オニオン&ポテト", "price": 270}, 
            {"name": "メロンM", "price": -120}, 
            {"name": "テリヤキチキン", "price": 450}, 
            {"name": "モスバーガー", "price": 440}
        ],
        "どっちもおいしい月見です♪パリとろ食感の、月見。サクじゅわ食感の、裏月見。",
        "なし",
        1860,
        "MOS BURGER 神戸伊川谷店"
    );
}