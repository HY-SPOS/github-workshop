// 這個檔案負責待辦清單的所有互動與資料儲存
// 使用 localStorage 儲存，頁面重新整理後資料會保留

const STORAGE_KEY = 'copilot_todo_list_v1'; // localStorage key

// DOM 元素
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoListEl = document.getElementById('todo-list');
const emptyTip = document.getElementById('empty-tip');
const incompleteCountEl = document.getElementById('incomplete-count');
const clearAllBtn = document.getElementById('clear-all');

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

// 渲染清單
function render(){
  const todos = loadTodos();

  // 清空清單 DOM
  todoListEl.innerHTML = '';

  if(todos.length === 0){
    emptyTip.style.display = 'block';
  }else{
    emptyTip.style.display = 'none';
  }

  // 建立每一項 DOM
  todos.forEach(todo => {
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

// 更新未完成數字顯示
function updateIncompleteCount(){
  const todos = loadTodos();
  const incomplete = todos.filter(t => !t.done).length;
  incompleteCountEl.textContent = `未完成: ${incomplete} 項`;
}

// 刪除所有已完成項目
function clearCompleted(){
  let todos = loadTodos();
  const before = todos.length;
  todos = todos.filter(t => !t.done);
  if(todos.length === before) return; // 沒有已完成的
  saveTodos(todos);
  render();
}

// 快捷鍵：Enter 新增
todoInput.addEventListener('keydown', (e) => {
  if(e.key === 'Enter'){
    addTodoFromInput();
  }
});

addBtn.addEventListener('click', addTodoFromInput);
clearAllBtn.addEventListener('click', clearCompleted);

// 初始渲染
render();
