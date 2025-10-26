import './style.css';

const todoList = [
  {
    id: 1,
    title: '웹 프론트엔드 개발자 되기',
    done: false,
  },
];

let lastNo = Math.max(...todoList.map((item) => item.id));

function showList() {
  const todoListElem = todoList.map((item) => getTodoItem(item));
  const UlElem = document.querySelector('.todolist');
  todoListElem.forEach((itemLi) => UlElem.appendChild(itemLi));
}

function getTodoItem(item) {
  const liElem = document.createElement('li');
  liElem.setAttribute('data-no', item.id);

  const labelElem = document.createElement('label');
  const inputElem = document.createElement('input');
  inputElem.setAttribute('type', 'checkbox');

  const titleElem = document.createElement('span');
  const titleTxt = document.createTextNode(item.title);

  const btnElem = document.createElement('button');
  btnElem.setAttribute('type', 'button');
  btnElem.setAttribute('aria-label', '이 항목 삭제');
  const imgElem = document.createElement('img');
  imgElem.setAttribute('src', './delete.png');
  imgElem.setAttribute('alt', '');

  const starBtn = document.createElement('button');
  starBtn.setAttribute('type', 'button');
  starBtn.setAttribute('class', 'star');
  starBtn.setAttribute('aria-label', '중요한 일 체크');

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

  // 삭제
  btnElem.addEventListener('click', function () {
    const parentLi = this.parentNode;
    const no = parentLi.dataset.no;
    removeItem(no);
  });
  btnElem.addEventListener('touchstart', function () {
    const parentLi = this.parentNode;
    const no = parentLi.dataset.no;
    removeItem(no);
  });

  // 완료 토글
  inputElem.addEventListener('click', () => toggleDone(item.id, item.done));
  inputElem.addEventListener('touchstart', () => toggleDone(item.id, item.done));

  // 순서 바꾸기
  upBtnElem.addEventListener('click', function () {
    const li = this.parentNode;
    up(li);
  });
  upBtnElem.addEventListener('touchstart', function () {
    const li = this.parentNode;
    up(li);
  });

  downBtnElem.addEventListener('click', function () {
    const li = this.parentNode;
    down(li);
  });
  downBtnElem.addEventListener('touchstart', function () {
    const li = this.parentNode;
    down(li);
  });

  return liElem;
}

function add() {
  const inputElem = document.querySelector('#todoInput');
  if (inputElem.value.trim() !== '') {
    addItem(inputElem.value.trim());
    inputElem.value = '';
    inputElem.focus();
  }
}

function addItem(title) {
  const UlElem = document.querySelector('.todolist');
  const item = {
    id: ++lastNo,
    title,
    done: false,
  };

  const todoLi = getTodoItem(item);
  UlElem.appendChild(todoLi);
}

function handleKeyup(event) {
  if (event.key === 'Enter') add();
}

function removeItem(no) {
  const targetLi = document.querySelector(`.todolist > li[data-no="${no}"]`);
  targetLi?.remove();
}

function toggleDone(no) {
  const targetLi = document.querySelector(`.todolist > li[data-no="${no}"]`);
  const beforeDone = targetLi.dataset.done;
  const isDone = beforeDone === 'true' ? false : true;
  const titleEl = targetLi.querySelector('label > span:last-of-type');

  if (isDone) {
    const sElem = document.createElement('s');
    sElem.appendChild(titleEl.firstChild);
    titleEl.appendChild(sElem);
  } else {
    titleEl.appendChild(titleEl.firstElementChild.firstChild);
    titleEl.firstElementChild.remove();
  }
  targetLi.dataset.done = isDone;
}

function up(li) {
  const ul = li.parentNode;
  const prev = li.previousElementSibling;
  if (!prev) return; // 맨 위면 무시
  ul.insertBefore(li, prev);
}

function down(li) {
  const ul = li.parentNode;
  const next = li.nextElementSibling;
  if (!next) return; // 맨 아래면 무시
  ul.insertBefore(next, li);
}

// 추가
document.querySelector('.add-item').addEventListener('click', add);
document.querySelector('.add-item').addEventListener('touchstart', add);
document.querySelector('form > input').addEventListener('keyup', handleKeyup);

showList();
