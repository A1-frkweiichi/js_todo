document.addEventListener('DOMContentLoaded', () => {
    console.log("Hello World");
  
    // ローカルストレージから'Todos'のデータを読み込む。存在しないなら空の配列
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
  
    const todoList = document.getElementById('todoList');
    const todoForm = document.getElementById('todoForm');
    const newTodo = document.getElementById('newTodo');
  
    // ToDoフォーム　submitイベント
    todoForm.addEventListener('submit', (event) => {
        // フォームのデフォルトの送信処理をキャンセル
        event.preventDefault();
  
        // 入力されたタスク名をトリムして取得
        const taskName = newTodo.value.trim();
  
        // タスク名が空でなく、既にリストに存在しない場合のみ処理
        if (taskName && !todos.some(task => task.name === taskName)) {
            console.log(taskName);
  
            const newTask = { name: taskName, status: 'pending', id: Date.now() };
            todos.push(newTask);
  
            renderTodos();
  
            // 最後に入力フィールドをクリア
            newTodo.value = '';
        }
    });
  
    // ウィンドウを閉じる前に、ToDoリストをローカルストレージに保存
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    });
  
    function renderTodos() {
        todoList.innerHTML = '';
  
        // 完了したタスクを下、未完了のタスクを上にソート
        const completedTasks = todos.filter(task => task.status === 'done');
        const pendingTasks = todos.filter(task => task.status === 'pending');
        const sortedTasks = [...pendingTasks, ...completedTasks];
  
        sortedTasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.name}</span>
                <button class="finish">完了</button>
                <button class="delete">削除</button>
            `;
  
            // タスクが完了していれば、テキストに取り消し線
            if (task.status === 'done') {
                li.querySelector('span').style.textDecoration = 'line-through';
            }
            todoList.appendChild(li);
  
            // 完了ボタン
            li.querySelector('.finish').addEventListener('click', () => {
                task.status = task.status === 'pending' ? 'done' : 'pending';
                renderTodos();
            });
  
            // 削除ボタン
            li.querySelector('.delete').addEventListener('click', () => {
                todos = todos.filter(t => t.id !== task.id);
                renderTodos();
            });
        });
    }
  
    renderTodos();
});
