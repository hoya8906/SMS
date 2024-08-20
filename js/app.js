// import { Student } from "./Student.js";
// import { StudentRepository } from "./student-repository.js";
import validator from "./modules/validator.js"

// import { EventHandler } from "./event-handler.js";
// let studentRepository = new StudentRepository();

// 테스트를 위한 더미데이터 입력
// studentRepository.addStudent(new Student(10, '김기정', 90, 80, 60));
// studentRepository.addStudent(new Student(11, '최기정', 100, 90, 90));
// studentRepository.addStudent(new Student(12, '박기정', 92, 82, 80));
// studentRepository.addStudent(new Student(13, '최기정', 95, 85, 88));

// let eventHandler = new EventHandler();
// eventHandler.eventRegist();

// export {studentRepository}

// 초기화
const addStudentBtn = document.querySelector("#addBtn");
const delStudentBtn = document.querySelector("#delBtn");
const schStudentBtn = document.querySelector("#schBtn");
const searchOption = document.querySelector(".schOption")
const sortSelect = document.querySelector("#sortSelect");
const studentInput = document.querySelectorAll(".studentInput");

let students;
let opt = 1;

// 로컬 스토리지 불러오기
if (localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));
else students = [];

// 모달 창 출력  관련
// 모달 열기 함수
function showModal(message) {
    const modalBodyText = document.getElementById("modal-body-text");
    modalBodyText.textContent = message;

    // Bootstrap 모달 인스턴스 생성 및 표시
    const myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
}

// 목록 정렬
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

// 헤더 출력
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
        students.forEach((student) => {
            if ((option === 1 ? String(student.sno) : student.name) === inputValue) {
                tempArray.push(student);
            }
        }
        );
    } else {
        students.forEach(element => tempArray.push(element));
    };

    tempArray = sortList(tempArray, searchType);

    // 학생 정보 출력
    const showList = document.querySelector(".table");
    const tBody = document.createElement("tbody");

    tempArray.forEach(element => {
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

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            newList.appendChild(cell);
        });

        showList.appendChild(tBody);
        tBody.appendChild(newList);
    });
};

// 목록 삭제
const clearList = function () {
    const tempList = document.querySelectorAll("td");
    tempList.forEach(element => element.remove());
}

// 입력창 비우기
const clearInput = function () {
    studentInput.forEach(element => element.value = "")
};

// 로컬 저장
const saveStorage = function () {
    localStorage.setItem("students", JSON.stringify(students));
}

// 학생 등록
const saveStudent = function (student, no) {
    if (no) {
        students.push(student);
    }
};

// 학생 추가
const addStudent = function () {
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

    let pass = 1;

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
        students.forEach((element) => {
            if (parseInt(element.sno) === parseInt(sno)) {
                pass = 0
            }
        });
        if (pass === 0) showModal("이미 등록된 학번입니다.");
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
    }
};

// 학생 삭제
const delStudent = function (no) {
    for (let index = 0; index < students.length; index++) {
        const element = students[index];
        if (parseInt(element.sno) === parseInt(no)) {
            students.splice(index, 1);
        };
    };
};

// 순위 산출 재설정
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
    setRank();

    printHeader();
    printList();
    clearInput();
    saveStorage();
}
);

// 학생 삭제 버튼(학번으로 선택)
delStudentBtn.addEventListener("click", () => {
    let delNo = studentInput[0].value;

    delStudent(parseInt(delNo));
    setRank();

    printHeader();
    printList();
    clearInput();

    saveStorage();
})

// 검색 옵션 변경
searchOption.addEventListener("change", (event) => {
    opt = (event.target.value === "ssn" ? 1 : 2)
})

// 학생 검색(옵션에 따라)
schStudentBtn.addEventListener("click", () => {
    const searchInput = document.querySelector(".schInput")
    clearList();
    printHeader();

    if (searchInput.value) {
        printList(searchInput.value, opt)
    } else {
        printList();
    }
})

// 선택된 옵션에 따라 정렬
sortSelect.addEventListener("change", (event) => {

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
});
