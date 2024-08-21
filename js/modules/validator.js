// 입력값 유효성 검증
export default function validator(inputValue, option) {
    let regExp;

    // 옵션에 따른 입력값 검증
    if (option === 1) {
        // 한글 또는 영문 대문자 2~6자
        regExp = /^[가-힣A-Z]{2,6}$/;
    } else {
        // 1~100 사이의 숫자
        regExp = /^[1-9]?\d{1}$|^100$/;
    }

    // 검증결과 반환
    return (regExp.test(inputValue));
}