// 1. 필요한 HTML 요소
const streamTitleInput = document.querySelector('#stream-title');
const reviewInput = document.querySelector('#review-input');
const saveButton = document.querySelector('#save-button');
const reviewList = document.querySelector('#review-list');


// ✨✨ 모달 관련 새로운 요소 정의 (HTML ID와 일치하도록 수정) ✨✨
const editModal = document.getElementById('edit-modal');
const editModalTitle = document.getElementById('edit-modal-title');
const editModalText = document.getElementById('edit-modal-text');

// HTML: <input type="hidden" id="edit-modal-id"> 에 대응
const editModalIndex = document.getElementById('edit-modal-id'); 

const modalSaveButton = document.getElementById('modal-save-button');
const modalCancelButton = document.getElementById('modal-cancel-button');


// 2. 핵심 데이터: 메모를 저장할 배열
let reviews = [];

// --- 보조 함수: 데이터 관리 ---

// A. localStorage에 배열을 저장하는 함수
function saveReviews() {
    localStorage.setItem('memoPageData', JSON.stringify(reviews));
}

// B. localStorage에서 데이터를 불러오는 함수
function loadReviews() {
    const loadedData = localStorage.getItem('memoPageData');

    if (loadedData) {
        reviews = JSON.parse(loadedData);
        displayReviews();
    }
}

// --- 화면 및 이벤트 관리 ---

// C. displayReviews 함수 (메모 내용을 화면에 그립니다)
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

        // 배열 순서대로 출력 (최신 항목을 맨 위로)
        reviewList.prepend(newListItem);
    });

    attachDeleteEvents();
    attachEditEvents(); // ✨✨ PC/모바일 분리 로직 실행 ✨✨
    attachToggleEvents();
}


// D. 삭제 버튼에 클릭 이벤트를 연결하는 함수 (변동 없음)
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            const listItem = event.target.closest('li');
            const indexToDelete = parseInt(listItem.dataset.index);
            reviews.splice(indexToDelete, 1);
            saveReviews();
            displayReviews();
        });
    });
}


// E. 수정 버튼에 클릭 이벤트를 연결하는 함수 (PC/모바일 분기)
function attachEditEvents() {
    const editButtons = document.querySelectorAll('.edit-button');

    editButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            const listItem = event.target.closest('li');
            const indexToEdit = parseInt(listItem.dataset.index);
            const currentReview = reviews[indexToEdit];
            
            // 600px 이하일 때 (모바일) 모달 사용
            if (window.innerWidth <= 600) {
                openEditModal(indexToEdit);
            } else {
                // 600px 초과일 때 (PC) 기존 인라인 수정 사용
                handleInlineEdit(listItem, indexToEdit, currentReview);
            }
        });
    });
}

// ✨✨ PC 환경에서 사용할 인라인 수정 로직 (기존 E 함수에서 분리) ✨✨
function handleInlineEdit(listItem, indexToEdit, currentReview) {
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

    // 3-1. 저장 버튼 이벤트
    listItem
        .querySelector('.save-edit-button')
        .addEventListener('click', function () {
            const newTitle = listItem.querySelector('.edit-title').value.trim();
            const newText = listItem.querySelector('.edit-text').value.trim();

            if (newTitle === '' || newText === '') {
                alert('제목과 내용을 입력해주세요!');
                return;
            }

            reviews[indexToEdit].title = newTitle;
            reviews[indexToEdit].text = newText;
            reviews[indexToEdit].date = new Date().toLocaleString(); // 수정 시간 업데이트

            saveReviews();
            displayReviews();
        });

    // 3-2. 취소 버튼 이벤트
    listItem
        .querySelector('.cancel-edit-button')
        .addEventListener('click', function () {
            displayReviews();
        });
}


// F. ... 버튼에 클릭 이벤트를 연결하는 함수 (토글 기능 - 변동 없음)
function attachToggleEvents() {
    const toggleButtons = document.querySelectorAll('.toggle-actions-button');
    toggleButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            const actionGroup = event.target.closest('.review-action-group');
            actionGroup.classList.toggle('active');
        });
    });
}

// G. Enter 키 이벤트를 연결하는 함수 (변동 없음)
function attachEnterKeyEvents() {
    // ... (기존 코드 유지) ...
    streamTitleInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveButton.click();
        }
    });

    reviewInput.addEventListener('keydown', function (event) {
        const isPureEnter =
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.ctrlKey &&
            !event.metaKey;

        if (isPureEnter) {
            event.preventDefault();
            saveButton.click();
        }

        const isCtrlCmdEnter =
            (event.ctrlKey || event.metaKey) && event.key === 'Enter';
        if (isCtrlCmdEnter) {
            event.preventDefault();
            saveButton.click();
        }
    });
}


// --- ✨✨ 모달 제어 함수 (신규) ✨✨ ---

// 모달을 열고 메모 정보를 로드하는 함수
function openEditModal(index) {
    const memo = reviews[index];

    if (!memo) return;

    // 모달에 현재 메모 정보 및 인덱스 로드
    editModalIndex.value = index; // 수정할 메모의 배열 인덱스 저장
    editModalTitle.value = memo.title;
    editModalText.value = memo.text;

    // 모달 표시
    editModal.classList.remove('modal-hidden');
    
    // body 스크롤을 막아 수정에 집중하도록 함
    document.body.style.overflow = 'hidden'; 
}

// 모달을 닫는 함수
function closeEditModal() {
    // 모달 숨기기
    editModal.classList.add('modal-hidden');
    
    // body 스크롤 허용
    document.body.style.overflow = 'auto';
}

// 모달에서 수정 내용을 저장하는 함수
function saveModalEdit() {
    const indexToEdit = parseInt(editModalIndex.value);
    const newTitle = editModalTitle.value.trim();
    const newText = editModalText.value.trim();

    if (newTitle === '' || newText === '') {
        alert("제목과 내용을 모두 입력해주세요!");
        return;
    }
    
    // 메모 업데이트
    reviews[indexToEdit].title = newTitle;
    reviews[indexToEdit].text = newText;
    reviews[indexToEdit].date = new Date().toLocaleString(); // 수정 시간 업데이트

    saveReviews(); // LocalStorage에 저장
    
    closeEditModal(); // 모달 닫기
    displayReviews(); // 목록 새로고침
}


// --- 메인 이벤트 및 초기화 ---

// 3. 저장 버튼 클릭 이벤트 핸들러 (변동 없음)
saveButton.addEventListener('click', function () {
    const streamTitle = streamTitleInput.value.trim();
    const reviewText = reviewInput.value.trim();

    if (streamTitle === '' || reviewText === '') {
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 4. 새로운 메모 객체 생성
    const newReview = {
        title: streamTitle,
        text: reviewText,
        date: new Date().toLocaleString(),
    };

    // 5. 배열 맨 앞에 추가
    reviews.unshift(newReview);

    // 6. 배열 전체를 localStorage에 저장
    saveReviews();

    // 7. 화면 업데이트
    displayReviews();

    // 8. 입력창 초기화
    streamTitleInput.value = '';
    reviewInput.value = '';
});

// 9. 페이지가 로드될 때 저장된 데이터를 불러옵니다.
loadReviews();

// 10. Enter 키 이벤트를 활성화합니다.
attachEnterKeyEvents();


// 11. ✨✨ 모달 버튼 이벤트 리스너 연결 ✨✨
modalSaveButton.addEventListener('click', saveModalEdit);
modalCancelButton.addEventListener('click', closeEditModal);

// 모달 외부 클릭 시 닫기
editModal.addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') {
        closeEditModal();
    }
});

