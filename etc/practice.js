import { Student } from "../js/Student.js";
import { StudentRepository } from "../js/student-repository.js";
import validator from "../js/modules/validator.js"

// import { EventHandler } from "./event-handler.js";

let studentRepository = new StudentRepository();

// 테스트를 위한 더미데이터 입력
// studentRepository.addStudent(new Student(10, '김기정', 90, 80, 60));
// studentRepository.addStudent(new Student(11, '최기정', 100, 90, 90));
// studentRepository.addStudent(new Student(12, '박기정', 92, 82, 80));
// studentRepository.addStudent(new Student(13, '최기정', 95, 85, 88));

// let eventHandler = new EventHandler();
// eventHandler.eventRegist();

// export {studentRepository}

let students;
if (localStorage.getItem("students")) students = JSON.parse(localStorage.getItem("students"));
else students = [];



// 목록 정렬
function sortList(array, opt) {
    switch (opt) {
        case 1:
            return array.sort((x, y) => parseInt(x.sno) - parseInt(y.sno));
            break;

        case 2:
            return array.sort((x, y) => parseInt(y.totalScore) - parseInt(x.totalScore));
            break;

        default:
            return array.sort((x, y) => parseInt(y.avgScore) - parseInt(x.avgScore));
            break;
    }
};

// 헤더 출력
function printHeader() {
    const showList = document.querySelector("#studentsList");
    const newList = document.createElement("tr");

    const header = ["학번", "이름", "국어", "영어", "수학", "총점", "평균"];

    header.forEach(head => {
        const cell = document.createElement("td");
        cell.classList = "header"
        cell.textContent = head;
        newList.appendChild(cell);
    });
    showList.appendChild(newList);
}

// 목록 출력
function printList(name, opt, searchType) {
    let tempArray = [];

    if (opt === 1) {
        students.forEach((student) => {
            if (opt === 1 && student.name === name) {
                tempArray.push(student);
            }
        }
        )
    } else {
        students.forEach(element => tempArray.push(element));
    };

    console.dir(sortList(tempArray, searchType));
    tempArray = sortList(tempArray, searchType);

    // 헤더 출력
    printHeader();

    // 학생 정보 출력
    const showList = document.querySelector("#studentsList");
    const newList = document.createElement("tr");

    tempArray.forEach(element => {
        const newList = document.createElement("tr");

        const values = [
            element.sno,
            element.name,
            element.kor,
            element.eng,
            element.mat,
            element.totalScore,
            Math.round(element.avgScore)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            newList.appendChild(cell);
        });
        showList.appendChild(newList);
    });
};

// 목록 삭제
const clearList = function () {
    const tempList = document.querySelectorAll("td");
    tempList.forEach(element => element.remove());
}

// 로컬 저장
const saveStudent = function (student, no) {
    if (no === 999) {
        students = [];
    }
    if (no) {
        students.forEach(element => {
            if (element.sno = no) {
                students.pop(element);
            }
        });
    } else {
        students.push(student);
    }
    localStorage.setItem("students", JSON.stringify(students));

    const input = document.querySelectorAll("input");
    input.forEach(element => element.value = "")
    return students;
};


// 학생 추가 삭제
const addStudentBtn = document.querySelector("#addStudent");
const delStudentBtn = document.querySelector("#delStudent");
const schStudentBtn = document.querySelector("#schStudent");
const studentAction = document.querySelectorAll(".studentAction");
const clearStudentsBtn = document.querySelector("#clearStudents");
const clearListBtn = document.querySelector("#clearList")

// 이벤트 등록
// 학생 등록 버튼
addStudentBtn.addEventListener("click", () => {
    let sno = parseInt(studentAction[0].value);
    let name = studentAction[1].value;
    let korScore = parseInt(studentAction[2].value);
    let engScore = parseInt(studentAction[3].value);
    let matScore = parseInt(studentAction[4].value);
    let totalScore = korScore + engScore + matScore;
    let avgScore = totalScore / 3

    const tempArray = [
        sno, name, korScore, engScore, matScore
    ];

    let pass = 1;

    console.log(tempArray);


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

    clearList();

    if (pass === 0) alert("입력한 내용을 다시 확인해주세요.");

    if (pass === 1) {
        students.forEach((element) => {
            if (parseInt(element.sno) === sno) {
                pass = 0
            }
        });
        if (pass === 0) alert("이미 등록된 학번입니다.");
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
        })
        printList();
    }
});

// 학생 삭제 버튼(학번으로 선택)
delStudentBtn.addEventListener("click", () => {
    let delNo = studentAction[0].value;
    saveStudent(null, delNo)
    clearList();
    printList();
})

// 학생 검색 버튼(이름으로 검색)
schStudentBtn.addEventListener("click", () => {
    clearList();
    if (studentAction[1].value) {
        printList(studentAction[1].value, 1)
    } else {
        printList();
    }
})

// localStorage 초기화(임시 기능)
clearStudentsBtn.addEventListener("click", () => {
    saveStudent(null, 999);
    clearList();
})

// 리스트 초기화(임시 기능)
clearListBtn.addEventListener("click", () => clearList());