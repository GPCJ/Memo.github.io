// 1. 필요한 HTML 요소
const streamTitleInput = document.querySelector('#stream-title');
const reviewInput = document.querySelector('#review-input');
const saveButton = document.querySelector('#save-button');
const reviewList = document.querySelector('#review-list');

// ✨✨ 모달 관련 새로운 요소 정의 추가 ✨✨
const editModal = document.getElementById('edit-modal');
const editModalTitle = document.getElementById('edit-modal-title');
const editModalText = document.getElementById('edit-modal-text');
const editModalIndex = document.getElementById('edit-modal-index'); // 인덱스 저장용
const modalSaveButton = document.getElementById('modal-save-button');
const modalCancelButton = document.getElementById('modal-cancel-button');


// 2. 핵심 데이터: 메모를 저장할 배열
let reviews = [];

// --- 보조 함수: 데이터 관리 ---

// A. localStorage에 배열을 저장하는 함수
function saveReviews() {
    // ✅ Memo Page의 전용 키(금고 이름)를 사용합니다.
    localStorage.setItem('memoPageData', JSON.stringify(reviews));
}

// B. localStorage에서 데이터를 불러오는 함수
function loadReviews() {
    // ✅ Memo Page의 전용 키로 데이터를 불러옵니다.
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

        reviewList.prepend(newListItem);
    });

    attachDeleteEvents();
    attachEditEvents();
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

// E. ✨✨ 수정 버튼에 클릭 이벤트를 연결하는 함수 (모달 호출로 변경) ✨✨
function attachEditEvents() {
    const editButtons = document.querySelectorAll('.edit-button');

    editButtons.forEach((button) => {
        button.addEventListener('click', function (event) {
            const listItem = event.target.closest('li');
            const indexToEdit = parseInt(listItem.dataset.index);
            
            openEditModal(indexToEdit); // 인라인 수정 대신 모달 함수 호출
        });
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
    
    // 모바일 환경에서 키보드가 화면을 가리지 않도록, body 스크롤을 막는 CSS 추가
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

// 3. 저장 버튼 클릭 이벤트 핸들러 (경고 문구 변경)
saveButton.addEventListener('click', function () {
    const streamTitle = streamTitleInput.value.trim();
    const reviewText = reviewInput.value.trim();

    if (streamTitle === '' || reviewText === '') {
        // ✅ 경고 문구 변경
        alert('제목과 내용을 모두 입력해주세요!');
        return;
    }

    // 4. 새로운 메모 객체 생성 (이름은 그대로 review로 유지해도 무방)
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


// 11. ✨✨ 모달 버튼 이벤트 리스너 연결 (파일 맨 아래에 추가) ✨✨
modalSaveButton.addEventListener('click', saveModalEdit);
modalCancelButton.addEventListener('click', closeEditModal);

// 모달 외부 클릭 시 닫기 (선택 사항)
editModal.addEventListener('click', (e) => {
    // 모달 컨테이너 자체를 클릭했을 때만 닫기
    if (e.target.id === 'edit-modal') {
        closeEditModal();
    }
});
