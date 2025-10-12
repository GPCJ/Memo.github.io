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

        reviewList.prepend(newListItem);
    });

    attachDeleteEvents();
    attachEditEvents(); 
    attachToggleEvents();
}


// D. 삭제 버튼에 클릭 이벤트를 연결하는 함수 (변동 없음)
function attachDeleteEvents() {
    const deleteButtons = document.querySelectorAll('.delete-button');
