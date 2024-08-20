

// 이벤트 핸들러
const eventHandler = ()=>{
addStudentBtn.addEventListener("click", addStudentBtnClick);
delStudentBtn.addEventListener("click", delStudentBtnClick);
searchOption.addEventListener("change", selectSearchOption);
schStudentBtn.addEventListener("click", searchStudent);
sortSelect.addEventListener("change", sortStudent);
};

// 초기화
const addStudentBtn = document.querySelector("#addBtn");
const delStudentBtn = document.querySelector("#delBtn");
const schStudentBtn = document.querySelector("#schBtn");
const searchOption = document.querySelector(".schOption")
const sortSelect = document.querySelector("#sortSelect");
const studentInput = document.querySelectorAll(".studentInput");

let students;
let opt = 1;


// 학생 등록 버튼
const addStudentBtnClick = function(){
    addStudent();
    setRank();

    printHeader();
    printList();
    clearInput();
    saveStorage();
}

// 학생 삭제 버튼(학번으로 선택)
const delStudentBtnClick = function(){
    let delNo = studentInput[0].value;

    delStudent(parseInt(delNo));
    setRank();

    printHeader();
    printList();
    clearInput();

    saveStorage();
}


// 검색 옵션 변경
const selectSearchOption = function(event){
    opt = (event.target.value === "ssn" ? 1 : 2)
}

// 학생 검색(옵션에 따라)
const searchStudent = function(){
    const searchInput = document.querySelector(".schInput")
    clearList();
    printHeader();

    if (searchInput.value) {
        printList(searchInput.value, opt)
    } else {
        printList();
    }
}

// 선택된 옵션에 따라 정렬
const sortStudent = function(event){
    clearList();
    printHeader();

    switch (event.target.value) {
        case "ssn":
            printList(students, 0, 1)
            break;
        case "name":
            printList(students, 0, 2)
            break;
        default:
            printList(students, 0, 3)
            break;
    }
};


export default eventHandler;