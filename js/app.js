import { StudentRepository } from "./student-repository.js";
import validator from "./modules/validator.js"

import { Student } from "./Student.js";
import eventHandler from "./modules/event-handler.js"


const studentRepository = new StudentRepository;

// 선택자를 통한 돔 요소 접근 변수 선언
const addStudentBtn = document.querySelector("#addBtn");
const delStudentBtn = document.querySelector("#delBtn");
const schStudentBtn = document.querySelector("#schBtn");
const searchOption = document.querySelector(".schOption")
const sortSelect = document.querySelector("#sortSelect");
const studentInput = document.querySelectorAll(".studentInput");
const inputs = document.querySelector("#inputs")

// 필요할지도..?
// const snoInput = studentInput[0];
// const nameInput = studentInput[1];
// const korInput = studentInput[2];
// const engInput = studentInput[3];
// const matInput = studentInput[4];

let students;
let opt = 1;

// 로컬 스토리지 불러오기
if (localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));
else students = [];

// 모달 열기 함수
function showModal(message) {
    const modalBodyText = document.getElementById("modal-body-text");
    modalBodyText.textContent = message;

    // Bootstrap 모달 인스턴스 생성 및 표시
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
}

// 목록 정렬 : 옵션 값에 따라 여러 방법으로 정렬한 배열을 반환
function sortList(array, opt) {

    switch (opt) {
        case 1:
            return array.sort((x, y) => parseInt(x.sno) - parseInt(y.sno));
        case 2:
            return array.sort((x, y) => x.name.charCodeAt(0) - y.name.charCodeAt(0));
        case 3:
            return array.sort((x, y) => x.rank - y.rank);
        default:
            return array.sort((x, y) => parseInt(y.avgScore) - parseInt(x.avgScore));
    }
};

// 헤더 출력 : 화면 내용이 없을 때 화면을 깔끔하게 하기 위해 헤더 출력함수 별도 정의
function printHeader() {
    clearList();
    const showList = document.querySelector(".table");
    const tHeader = document.createElement("thead");
    const newList = document.createElement("tr");
    newList.classList = "table-dark"

    const header = ["학번", "이름", "국어", "영어", "수학", "총점", "평균", "순위"];

    header.forEach(head => {
        const cell = document.createElement("td");
        cell.classList = "header"
        cell.textContent = head;
        newList.appendChild(cell);
    });
    showList.appendChild(tHeader);
    tHeader.appendChild(newList);
}

// 목록 출력
function printList(inputValue, option, searchType) {
    let tempArray = [];

    if (option > 0) {
        // 검색창에 입력값이 있을 때
        students.forEach((student) => {
            // 전체 일치 필터링
            // if ((option === 1 ? String(student.sno) : student.name) === inputValue) {
            //     tempArray.push(student);
            // }

            // 일부 일치 필터링
            if ((option === 1 ? String(student.sno) : student.name).includes(inputValue)) {
                tempArray.push(student);
            };
        }
        );
    } else {
        // 검색창에 입력값이 없을 때(전체 검색)
        students.forEach(element => tempArray.push(element));
    };

    // 출력을 위해 기준에 따른 정렬
    tempArray = sortList(tempArray, searchType);


    // 학생 정보 출력
    if (tempArray.length > 0) {
        printHeader();
        const showList = document.querySelector(".table");
        const tBody = document.createElement("tbody");

        tempArray.forEach(element => {

            // 행 만들기
            const newList = document.createElement("tr");

            const values = [
                element.sno,
                element.name,
                element.kor,
                element.eng,
                element.mat,
                element.totalScore,
                Math.round(element.avgScore * 10) / 10,
                element.rank,
            ];

            // 열 만들기
            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                newList.appendChild(cell);
            });

            showList.appendChild(tBody);
            tBody.appendChild(newList);
        });
    } else {
        // 저장된 학생 정보가 없으면:
        clearList();

        const tableContainer = document.querySelector("#tableContainer");
        const emptyList = document.createElement("p");
        emptyList.textContent = "검색된 항목이 없습니다.";
        tableContainer.append(emptyList);
    }
};

// 목록 삭제 : 다음 출력을 위한 화면 클리닝
const clearList = function () {
    document.querySelectorAll("td").forEach(td => td.remove());
    document.querySelectorAll("p").forEach(p => p.remove());
}

// 입력창 비우기 : 등록, 삭제 후 입력창 클리닝
const clearInput = function () {
    studentInput.forEach(element => element.value = "")
};

// 로컬 저장
const saveStorage = function () {
    localStorage.setItem("students", JSON.stringify(students));
}

// 학생 등록
// 입력값 검증을 통과했으며, 이미 등록한 학번이 아닐 때:
const saveStudent = function (student, no) {
    if (no) {
        students.push(student);
    }
};

// 학생 추가
const addStudent = function () {

    // 입력값 받아오기
    let sno = parseInt(studentInput[0].value);
    let name = studentInput[1].value;
    let korScore = parseInt(studentInput[2].value);
    let engScore = parseInt(studentInput[3].value);
    let matScore = parseInt(studentInput[4].value);
    let totalScore = korScore + engScore + matScore;
    let avgScore = totalScore / 3

    const tempArray = [
        sno, name, korScore, engScore, matScore
    ];

    // 검증 초기값
    let pass = 1;

    // 입력값 검증 과정
    for (let index = 0; index < tempArray.length; index++) {
        const element = tempArray[index];
        if (index === 1) {
            if (!validator(element, 1)) {
                pass = 0;
            };
        } else if (!validator(element)) {
            pass = 0;
        };
    };

    if (pass === 0) showModal("입력한 내용을 다시 확인해주세요.");

    if (pass === 1) {
        // 동일한 번호가 이미 있으면:
        students.forEach((element) => {
            if (parseInt(element.sno) === parseInt(sno)) {
                pass = 0
            }
        });
        if (pass === 0) showModal("이미 등록된 번호입니다.");
    }

    if (pass === 1) {
        saveStudent({
            sno: sno,
            name: name,
            kor: korScore,
            eng: engScore,
            mat: matScore,
            totalScore: totalScore,
            avgScore: avgScore
        }, pass)
        setRank();
        clearInput();
        printHeader();
        printList();
        saveStorage();
    }
};

// 학생 삭제
const delStudent = function (no) {
    let error = 1;

    for (let index = 0; index < students.length; index++) {
        const element = students[index];
        if (parseInt(element.sno) === parseInt(no)) {
            error = 0;
            students.splice(index, 1);

            setRank();

            printHeader();
            printList();
            clearInput();
            saveStorage();
        };
    };

    // 삭제하고자 하는 번호를 students에서 찾을 수 없으면:
    if (error === 1) showModal("삭제하고자 하는 학생 번호를 바르게 입력해주세요.");
};

// 랭크 매기는 함수
const setRank = function () {
    const rankArray = sortList(students);
    for (let i = 0; i < rankArray.length; i++) {
        const element = rankArray[i];
        element.rank = i + 1;
    }
    return rankArray;
};

setRank();

// 이벤트 등록
// 학생 등록 버튼
addStudentBtn.addEventListener("click", () => {
    addStudent();
}
);

// 학생 삭제 버튼(학번으로 선택)
delStudentBtn.addEventListener("click", () => {
    let delNo = studentInput[0].value;

    delStudent(parseInt(delNo));
})

// 검색 옵션 변경
searchOption.addEventListener("change", (event) => {
    opt = (event.target.value === "ssn" ? 1 : 2)
})

const searchInput = document.querySelector(".schInput")

// 학생 검색 함수
const searchStudent = function () {
    clearList();
    // if (students.length > 0) printHeader();

    if (searchInput.value) {
        printList(searchInput.value, opt)
    } else {
        printList(students, 0, sortOption());
    }
};

// 학생 검색(옵션에 따라)
schStudentBtn.addEventListener("click", () => {
    searchStudent();
})

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchStudent();
});


// 정렬 옵션 선택
const sortOption = function () {
    switch (sortSelect.value) {
        case "ssn":
            return 1;
        case "name":
            return 2;
        default:
            return 3;
    }
};

// 선택된 옵션에 따라 정렬
sortSelect.addEventListener("change", (event) => {

    clearList();
    printHeader();
    printList(students, 0, sortOption());
});

// 엔터키로 등록
inputs.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') addStudent();
});

// 모달 창 엔터키로 닫기
const modalWindow = document.querySelector("#myModal");
modalWindow.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        const myModal = bootstrap.Modal.getInstance(modalWindow);
        if (myModal) {
            myModal.hide();
        }
    }
});