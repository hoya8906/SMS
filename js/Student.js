export class Student {
    constructor(sno, name, kor, eng, mat) {
        this.sno = sno;
        this.name = name;
        this.kor = kor;
        this.eng = eng;
        this.mat = mat;
        this.totalScore = this.kor + this.eng + this.mat;
        this.avgScore = Math.round(this.totalScore / 3 * 10) / 10
        this.rank = 0;
    }


    // toArray() {
    //     const totalScore = this.kor + this.eng + this.mat
    //     const avgScore = totalScore / 3

    //     return [
    //         this.sno,
    //         this.name,
    //         this.kor,
    //         this.eng,
    //         this.mat,
    //         totalScore,
    //         Math.round(avgScore)
    //     ]
    // }


}

// export { MAX_VALUE, students, fruits, sum };