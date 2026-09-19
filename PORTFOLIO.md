# 待辦清單 Web App（作品集）

這是一個在 GitHub Copilot 實戰工作坊中完成的簡潔待辦清單（To-Do）Web 應用程式，專注於可離線運作與純前端實作。專案以易讀、可維護的原生 HTML、CSS 與 JavaScript 編寫，並示範如何結合 Copilot Agent Mode 與 MCP 工具來輔助開發與專案協作。

## 線上展示
- GitHub Pages（佔位）：https://<你的帳號>.github.io/<你的repo名稱>/

## 功能
- 新增待辦項目（輸入框 + 新增按鈕，會忽略空白輸入）
- 勾選完成：每筆待辦左側有勾選框，勾選後文字加上刪除線並淡化顯示
- 刪除單筆：每筆待辦右方有刪除按鈕，可以刪除該筆項目
- 清除已完成：底部提供「清除已完成」按鈕，可一次刪除所有已完成項目（有確認對話框）
- 篩選：顯示「全部 / 未完成 / 已完成」三種篩選視圖
- 未完成統計：底部顯示「未完成: N 項」，數字始終反映整體資料
- 空清單提示：清單為空或篩選後無項目時顯示相對應提示文字
- 主題切換：支援淺色 / 深色模式切換，會記住使用者偏好且在使用者未設定時跟隨系統偏好
- 本地儲存：所有資料存到 localStorage，重新整理後資料不會遺失

## 技術
- 使用純 HTML、CSS、原生 JavaScript（不使用任何前端框架或第三方套件）
- 不建立 package.json，也未執行任何 npm install；可離線開啟並運作
- 使用 CSS 變數集中管理配色，並以 .dark-theme 切換深色樣式
- 資料以 localStorage 儲存（不依賴伺服器或外部 API）

## 開發方式
- 本專案的開發示範如何結合 GitHub Copilot 的 Agent Mode 與 MCP（Microsoft Content Provider）功能：
  - 使用 agentic workflow 自動讀取 repository 中的 Issue、參考文件與提示檔（位於 .github/prompts/），依需求提出修改計畫並實作。
  - 透過分支與 Pull Request 的流程進行變更，並在 commit 訊息中紀錄修正內容與關聯的 Issue（例如使用 `Closes #<number>`）。
  - 所有程式碼變更遵循專案內的 copilot 指示（.github/copilot-instructions.md），包含使用繁體中文註解、變數命名規範、以及不使用外部資源等限制。

## 我學到什麼
- 如何用純原生 Web 技術建立一個功能完整且可離線的單頁應用（SPA-like）
- 如何設計與管理深色/淺色主題，並考量無障礙的色彩對比與使用者偏好儲存
- 如何把自動化 agent workflow（含 issue 讀取與修復流程）納入日常開發，提高修 bug 與協作效率
- 在不依賴第三方套件的情況下，實作乾淨、可維護的 DOM 操作與狀態管理

---

若你想要我替代你上線 GitHub Pages（將佔位網址換成實際網址）或協助撰寫部署步驟，我可以在取得你的帳號資訊後協助製作相關指令與說明。