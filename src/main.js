import './style.css';

const STORAGE_KEY = 'todoList_v1';

// 메모리 상태
const todoList = [{ id: 1, title: '웹 프론트엔드 개발자 되기', done: false }];
// 마지막 id
let lastNo = Math.max(...todoList.map((item) => item.id)) || 0;

/* ========== 로컬스토리지 유틸 ========== */
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      todoList.length = 0;
      data.forEach((it) => todoList.push(it));
      lastNo = todoList.length ? Math.max(...todoList.map((i) => i.id)) : 0;
    }
  } catch {
    // 파싱 실패 시 무시
  }
}

/* ========== 렌더링 ========== */
function clearList() {
  const ul = document.querySelector('.todolist');
  while (ul.firstChild) ul.removeChild(ul.firstChild);
}

function showList() {
  clearList();
  const ul = document.querySelector('.todolist');
  const items = todoList.map((item) => getTodoItem(item));
  items.forEach((li) => ul.appendChild(li));
}

function getTodoItem(item) {
  const liElem = document.createElement('li');
  liElem.setAttribute('data-no', item.id);
  liElem.setAttribute('data-done', String(item.done));

  const labelElem = document.createElement('label');
  const inputElem = document.createElement('input');
  inputElem.setAttribute('type', 'checkbox');
  inputElem.checked = !!item.done;

  const titleElem = document.createElement('span');
  const titleTxt = document.createTextNode(item.title);

  const btnElem = document.createElement('button');
  btnElem.setAttribute('type', 'button');
  btnElem.setAttribute('aria-label', '이 항목 삭제');
  const imgElem = document.createElement('img');
  imgElem.setAttribute('src', './delete.png');
  imgElem.setAttribute('alt', '');

  const upBtnElem = document.createElement('button');
  upBtnElem.setAttribute('type', 'button');
  upBtnElem.setAttribute('aria-label', '위로 이동');
  const upImgElem = document.createElement('img');
  upImgElem.setAttribute('src', './up.png');
  upImgElem.setAttribute('alt', '');

  const downBtnElem = document.createElement('button');
  downBtnElem.setAttribute('type', 'button');
  downBtnElem.setAttribute('aria-label', '아래로 이동');
  const downImgElem = document.createElement('img');
  downImgElem.setAttribute('src', './down.png');
  downImgElem.setAttribute('alt', '');

  liElem.appendChild(labelElem);
  liElem.appendChild(btnElem);
  liElem.appendChild(upBtnElem);
  liElem.appendChild(downBtnElem);

  labelElem.appendChild(inputElem);
  labelElem.appendChild(titleElem);
  titleElem.appendChild(titleTxt);
  btnElem.appendChild(imgElem);
  upBtnElem.appendChild(upImgElem);
  downBtnElem.appendChild(downImgElem);

  // 완료 표시 렌더
  applyStrike(titleElem, item.done);

  // 삭제
  const onRemove = (e) => {
    e?.preventDefault?.();
    removeItem(item.id);
  };
  btnElem.addEventListener('click', onRemove);
  btnElem.addEventListener('touchend', onRemove, { passive: false });

  // 완료 토글
  const onToggle = (e) => {
    e?.preventDefault?.();
    toggleDone(item.id);
  };
  inputElem.addEventListener('click', onToggle);
  inputElem.addEventListener('touchend', onToggle, { passive: false });

  // 순서 바꾸기
  const onUp = (e) => {
    e?.preventDefault?.();
    moveItem(item.id, -1);
  };
  const onDown = (e) => {
    e?.preventDefault?.();
    moveItem(item.id, +1);
  };
  upBtnElem.addEventListener('click', onUp);
  upBtnElem.addEventListener('touchend', onUp, { passive: false });

  downBtnElem.addEventListener('click', onDown);
  downBtnElem.addEventListener('touchend', onDown, { passive: false });

  return liElem;
}

function applyStrike(titleSpan, done) {
  // span 내부 첫 텍스트노드를 <s>로 감싸거나 해제
  if (done) {
    if (!titleSpan.querySelector('s')) {
      const s = document.createElement('s');
      // 기존 텍스트를 s로 이동
      s.appendChild(titleSpan.firstChild);
      titleSpan.appendChild(s);
    }
  } else {
    const s = titleSpan.querySelector('s');
    if (s && s.firstChild) {
      titleSpan.insertBefore(s.firstChild, s);
      s.remove();
    }
  }
}

/* ========== 상태 변경 로직 ========== */
function add() {
  const inputElem = document.querySelector('#todoInput');
  const value = inputElem.value.trim();
  if (!value) return;
  addItem(value);
  inputElem.value = '';
  inputElem.focus();
}

function addItem(title) {
  const item = { id: ++lastNo, title, done: false };
  todoList.push(item);
  saveTodos();
  showList();
}

function handleKeyup(event) {
  if (event.key === 'Enter') add();
}

function removeItem(no) {
  const idx = todoList.findIndex((it) => it.id === Number(no));
  if (idx !== -1) {
    todoList.splice(idx, 1);
    saveTodos();
    showList();
  }
}

function toggleDone(no) {
  const idx = todoList.findIndex((it) => it.id === Number(no));
  if (idx === -1) return;
  todoList[idx].done = !todoList[idx].done;
  saveTodos();
  showList();
}

function moveItem(no, delta) {
  const idx = todoList.findIndex((it) => it.id === Number(no));
  if (idx === -1) return;
  const newIdx = idx + delta;
  if (newIdx < 0 || newIdx >= todoList.length) return;
  const [moved] = todoList.splice(idx, 1);
  todoList.splice(newIdx, 0, moved);
  saveTodos();
  showList();
}

/* ========== 초기 바인딩 ========== */
document.querySelector('.add-item').addEventListener('click', add);
document.querySelector('.add-item').addEventListener(
  'touchend',
  (e) => {
    e.preventDefault();
    add();
  },
  { passive: false }
);

document.querySelector('form > input').addEventListener('keyup', handleKeyup);

/* ========== 시작 시 로드 ========== */
loadTodos();
if (!todoList.length) {
  // 저장된 데이터가 전혀 없을 때만 기본 아이템 유지
  todoList.push({ id: 1, title: '웹 프론트엔드 개발자 되기', done: false });
  lastNo = 1;
  saveTodos();
}
showList();
