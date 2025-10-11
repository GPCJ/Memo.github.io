// 1. 필요한 HTML 요소
const streamTitleInput = document.querySelector('#stream-title');
const reviewInput = document.querySelector('#review-input');
const saveButton = document.querySelector('#save-button');
const reviewList = document.querySelector('#review-list');

// 2. 핵심 데이터: 감상평을 저장할 배열 (★★★★★ 정의 필수)
let reviews = [];

// --- 보조 함수: 데이터 관리 ---

// A. localStorage에 배열을 저장하는 함수
function saveReviews() {
  // 배열을 JSON 문자열로 변환하여 'reviewChestData' 키로 저장합니다.
  localStorage.setItem('reviewChestData', JSON.stringify(reviews));
}

// B. localStorage에서 데이터를 불러오는 함수
function loadReviews() {
  const loadedData = localStorage.getItem('reviewChestData');

  if (loadedData) {
    // JSON 문자열을 다시 배열로 변환합니다.
    reviews = JSON.parse(loadedData);
    displayReviews(); // 불러온 후 바로 화면에 표시
  }
}

// --- 화면 및 이벤트 관리 ---

// /JS/Review_Chest.js (C. displayReviews 함수)
function displayReviews() {
  reviewList.innerHTML = '';

  reviews.forEach((review, index) => {
    const newListItem = document.createElement('li');
    newListItem.dataset.index = index;

    newListItem.innerHTML = `
            <div class="review-content">
                <p><strong>제목: ${review.title}</strong></p>
                <p>내용: ${review.text}</p>
                <small>${review.date}</small>
            </div>
            
            <div class="review-action-group"> 
                <button class="toggle-actions-button">...</button> 
                <div class="action-buttons">
                    <button class="edit-button">수정</button> 
                    <button class="delete-button">삭제</button> 
                </div>
            </div>
        `;

    reviewList.prepend(newListItem);
  });

  attachDeleteEvents();
  attachEditEvents();
  attachToggleEvents();
}

// D. 삭제 버튼에 클릭 이벤트를 연결하는 함수
function attachDeleteEvents() {
  const deleteButtons = document.querySelectorAll('.delete-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      // 가장 가까운 <li> 요소를 찾습니다.
      const listItem = event.target.closest('li');

      // <li>에 저장된 data-index 값을 가져옵니다.
      const indexToDelete = parseInt(listItem.dataset.index);

      // 배열에서 해당 인덱스의 항목을 제거합니다.
      reviews.splice(indexToDelete, 1);

      // 변경된 배열을 localStorage에 저장합니다.
      saveReviews();

      // 화면을 다시 그립니다.
      displayReviews();
    });
  });
}

// E. 수정 버튼에 클릭 이벤트를 연결하는 함수 (목록 -> 폼 변환 로직)
function attachEditEvents() {
  const editButtons = document.querySelectorAll('.edit-button');

  editButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      const listItem = event.target.closest('li');
      const indexToEdit = parseInt(listItem.dataset.index);

      // 1. 현재 데이터 가져오기
      const currentReview = reviews[indexToEdit];

      // 2. 항목의 HTML을 입력 가능한 폼으로 변경 (편집 모드)
      listItem.innerHTML = `
                <div class="edit-mode-content">
                    <input type="text" class="edit-title" value="${currentReview.title}">
                    <textarea class="edit-text">${currentReview.text}</textarea>
                    <small>작성일: ${currentReview.date}</small>
                </div>
                <div class="review-action-group">
                    <button class="save-edit-button">저장</button>
                    <button class="cancel-edit-button">취소</button>
                </div>
            `;

      // 3. 새로 생성된 '저장' 및 '취소' 버튼에 이벤트 연결

      // 3-1. 저장 버튼 이벤트
      listItem
        .querySelector('.save-edit-button')
        .addEventListener('click', function () {
          const newTitle = listItem.querySelector('.edit-title').value.trim();
          const newText = listItem.querySelector('.edit-text').value.trim();

          if (newTitle === '' || newText === '') {
            alert('제목과 감상평을 입력해주세요!');
            return;
          }

          // 데이터 업데이트
          reviews[indexToEdit].title = newTitle;
          reviews[indexToEdit].text = newText;

          // 로컬 스토리지에 저장 후 화면 갱신
          saveReviews();
          displayReviews();
        });

      // 3-2. 취소 버튼 이벤트: 화면 갱신만 하면 원래 상태로 돌아갑니다.
      listItem
        .querySelector('.cancel-edit-button')
        .addEventListener('click', function () {
          displayReviews();
        });
    });
  });
}

// F. ... 버튼에 클릭 이벤트를 연결하는 함수 (토글 기능)
function attachToggleEvents() {
  const toggleButtons = document.querySelectorAll('.toggle-actions-button');

  toggleButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      // 클릭된 버튼의 부모 요소인 .review-action-group을 찾습니다.
      const actionGroup = event.target.closest('.review-action-group');

      // .active 클래스를 토글(켜고 끄기)합니다.
      actionGroup.classList.toggle('active');
    });
  });
}

// G. Enter 키 이벤트를 연결하는 함수 (순수 Enter 저장 및 Shift+Enter 줄바꿈)
function attachEnterKeyEvents() {
  // 1. 방송 제목 입력창에서 Enter 감지 -> 무조건 저장
  streamTitleInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // 폼 제출 방지
      saveButton.click();
    }
  });

  // 2. 감상평 내용 입력창에서 키 감지
  reviewInput.addEventListener('keydown', function (event) {
    // Shift, Ctrl, Cmd 키가 눌리지 않은 순수 Enter만 감지
    const isPureEnter =
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.ctrlKey &&
      !event.metaKey;

    if (isPureEnter) {
      // 리뷰 내용 입력 중 '순수 Enter'를 누르면 저장 실행
      event.preventDefault(); // 기본 동작(줄바꿈) 방지
      saveButton.click();
    }

    // Ctrl/Cmd + Enter는 저장으로 남겨둡니다.
    const isCtrlCmdEnter =
      (event.ctrlKey || event.metaKey) && event.key === 'Enter';
    if (isCtrlCmdEnter) {
      event.preventDefault();
      saveButton.click();
    }

    // Shift + Enter는 줄바꿈으로 작동합니다.
  });
}

// --- 메인 이벤트 및 초기화 ---

// 3. 저장 버튼 클릭 이벤트 핸들러 (수정된 로직)
saveButton.addEventListener('click', function () {
  const streamTitle = streamTitleInput.value.trim();
  const reviewText = reviewInput.value.trim();

  if (streamTitle === '' || reviewText === '') {
    alert('방송 제목과 감상평을 모두 입력해주세요!');
    return;
  }

  // 4. 새로운 감상평 객체 생성
  const newReview = {
    title: streamTitle,
    text: reviewText,
    date: new Date().toLocaleString(),
  };

  // 5. 배열 맨 앞에 추가 (최신순)
  reviews.unshift(newReview); // ✨ 배열에 데이터 추가 ✨

  // 6. 배열 전체를 localStorage에 저장
  saveReviews(); // ✨ localStorage에 저장 ✨

  // 7. 화면 업데이트
  displayReviews(); // ✨ 화면 업데이트 함수 호출 ✨

  // 8. 입력창 초기화
  streamTitleInput.value = '';
  reviewInput.value = '';
});

// 9. 페이지가 로드될 때 저장된 데이터를 불러옵니다.
loadReviews();

// ✨ 10. Enter 키 이벤트를 활성화합니다. (누락된 부분을 추가했습니다!)
attachEnterKeyEvents();

