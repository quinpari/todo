const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const clearBtn = document.getElementById("clear-btn");
const filterButtons = document.querySelectorAll(".filter-section button[data-filter]");
const sortBtn = document.getElementById("sort-btn");
const themeToggle = document.getElementById("theme-toggle");

let currentFilter = "all";
let sortAlpha = false;

// Init
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  updateTheme();
});

// Events
addBtn.addEventListener("click", handleAdd);
input.addEventListener("keypress", e => { if (e.key === "Enter") handleAdd(); });
clearBtn.addEventListener("click", clearAll);
filterButtons.forEach(btn => btn.addEventListener("click", filterList));
sortBtn.addEventListener("click", () => {
  sortAlpha = !sortAlpha;
  renderTodos();
});
themeToggle.addEventListener("click", toggleTheme);

// Data helpers
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function handleAdd() {
  const task = input.value.trim();
  if (!task) return;

  const todos = getTodos();
  todos.push({ text: task, done: false });
  saveTodos(todos);
  input.value = "";
  renderTodos();
}

function createTodoElement(todo, index) {
  const li = document.createElement("li");
  if (todo.done) li.classList.add("done");

  const span = document.createElement("span");
  span.textContent = todo.text;

  // ✅ Klik op taak om als voltooid te markeren
  span.addEventListener("click", () => {
    const todos = getTodos();
    todos[index].done = !todos[index].done;
    saveTodos(todos);
    renderTodos();
  });

  // ✏️ Bewerken bij dubbelklik
  span.addEventListener("dblclick", () => {
    const inputEdit = document.createElement("input");
    inputEdit.className = "edit-input";
    inputEdit.value = todo.text;
    span.replaceWith(inputEdit);
    inputEdit.focus();

    inputEdit.addEventListener("blur", () => {
      const todos = getTodos();
      todos[index].text = inputEdit.value.trim() || todos[index].text;
      saveTodos(todos);
      renderTodos();
    });

    inputEdit.addEventListener("keypress", e => {
      if (e.key === "Enter") inputEdit.blur();
    });
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.addEventListener("click", () => {
    const todos = getTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  return li;
}

function renderTodos() {
  let todos = getTodos();

  if (currentFilter === "open") {
    todos = todos.filter(t => !t.done);
  } else if (currentFilter === "done") {
    todos = todos.filter(t => t.done);
  }

  if (sortAlpha) {
    todos.sort((a, b) => a.text.localeCompare(b.text));
  }

  todoList.innerHTML = "";
  todos.forEach((todo, i) => {
    const li = createTodoElement(todo, i);
    li.classList.add("fade-in");
    todoList.appendChild(li);
  });
}

function loadTodos() {
  renderTodos();
}

function clearAll() {
  localStorage.removeItem("todos");
  renderTodos();
}

function filterList(e) {
  currentFilter = e.target.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  e.target.classList.add("active");
  renderTodos();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function updateTheme() {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") document.body.classList.add("dark");
}
