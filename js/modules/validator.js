// 입력값 유효성 검증
export default function validator(inputValue, option) {
    let regExp;

    if (option === 1) {
        regExp = /^[가-힣A-Z]{2,6}$/;
    } else {
        regExp = /^[1-9]?\d{1}$|^100$/;
    }

    return (regExp.test(inputValue));
}