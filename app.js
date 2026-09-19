// 這個檔案負責待辦清單的所有互動與資料儲存
// 使用 localStorage 儲存，頁面重新整理後資料會保留

const STORAGE_KEY = 'copilot_todo_list_v1'; // localStorage key
const THEME_KEY = 'copilot_todo_theme_v1'; // 主題儲存 key

// 篩選狀態常數
const FILTERS = { ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' };

// DOM 元素
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoListEl = document.getElementById('todo-list');
const emptyTip = document.getElementById('empty-tip');
const incompleteCountEl = document.getElementById('incomplete-count');
const clearAllBtn = document.getElementById('clear-all');
const clearCompletedBtn = document.getElementById('clear-completed');
const themeToggleBtn = document.getElementById('theme-toggle');
const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));

// 目前篩選狀態（預設全部）
let currentFilter = FILTERS.ALL;
const FILTER_KEY = 'copilot_todo_filter_v1'; // localStorage key for selected filter

// 取得儲存的清單，若無則回傳空陣列
function loadTodos(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    // 若解析失敗，回復成空清單
    console.error('讀取 localStorage 失敗', e);
    return [];
  }
}

// 儲存清單到 localStorage
function saveTodos(todos){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 產生新的待辦物件
function createTodo(text){
  return {
    id: Date.now().toString(), // 簡單唯一 id
    text: text,
    done: false
  };
}

// 依照 currentFilter 回傳要顯示的清單
function getVisibleTodos(todos){
  if(currentFilter === FILTERS.ACTIVE) return todos.filter(t => !t.done);
  if(currentFilter === FILTERS.COMPLETED) return todos.filter(t => t.done);
  return todos.slice();
}

// 渲染清單
function render(){
  const todos = loadTodos();
  const visible = getVisibleTodos(todos);

  // 清空清單 DOM
  todoListEl.innerHTML = '';

  // 顯示對應篩選下的空提示文字
  if(visible.length === 0){
    emptyTip.style.display = 'block';
    // 根據篩選改變提示文字
    if(todos.length === 0){
      emptyTip.textContent = '還沒有任何待辦事項，新增一個吧!';
    }else if(currentFilter === FILTERS.ACTIVE){
      emptyTip.textContent = '目前沒有未完成的項目';
    }else if(currentFilter === FILTERS.COMPLETED){
      emptyTip.textContent = '目前沒有已完成的項目';
    }else{
      emptyTip.textContent = '篩選後沒有項目';
    }
  }else{
    emptyTip.style.display = 'none';
  }

  // 建立每一項 DOM（只 render visible）
  visible.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = todo.id;

    // 左側：勾選框 + 文字
    const left = document.createElement('div');
    left.className = 'todo-left';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.done;
    checkbox.addEventListener('change', () => toggleDone(todo.id));

    const span = document.createElement('div');
    span.className = 'todo-text';
    span.textContent = todo.text;
    if(todo.done) span.classList.add('completed');

    left.appendChild(checkbox);
    left.appendChild(span);

    // 右側：刪除按鈕
    const right = document.createElement('div');
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.textContent = '刪除';
    delBtn.addEventListener('click', () => deleteTodo(todo.id));

    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);

    todoListEl.appendChild(li);
  });

  updateIncompleteCount();
}

// 新增待辦（忽略純空白輸入）
function addTodoFromInput(){
  const raw = todoInput.value || '';
  const text = raw.trim();
  if(text === ''){
    // 若輸入為空或僅空白，不新增
    todoInput.value = '';
    return;
  }

  const todos = loadTodos();
  todos.unshift(createTodo(text)); // 新項目放最上方
  saveTodos(todos);
  todoInput.value = '';
  render();
}

// 切換完成狀態
function toggleDone(id){
  const todos = loadTodos();
  const idx = todos.findIndex(t => t.id === id);
  if(idx === -1) return;
  todos[idx].done = !todos[idx].done;
  saveTodos(todos);
  render();
}

// 刪除單筆
function deleteTodo(id){
  let todos = loadTodos();
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  render();
}

// 更新未完成數字顯示（不受篩選影響，顯示整體數量）
function updateIncompleteCount(){
  const todos = loadTodos();
  const incomplete = todos.filter(t => !t.done).length;
  incompleteCountEl.textContent = `未完成: ${incomplete} 項`;
}

// 刪除所有已完成項目（會在呼叫前先由呼叫端確認）
function clearCompleted(){
  let todos = loadTodos();
  const before = todos.length;
  todos = todos.filter(t => !t.done);
  if(todos.length === before) return; // 沒有已完成的
  saveTodos(todos);
  render();
}

// 更新 "清除已完成" 按鈕的可見性或啟用狀態
function updateClearCompletedButton(){
  if(!clearCompletedBtn) return;
  const todos = loadTodos();
  const hasCompleted = todos.some(t => t.done);
  // 若沒有已完成項目，將按鈕停用
  clearCompletedBtn.disabled = !hasCompleted;
}

// ---------- 主題支援（淺/深色） ----------
// 讀取使用者選擇的主題，回傳 'dark' / 'light' / null (null 表示使用系統設定)
function loadSavedTheme(){
  try{
    return localStorage.getItem(THEME_KEY); // 'dark' or 'light' or null
  }catch(e){
    return null;
  }
}

function saveTheme(theme){
  try{
    if(theme === null) localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, theme);
  }catch(e){
    console.error('儲存主題失敗', e);
  }
}

// 根據設定套用主題：如果 savedTheme 為 null，則遵從系統 prefers-color-scheme
function applyThemeFromStorage(){
  const saved = loadSavedTheme();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const useDark = saved === 'dark' || (saved === null && prefersDark);
  setDocumentTheme(useDark ? 'dark' : 'light');
}

function setDocumentTheme(kind){
  const root = document.documentElement;
  if(kind === 'dark'){
    root.classList.add('dark-theme');
    themeToggleBtn.textContent = '☀️ 淺色模式';
  }else{
    root.classList.remove('dark-theme');
    themeToggleBtn.textContent = '🌙 深色模式';
  }
}

// 主題按鈕事件：切換並儲存使用者選擇
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.contains('dark-theme');
  const newTheme = isDark ? 'light' : 'dark';
  setDocumentTheme(newTheme);
  saveTheme(newTheme);
});

// 當系統主題變動且使用者未手動選擇時，自動切換
if(window.matchMedia){
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener && mq.addEventListener('change', (e) => {
    const saved = loadSavedTheme();
    if(saved === null){
      setDocumentTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ---------- 篩選邏輯 ----------
// 更新目前篩選並重新 render
function setFilter(filter){
  // 僅接受合法篩選值，否則回退到 ALL
  const allowed = [FILTERS.ALL, FILTERS.ACTIVE, FILTERS.COMPLETED];
  const safe = allowed.includes(filter) ? filter : FILTERS.ALL;
  currentFilter = safe;
  // 儲存使用者選擇到 localStorage
  try{
    localStorage.setItem(FILTER_KEY, currentFilter);
  }catch(e){
    console.error('儲存篩選狀態失敗', e);
  }
  // 更新按鈕樣式
  filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter));
  render();
}

// 嘗試從 localStorage 載入先前的篩選設定
function applyFilterFromStorage(){
  try{
    const saved = localStorage.getItem(FILTER_KEY);
    const allowed = [FILTERS.ALL, FILTERS.ACTIVE, FILTERS.COMPLETED];
    if(saved && allowed.includes(saved)){
      currentFilter = saved;
      // 更新按鈕樣式
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === currentFilter));
    }
  }catch(e){
    console.error('讀取篩選狀態失敗', e);
  }
}

// 綁定篩選按鈕事件
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

// 快捷鍵：Enter 新增
todoInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    addTodoFromInput();
  }
});

addBtn.addEventListener('click', addTodoFromInput);
// 若有舊的 clearAllBtn（已保留但不建議使用），綁定到相同功能
if(clearAllBtn){
  clearAllBtn.addEventListener('click', () => {
    if(confirm('確定要刪除所有已完成的項目嗎？')){
      clearCompleted();
    }
  });
}

// 綁定新的 clearCompletedBtn 行為
if(clearCompletedBtn){
  clearCompletedBtn.addEventListener('click', () => {
    if(clearCompletedBtn.disabled) return;
    if(confirm('確定要一次刪除所有已完成的項目？（此操作無法復原）')){
      clearCompleted();
    }
  });
}

// 初始化：套用主題，載入篩選設定，並渲染
applyThemeFromStorage();
applyFilterFromStorage();
render();
// 初始化時更新按鈕狀態
updateClearCompletedButton();
