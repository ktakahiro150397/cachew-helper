import { CategoryItem } from '../interface/MasterSheet'

const categoryMasterString = [
  '🍔 食費',
  '🧹 日用品',
  '⛺️ 趣味・娯楽',
  '☕️ 交際費',
  '🚃 交通費',
  '👕 衣服・美容',
  '🏥 健康・医療',
  '🚙 自動車',
  '🎓 教養・教育',
  '❗️ 特別な支出',
  '💳 現金・カード',
  '🚰 水道光熱費',
  '🛜 通信費',
  '🏠 住宅',
  '💲 税・社会保障',
  '💊 保険',
  '📱 サブスク費',
  '📅 年会費',
  '📠 家具・家電',
  '❓ その他',
  '❓ 予備費',
  '💰 収入',
  '💰 配当金',
  '💰 副業',
  '💰 残業',
  '💰 賞与',
  '💰 臨時収入',
  '💪 自己投資',
  '💵 株式投資',
  '❓ 不明',
  '💵 送金'
]

export const categoryMasterForLocal: Array<CategoryItem> =
  categoryMasterString.map(category => ({ category: category }))
