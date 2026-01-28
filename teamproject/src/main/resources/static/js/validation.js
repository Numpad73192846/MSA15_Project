/**
 *  유효성 검사 
 */
function checkUser() {
	let form = document.joinForm
	let userId = form.id
	let password = form.pw
	let passwordConfirm = form.pw_confirm
	let username = form.name
	
	let msg = ''	

	// 회원 아이디 체크
	let userIdCheck = /^[A-Za-z가-힣].*/
	msg = '아이디는 영문자 또는 한글로 시작해야 합니다.' 
	if( !check(userIdCheck, userId, msg) ) return false
	
	// 비밀번호 체크
	let passwordCheck = /^(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/
	msg = '비밀번호는 6자 이상이며 특수문자를 1개 이상 포함해야 합니다.' 
	if( !check(passwordCheck, password, msg) ) return false
	
	// 비밀번호 확인 체크
	msg = '비밀번호가 일치하지 않습니다.'
	if( password.value !== passwordConfirm.value ) {
		alert(msg)	
		return false	
	}
	
	// 이름 체크
	let usernameCheck = /^[가-힣]+$/
	msg = '이름은 한글만 입력 가능합니다.' 
	if( !check(usernameCheck, username, msg) ) return false
	
	
	// 아이디 중복 검사
    fetch("join_idCheck.jsp?id=" + encodeURIComponent(userId.value))
        .then(res => res.text())
        .then(result => {
            if (result.trim() === "OK") {               
                form.submit();
            } else {
                alert("아이디가 중복되었습니다.");
                userId.focus();
            }
        });
	
	// return true
	return false; 
}

// 정규표현식 유효성 검사 함수
function check(regExp, element, msg) {
	
	if( regExp.test(element.value) ) {
		return true
	}
	alert(msg)
	element.select()
	element.focus()
	return false
}