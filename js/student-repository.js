export class StudentRepository {
    constructor() {
        this.students = [];
    }

    // 메소드
    addStudent(student){
        this.students.push(student)
        return true;
    }

};