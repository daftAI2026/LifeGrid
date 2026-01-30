/**
 * [INPUT]: 无依赖
 * [OUTPUT]: i18n 全局对象，提供 get(key) 方法获取当前语言翻译
 * [POS]: data/ 的翻译字符串管理模块，被 i18n-loader.js 和 app.js 消费
 * [PROTOCOL]: 新增翻译时更新此文件，然后检查语言完整性
 */

export const i18nData = {
  en: {
    // Navigation
    'nav.title': 'LifeGrid',
    'nav.wallpapers': 'Wallpapers',
    'nav.customize': 'Customize',
    'nav.setup': 'Setup',
    'nav.github': 'GitHub',

    // Hero Section
    'hero.eyebrow': 'Dynamic Wallpapers',
    'hero.title': 'Your time.',
    'hero.titleAccent': 'Visualized.',
    'hero.subtitle': 'Wallpapers that update daily. Track your year, your life, or countdown to your goals.',
    'hero.cta': 'Get Started',

    // Types Section
    'types.header': 'Choose Your Style',
    'types.title': 'Three ways to see your time',

    // Year Card
    'type.year.name': 'Year Progress',
    'type.year.description': 'Every day of the year as a grid. Watch your year fill up, one square at a time.',
    'type.year.statDay': 'Day',
    'type.year.statWeek': 'Week',
    'type.year.statComplete': 'Complete',

    // Life Card
    'type.life.name': 'Life Calendar',
    'type.life.description': 'Every week of your life as a dot. A powerful reminder to make each week count.',
    'type.life.statWeeks': 'Total Weeks',
    'type.life.statYears': 'Years',

    // Goal Card
    'type.goal.name': 'Goal Countdown',
    'type.goal.description': 'Count down to what matters. Big launch, vacation, or life milestone.',
    'type.goal.statGoals': 'Goals',
    'type.goal.statUpdates': 'Daily Updates',

    // Common Button
    'button.select': 'Select',

    // Customize Section
    'customize.header': 'Personalize',
    'customize.title': 'Make it yours',
    'customize.selected': 'Selected:',
    'customize.selectedNone': 'None',

    // Config Groups
    'config.location': 'Location',
    'config.locationHint': 'For accurate timezone',
    'config.dateOfBirth': 'Date of Birth',
    'config.dateOfBirthHint': '(Optional)',
    'config.lifespan': 'Lifespan',
    'config.lifespanHint': '(Expected years)',
    'config.goalName': 'Goal Name',
    'config.targetDate': 'Target Date',
    'config.colors': 'Colors',
    'config.background': 'Background',
    'config.accent': 'Accent',
    'config.colorPresets': 'Presets',
    'config.device': 'Device',
    'config.deviceResolution': 'Resolution',
    'config.url': 'Your Wallpaper URL',

    // Color Presets
    'preset.classic': 'Classic',
    'preset.gold': 'Gold',
    'preset.cyan': 'Cyan',
    'preset.red': 'Red',
    'preset.green': 'Green',

    // Preview
    'preview.hint': 'Live Preview',
    'preview.selectType': 'Select a wallpaper type',

    // URL & Copy
    'url.copy': 'Copy',
    'url.copied': 'Copied!',
    'url.placeholder': 'Configure options above...',

    // Setup Section
    'setup.header': 'Almost There',
    'setup.title': 'Set it and forget it',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // Setup Steps - iOS
    'setup.ios.step1': 'Copy URL',
    'setup.ios.step1Desc': 'Configure your wallpaper above and copy the generated URL',
    'setup.ios.step2': 'Create Automation',
    'setup.ios.step2Desc': 'Shortcuts App → Automation Tab → New Automation<br>Time of Day: <strong>6:00 AM</strong> → Repeat <strong>Daily</strong><br>Select <strong>Run Immediately</strong> → Create New Shortcut',
    'setup.ios.step3': 'Configure Shortcut',
    'setup.ios.step3Desc': '<strong>1. Get Contents of URL:</strong><br><span class="code-snippet">https://lifegrid.aradhyaxstudy.workers.dev/generate?...</span><br><br><strong>2. Set Wallpaper Photo:</strong><br>Choose "Lock Screen" as the target.',
    'setup.ios.step4': 'Finalize',
    'setup.ios.step4Desc': 'In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong>',
    'setup.ios.step4Warning': 'In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong>',

    // Setup Steps - Android
    'setup.android.step1': 'Copy URL',
    'setup.android.step1Desc': 'Configure your wallpaper above and copy the generated URL',
    'setup.android.step2': 'Prerequisites',
    'setup.android.step2Desc': 'Install <strong>MacroDroid</strong> from Google Play Store.',
    'setup.android.step3': 'Setup Macro',
    'setup.android.step3Desc': 'Trigger: Date/Time → Day/Time (00:01:00) → Active all weekdays',
    'setup.android.step4': 'Configure Actions',
    'setup.android.step4Desc': '<strong>4.1 Download Image</strong><br>Web Interactions → HTTP Request (GET)<br>Paste URL. Enable "Block next actions"<br>Tick "Save response" → <span class="code-snippet">/Download/lifegrid.png</span><br><br><strong>4.2 Set Wallpaper</strong><br>Device Settings → Set Wallpaper<br>Select <span class="code-snippet">/Download/lifegrid.png</span><br><br><span class="highlight-badge">⚠ Use exact same filename</span>',
    'setup.android.step5': 'Finalize',
    'setup.android.step5Desc': 'Give macro a name → Tap <strong>Create Macro</strong>',

    // Footer
    'footer.tagline': 'Time, visualized.',

    // Language Selector
    'lang.select': 'Language',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',

    // Goal-related
    'goal.dayLeft': 'day left',
    'goal.daysLeft': 'days left',

    // Debug messages
    'debug.autoDetectFailed': 'Could not auto-detect country',
    'debug.copyFailed': 'Failed to copy:',
  },

  'zh-CN': {
    // 导航
    'nav.title': 'LifeGrid',
    'nav.wallpapers': '壁纸',
    'nav.customize': '自定义',
    'nav.setup': '设置',
    'nav.github': 'GitHub',

    // 英雄部分
    'hero.eyebrow': '动态壁纸',
    'hero.title': '你的时间',
    'hero.titleAccent': '可视化',
    'hero.subtitle': '每日更新的壁纸。追踪你的一年、你的人生，或倒计时到你的目标。',
    'hero.cta': '开始使用',

    // 类型部分
    'types.header': '选择你的风格',
    'types.title': '三种观看时间的方式',

    // 年进度卡
    'type.year.name': '年度进度',
    'type.year.description': '365 天网格一览。眼见你的年度逐日填满。',
    'type.year.statDay': '天',
    'type.year.statWeek': '周',
    'type.year.statComplete': '完成度',

    // 生命日历卡
    'type.life.name': '生命日历',
    'type.life.description': '将人生的每一周化作点阵。每一周都值得铭记。',
    'type.life.statWeeks': '总周数',
    'type.life.statYears': '年',

    // 目标倒计时卡
    'type.goal.name': '目标倒计时',
    'type.goal.description': '倒数时光。为产品发布、假期或人生里程碑而准备。',
    'type.goal.statGoals': '目标',
    'type.goal.statUpdates': '每日更新',

    // 通用按钮
    'button.select': '选择',

    // 自定义部分
    'customize.header': '个性化',
    'customize.title': '让它成为你的',
    'customize.selected': '已选择：',
    'customize.selectedNone': '无',

    // 配置组
    'config.location': '位置',
    'config.locationHint': '用于准确的时区',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（可选）',
    'config.lifespan': '预期寿命',
    'config.lifespanHint': '（预期年数）',
    'config.goalName': '目标名称',
    'config.targetDate': '目标日期',
    'config.colors': '颜色',
    'config.background': '背景',
    'config.accent': '强调色',
    'config.colorPresets': '预设',
    'config.device': '设备',
    'config.deviceResolution': '分辨率',
    'config.url': '你的壁纸 URL',

    // 颜色预设
    'preset.classic': '经典',
    'preset.gold': '金色',
    'preset.cyan': '青色',
    'preset.red': '红色',
    'preset.green': '绿色',

    // 预览
    'preview.hint': '实时预览',
    'preview.selectType': '选择一种壁纸类型',

    // URL 和复制
    'url.copy': '复制',
    'url.copied': '已复制！',
    'url.placeholder': '在上方配置选项...',

    // 设置部分
    'setup.header': '即将完成',
    'setup.title': '设置一次，永久使用',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 设置步骤 - iOS
    'setup.ios.step1': '复制 URL',
    'setup.ios.step1Desc': '在上方配置你的壁纸并复制生成的 URL',
    'setup.ios.step2': '创建自动化',
    'setup.ios.step2Desc': '快捷指令应用 → 自动化标签 → 新建自动化<br>时间：<strong>上午 6:00</strong> → 重复 <strong>每天</strong><br>选择 <strong>立即运行</strong> → 创建新快捷指令',
    'setup.ios.step3': '配置快捷指令',
    'setup.ios.step3Desc': '<strong>1. 获取 URL 的内容：</strong><br><span class="code-snippet">https://lifegrid.aradhyaxstudy.workers.dev/generate?...</span><br><br><strong>2. 设置墙纸：</strong><br>选择"锁屏"作为目标。',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '在"设置墙纸"中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong>',
    'setup.ios.step4Warning': '在"设置墙纸"中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong>',

    // 设置步骤 - Android
    'setup.android.step1': '复制 URL',
    'setup.android.step1Desc': '在上方配置你的壁纸并复制生成的 URL',
    'setup.android.step2': '前置条件',
    'setup.android.step2Desc': '从 Google Play Store 安装 <strong>MacroDroid</strong>',
    'setup.android.step3': '设置宏',
    'setup.android.step3Desc': '触发器：日期/时间 → 天/时间 (00:01:00) → 在每个工作日启用',
    'setup.android.step4': '配置动作',
    'setup.android.step4Desc': '<strong>4.1 下载图片</strong><br>网络交互 → HTTP 请求 (GET)<br>粘贴 URL。启用"阻止下一个动作"<br>勾选"保存响应" → <span class="code-snippet">/Download/lifegrid.png</span><br><br><strong>4.2 设置墙纸</strong><br>设备设置 → 设置墙纸<br>选择 <span class="code-snippet">/Download/lifegrid.png</span><br><br><span class="highlight-badge">⚠ 使用相同的文件名</span>',
    'setup.android.step5': '完成',
    'setup.android.step5Desc': '给宏起个名字 → 点击 <strong>创建宏</strong>',

    // 页脚
    'footer.tagline': '时间，可视化。',

    // 语言选择器
    'lang.select': '语言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',

    // 目标相关
    'goal.dayLeft': '天剩余',
    'goal.daysLeft': '天剩余',

    // 调试信息
    'debug.autoDetectFailed': '无法自动检测国家',
    'debug.copyFailed': '复制失败：',
  },

  'zh-TW': {
    // 導航
    'nav.title': 'LifeGrid',
    'nav.wallpapers': '桌布',
    'nav.customize': '自訂',
    'nav.setup': '設定',
    'nav.github': 'GitHub',

    // 英雄部分
    'hero.eyebrow': '動態桌布',
    'hero.title': '你的時間',
    'hero.titleAccent': '視覺化',
    'hero.subtitle': '每日更新的桌布。追蹤你的一年、你的人生，或倒數計時到你的目標。',
    'hero.cta': '開始使用',

    // 類型部分
    'types.header': '選擇你的風格',
    'types.title': '三種觀看時間的方式',

    // 年進度卡
    'type.year.name': '年度進度',
    'type.year.description': '365 天網格一覽。眼見你的年度逐日填滿。',
    'type.year.statDay': '天',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 生命日曆卡
    'type.life.name': '生命日曆',
    'type.life.description': '將人生的每一週化作點陣。每一週都值得銘記。',
    'type.life.statWeeks': '總週數',
    'type.life.statYears': '年',

    // 目標倒計時卡
    'type.goal.name': '目標倒計時',
    'type.goal.description': '倒數時光。為產品發佈、假期或人生里程碑而準備。',
    'type.goal.statGoals': '目標',
    'type.goal.statUpdates': '每日更新',

    // 通用按鈕
    'button.select': '選擇',

    // 自訂部分
    'customize.header': '個人化',
    'customize.title': '讓它成為你的',
    'customize.selected': '已選擇：',
    'customize.selectedNone': '無',

    // 配置組
    'config.location': '位置',
    'config.locationHint': '用於準確的時區',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（選擇性）',
    'config.lifespan': '預期壽命',
    'config.lifespanHint': '（預期年數）',
    'config.goalName': '目標名稱',
    'config.targetDate': '目標日期',
    'config.colors': '顏色',
    'config.background': '背景',
    'config.accent': '強調色',
    'config.colorPresets': '預設',
    'config.device': '裝置',
    'config.deviceResolution': '解析度',
    'config.url': '你的桌布 URL',

    // 顏色預設
    'preset.classic': '經典',
    'preset.gold': '金色',
    'preset.cyan': '青色',
    'preset.red': '紅色',
    'preset.green': '綠色',

    // 預覽
    'preview.hint': '即時預覽',
    'preview.selectType': '選擇一種桌布類型',

    // URL 和複製
    'url.copy': '複製',
    'url.copied': '已複製！',
    'url.placeholder': '在上方設定選項...',

    // 設定部分
    'setup.header': '即將完成',
    'setup.title': '設定一次，永久使用',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 設定步驟 - iOS
    'setup.ios.step1': '複製 URL',
    'setup.ios.step1Desc': '在上方設定你的桌布並複製產生的 URL',
    'setup.ios.step2': '建立自動化',
    'setup.ios.step2Desc': '捷徑應用 → 自動化標籤 → 新建自動化<br>時間：<strong>上午 6:00</strong> → 重複 <strong>每天</strong><br>選擇 <strong>立即執行</strong> → 建立新捷徑',
    'setup.ios.step3': '設定捷徑',
    'setup.ios.step3Desc': '<strong>1. 取得 URL 的內容：</strong><br><span class="code-snippet">https://lifegrid.aradhyaxstudy.workers.dev/generate?...</span><br><br><strong>2. 設定桌布：</strong><br>選擇「鎖定螢幕」作為目標。',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '在「設定桌布」中，點擊箭頭 (→)：<br>關閉 <strong>裁切到主體</strong><br>關閉 <strong>顯示預覽</strong>',
    'setup.ios.step4Warning': '在「設定桌布」中，點擊箭頭 (→)：<br>關閉 <strong>裁切到主體</strong><br>關閉 <strong>顯示預覽</strong>',

    // 設定步驟 - Android
    'setup.android.step1': '複製 URL',
    'setup.android.step1Desc': '在上方設定你的桌布並複製產生的 URL',
    'setup.android.step2': '前置條件',
    'setup.android.step2Desc': '從 Google Play Store 安裝 <strong>MacroDroid</strong>',
    'setup.android.step3': '設定巨集',
    'setup.android.step3Desc': '觸發條件：日期/時間 → 天/時間 (00:01:00) → 在每個工作日啟用',
    'setup.android.step4': '設定動作',
    'setup.android.step4Desc': '<strong>4.1 下載圖片</strong><br>網路互動 → HTTP 請求 (GET)<br>貼上 URL。啟用「阻止下一個動作」<br>勾選「保存回應」 → <span class="code-snippet">/Download/lifegrid.png</span><br><br><strong>4.2 設定桌布</strong><br>裝置設定 → 設定桌布<br>選擇 <span class="code-snippet">/Download/lifegrid.png</span><br><br><span class="highlight-badge">⚠ 使用相同的檔案名稱</span>',
    'setup.android.step5': '完成',
    'setup.android.step5Desc': '給巨集起個名稱 → 點擊 <strong>建立巨集</strong>',

    // 頁腳
    'footer.tagline': '時間，可視化。',

    // 語言選擇器
    'lang.select': '語言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',

    // 目標相關
    'goal.dayLeft': '天',
    'goal.daysLeft': '天',

    // 調試訊息
    'debug.autoDetectFailed': '無法自動偵測國家',
    'debug.copyFailed': '複製失敗：',
  },

  ja: {
    // ナビゲーション
    'nav.title': 'LifeGrid',
    'nav.wallpapers': '壁紙',
    'nav.customize': 'カスタマイズ',
    'nav.setup': 'セットアップ',
    'nav.github': 'GitHub',

    // ヒーローセクション
    'hero.eyebrow': 'ダイナミック壁紙',
    'hero.title': 'あなたの時間を',
    'hero.titleAccent': 'ビジュアル化',
    'hero.subtitle': '毎日更新される壁紙。あなたの1年、人生、または目標までのカウントダウンを追跡します。',
    'hero.cta': '開始する',

    // タイプセクション
    'types.header': 'スタイルを選択',
    'types.title': '時間を見る3つの方法',

    // 年進度カード
    'type.year.name': '年進度',
    'type.year.description': '365日をグリッドで一覧。毎日が積み重なっていく様を眼で見守ってください。',
    'type.year.statDay': '日',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 人生カレンダーカード
    'type.life.name': '人生カレンダー',
    'type.life.description': '人生の毎週をドット化。毎週の価値を視覚化。',
    'type.life.statWeeks': '総週数',
    'type.life.statYears': '年',

    // 目標カウントダウンカード
    'type.goal.name': '目標カウントダウン',
    'type.goal.description': '時刻を数える。大型ローンチ、休暇、または人生の大切なマイルストーンへの準備。',
    'type.goal.statGoals': '目標',
    'type.goal.statUpdates': '毎日更新',

    // 共通ボタン
    'button.select': '選択',

    // カスタマイズセクション
    'customize.header': 'パーソナライズ',
    'customize.title': 'あなたのものにする',
    'customize.selected': '選択済み：',
    'customize.selectedNone': 'なし',

    // 設定グループ
    'config.location': '位置',
    'config.locationHint': '正確なタイムゾーンのため',
    'config.dateOfBirth': '生年月日',
    'config.dateOfBirthHint': '（オプション）',
    'config.lifespan': '予想寿命',
    'config.lifespanHint': '（予想年数）',
    'config.goalName': 'ゴール名',
    'config.targetDate': 'ターゲット日',
    'config.colors': '色',
    'config.background': '背景',
    'config.accent': 'アクセント',
    'config.colorPresets': 'プリセット',
    'config.device': 'デバイス',
    'config.deviceResolution': '解像度',
    'config.url': 'あなたの壁紙 URL',

    // 色プリセット
    'preset.classic': 'クラシック',
    'preset.gold': 'ゴールド',
    'preset.cyan': 'シアン',
    'preset.red': '赤',
    'preset.green': '緑',

    // プレビュー
    'preview.hint': 'ライブプレビュー',
    'preview.selectType': '壁紙タイプを選択してください',

    // URL とコピー
    'url.copy': 'コピー',
    'url.copied': 'コピーしました！',
    'url.placeholder': '上でオプションを設定してください...',

    // セットアップセクション
    'setup.header': 'もうすぐです',
    'setup.title': '設定して忘れる',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // セットアップステップ - iOS
    'setup.ios.step1': 'URL をコピー',
    'setup.ios.step1Desc': '上で壁紙を設定し、生成された URL をコピーします',
    'setup.ios.step2': 'オートメーションを作成',
    'setup.ios.step2Desc': 'ショートカットアプリ → オートメーションタブ → 新規オートメーション<br>時間：<strong>午前 6:00</strong> → <strong>毎日</strong>繰り返す<br><strong>今すぐ実行</strong>を選択 → 新規ショートカットを作成',
    'setup.ios.step3': 'ショートカットを設定',
    'setup.ios.step3Desc': '<strong>1. URL のコンテンツを取得：</strong><br><span class="code-snippet">https://lifegrid.aradhyaxstudy.workers.dev/generate?...</span><br><br><strong>2. 壁紙を設定：</strong><br>ターゲットとして「ロック画面」を選択します。',
    'setup.ios.step4': '完了',
    'setup.ios.step4Desc': '「壁紙を設定」で矢印 (→) をタップ：<br>「サブジェクトへのトリミング」をオフ<br>「プレビューを表示」をオフ',
    'setup.ios.step4Warning': '「壁紙を設定」で矢印 (→) をタップ：<br>「サブジェクトへのトリミング」をオフ<br>「プレビューを表示」をオフ',

    // セットアップステップ - Android
    'setup.android.step1': 'URL をコピー',
    'setup.android.step1Desc': '上で壁紙を設定し、生成された URL をコピーします',
    'setup.android.step2': '前提条件',
    'setup.android.step2Desc': 'Google Play ストアから <strong>MacroDroid</strong> をインストール',
    'setup.android.step3': 'マクロを設定',
    'setup.android.step3Desc': 'トリガー：日付/時刻 → 日/時刻 (00:01:00) → 毎日の平日で有効',
    'setup.android.step4': 'アクションを設定',
    'setup.android.step4Desc': '<strong>4.1 画像をダウンロード</strong><br>ウェブ操作 → HTTP リクエスト (GET)<br>URL を貼り付け。「次のアクションをブロック」を有効化<br>「レスポンスを保存」をチェック → <span class="code-snippet">/Download/lifegrid.png</span><br><br><strong>4.2 壁紙を設定</strong><br>デバイス設定 → 壁紙を設定<br><span class="code-snippet">/Download/lifegrid.png</span>を選択<br><br><span class="highlight-badge">⚠ 同じファイル名を使用してください</span>',
    'setup.android.step5': '完了',
    'setup.android.step5Desc': 'マクロに名前を付ける → <strong>マクロを作成</strong>をタップ',

    // フッター
    'footer.tagline': '時間、ビジュアル化。',

    // 言語セレクター
    'lang.select': '言語',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',

    // ゴール関連
    'goal.dayLeft': '日残り',
    'goal.daysLeft': '日残り',

    // デバッグメッセージ
    'debug.autoDetectFailed': '国を自動検出できませんでした',
    'debug.copyFailed': 'コピーに失敗しました：',
  }
};

// 国家到语言的映射
export const countryToLang = {
  // English
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', ZA: 'en',
  // 简体中文
  CN: 'zh-CN', SG: 'zh-CN',
  // 繁體中文
  TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  // 日本語
  JP: 'ja',
};

// 默认语言
export const DEFAULT_LANG = 'en';

// 支持的所有语言
export const SUPPORTED_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja'];
