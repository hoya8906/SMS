export class StudentRepository {
    constructor() {
        this.students = [];
    }

    // 메소드
    addStudent(student) {
        this.students.push(student)
        this.students.sort((x, y) => y.avgScore - x.avgScore);
        for (let index = 0; index < this.students.length; index++) {
            const element = this.students[index];
            element.rank = index + 1;
        }     
        
        return true;
    }
};