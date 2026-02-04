```javascript
// 사용자 정의 자바스크립트

let accessTokenMemory = null;
// let: 변수 선언, 재할당 가능 / accessTokenMemory: 변수 이름 / null: 아무 값도 없음;
// 전체해석: accessTokenMemory라는 변수이름으로 변수선언 하는데, 아무 값 없도록 설정
// 엑세스 토큰을 메모리에 저장할 전역 변수 선언 및 null로 초기화

function setAccessToken(token) {
// function: 함수 선언 / setAccessToken: 함수 이름 / (token): 매개변수
// 엑세스 토큰을 설정하는 함수 정의
    accessTokenMemory = token || null;
    // accessTokenMemory 변수에 token 값 할당 / token || null: token이 falsy 값이면 null 할당
    // 토큰이 제공되면 메모리에 저장, 없으면 null로 설정
    if (token) {
    // if: 조건문 / (token): token 값이 truthy인지 확인
        localStorage.setItem('accessToken', token);
        // localStorage: 브라우저의 로컬 스토리지 객체 / setItem: 항목 저장 메서드 / ('accessToken', token): 'accessToken' 키로 token 값 저장
        // 토큰이 있으면 브라우저의 로컬스토리지에 'accessToken' 키로 저장(영구 저장)
    }
}

function getAccessToken() {
    // funtion: 함수 선언 / getAccessToken: 함수 이름
    // 먼저 메모리에서 확인
    if (accessTokenMemory) return accessTokenMemory;
    // if: 조건문 / (accessTokenMemory): accessTokenMemory 값이 truthy인지 확인 / return: 함수 종료 및 값 반환
    // 메모리에 토큰이 있으면 바로 반환
    // 토큰(Token)이란? 사용자 인증 및 권한 부여에 사용되는 문자열
    
    const란?
    1. 상수 선언, 재할당 불가(값 고정)
    2. 블록 스코프 변수 선언(지역변수)
    3. 내용물은 바뀔 수 있음(객체, 배열 등)
    // const: 상수(constant) 선언(숫자, 문자열, 객체 등 재할당 불가)
    const stored = localStorage.getItem('accessToken');
    // localStorage: 브라우저의 로컬 스토리지 객체 / getItem: 항목 가져오기 메서드 / ('accesToken'): 'accesssToken' 키로 저장된 값 가져오기
    // 로컬 스토리지에서 'accessToken' 키로 저장된 토큰 가져오기
    if (stored) {
        // if: 조건문 / (stored): stored값이 truthy인지 확인
        accessTokenMemory = stored;  // 메모리에도 저장
        // accessTokenMemory 변수에 stored 값 할당
    }
    return accessTokenMemory;
    // return: 함수 종료 및 값 반환 / accessTokenMemory: 반환할 값
}

function buildAuthHeaders() {
    // function: 함수 선언 / buildAuthHeaders: 함수 이름
    const token = getAccessToken();
    // const: 상수 선언 / token: 변수 이름 / getAccessToken(): 함수 호출
    console.log("[Auth] 현재 토큰:", token ? "있음" : "없음");
    // console: 콘솔 객체 / log: 로그 출력 / ("[Auth] 현재 토큰:", token ? "있음" : "없음"); : 토큰 여부 출력
    return token ? { Authorization: `Bearer ${token}` } : {};
    // 삼항연산자: 토큰이 있으면 { Authorization: `Bearer ${token}` } 반환, 없으면 / : {} 빈 객체 반환
}

async function refreshAccessToken() {
    // async: 비동기 함수 선언 / refreshAccessToken: 함수 이름
    try {
        // 예외 처리를 위한 try 블록 시작
        console.log("[RefreshToken] 토큰 갱신 시작");
        // 콘솔에 토큰 갱신 시 로그 출력
        const refreshToken = localStorage.getItem('refreshToken');
        // localStorage에서 'refreshToken' 키로 저장된 토큰을 가져와서 refreshToken 변수에 할당

        const response = await fetch("/api/auth/refresh", {
            // const: 상수 선언 / response: 변수 이름 / await: 비동기 처리 대기 / fetch(): 네트워크 요청 함수
            method: "POST",
            // http 메서드를 "POST"로 설정
            headers: {
                // 요청 헤더 설정 시작
                // 요청 헤더란: 전달하려는 정보의 부가 정보
                // 그럼 Body는? 본문, 즉 실제 데이터 / 아이디, 비밀번호 등
                // 쉬운설명: 요청헤더: 택배 송장, 요청본문: 택배 상자 내용물
                "Content-Type": "application/json"
                // 요청 본문이 JSON 형식임을 명시
            },
            // 헤더설정 여기서 끝나다~
            body: JSON.stringify({ refreshToken: refreshToken }),
            // 요청 본문: { refreshToken: refreshToken } ,stringify(): 객체를 JSON 문자열로 변환
            credentials: "include"
            // credentials: 자격 증명 설정 / "include": 쿠키 등 자격 증명을 포함하여 요청
        });
        // fetch 요청 종료

        if (!response.ok) {
            // (!response.ok): 응답이 성공적이지 않은 경우
            console.log("[RefreshToken] 응답 실패:", response.status);
            // 콘솔에 응답 실패 로그 출력
            return false;
            // 함수 종료 및 false 반환
        }

        const data = await response.json();
        // const: 상수 선언 / data: 변수 이름 / await: 비동기 처리 대기 / response.json(): 응답 본문을 JSON으로 파싱
        // 파싱(Farsing)이란? 데이터를 특정 형태에서 다른 형태로 변환하는 과정
        console.log("[RefreshToken] 응답 데이터:", data);
        // 콘솔에 응답 데이터 로그 출력
        
        if (data && data.success && data.data && data.data.accessToken) {
        // (data && data.success && data.data && data.data.accessToken): data 객체와 그 하위 속성들이
        // 모두 존재하는지 확인(null / undefined 방지)
    
            setAccessToken(data.data.accessToken);
            // 새로운 엑세스 토큰을 setAccessToken 함수를 호출하여 저장
            // refreshToken도 갱신된 경우 저장
            // 서버가 리프레시 토큰도 새로 발급한 경우 대비
            if (data.data.refreshToken) {
            // 응답 데이터에 새로운 리프레시 토큰이 있는지 확인
                localStorage.setItem('refreshToken', data.data.refreshToken);
                // 새 리프레시 토큰을 localStorage에 'refreshToken' 키로 저장
            }
            console.log("[RefreshToken] 토큰 저장 성공");
            // 콘솔에 토큰 저장 성공 로그 출력
            return true;
            // true 반환 (토큰 갱신 성공)
        }

        console.log("[RefreshToken] 토큰 데이터 없음");
        // 응답 데이터에 필요한 토큰 정보가 없는 경우 로그 출력
        return false;
        // false 반환 (토큰 갱신 실패)
    } catch (error) {
        // 예외 발생 시 catch 블록 실행
        console.error("[RefreshToken] 에러:", error);
        // 에러 로그 출력   
        return false;
    }
}

function clearTokens() {
    // 모든 토큰을 삭제하는 함수 정의(로그아웃 시 사용)
    accessTokenMemory = null;
    // 메모리에 저장된 액세스 토큰을 null로 초기화
    localStorage.removeItem('accessToken');
    // 로컬스토리지에서 'accessToken' 항목 삭제
    localStorage.removeItem('refreshToken');
    // 로컬스토리지에서 'refreshToken' 항목 삭제
}

function setNavState(isAuth, authList) {
    // 네비게이션 바 상태 설정 함수 정의
    const navGuestArea = document.getElementById("navGuestArea");
    // navguestArea: 비로그인(게스트) 사용자 영역 요소 가져오기 / document.getElementById(): HTML 요소 선택 메서드
    // 전체해석: HTML 문서에서 ID가 "navGuestArea"인 요소를 찾아 navGuestArea 변수에 할당
    const navUserArea = document.getElementById("navUserArea");
    // navUserArea: 로그인 사용자 영역 요소 가져오기 / document.getElementById(): HTML 요소 선택 메서드
    // 전체해석: HTML 문서에서 ID가 "navUserArea"인 요소를 찾아 navUserArea 변수에 할당
    const navUserMyPageBtn = document.getElementById("navUserMyPageBtn");
    // navUserMyPageBtn: 사용자 마이페이지 버튼 요소 가져오기 / document.getElementById(): HTML 요소 선택 메서드
    // 전체해석: HTML 문서에서 ID가 "navUserMyPageBtn"인 요소를 찾아 navUserMyPageBtn 변수에 할당(일반 사용자 마이페이지 버튼)
    const navTutorDashboardBtn = document.getElementById("navTutorDashboardBtn");
    // navTutorDashboardBtn: 튜터 대시보드 버튼 요소 가져오기 / document.getElementById(): HTML 요소 선택 메서드
    // 전체해석: HTML 문서에서 ID가 "navTutorDashboardBtn"인 요소를 찾아 navTutorDashboardBtn 변수에 할당(튜터 대시보드 버튼)
    const navTutorMyPageBtn = document.getElementById("navTutorMyPageBtn");
    // navTutorMyPageBtn: 튜터 마이페이지 버튼 요소 가져오기 / document.getElementById(): HTML 요소 선택 메서드
    // 전체해석: HTML 문서에서 ID가 "navTutorMyPageBtn"인 요소를 찾아 navTutorMyPageBtn 변수에 할당(튜터 마이페이지 버튼)

    if ( !navGuestArea || !navUserArea ) {
        return;
    }
    // navGuestArea 또는 navUserArea가 없으면 함수 종료
    // 뜻: navGuestArea나 navUserArea 요소가 존재하지 않으면 함수 실행 중단

    if ( !Array.isArray(authList) ) {
        authList = [];
    }
    // authList가 배열이 아니면 빈 배열로 초기화
    // authList가 배열이 아니면 빈 배열로 설정(안전성 확보)

    if ( isAuth ) {
        // isAuth가 true(인증된 사용자)인 경우
        navGuestArea.style.display = "none";
        // 게스트 영역을 숨김 (display를 "none"으로 설정)
        // 사용자로 로그인 된 경우 게스트 영역 숨기기(게스트가 아니기때문에)

        navUserArea.style.display = "flex";
        // 사용자 영역을 표시 (display를 "flex"로 설정)
        // 사용자로 로그인 된 경우 사용자 영역 표시

        const isTutor = authList.some(a => a.auth === "ROLE_TUTOR" || a === "ROLE_TUTOR");
        // isTutor: authList 배열에 "ROLE_TUTOR" 권한이 있는지 확인 / some(): 배열 내 조건에 맞는 요소가 있는지 확인 메서드
        // authList 배열에서 "ROLE_TUTOR" 권한이 있는지 확인 (some 메서드는 조건에 맞는 요소가 하나라도 있으면 true)
        // 전체해석: authList 배열에서 "ROLE_TUTOR" 권한이 있는지 확인하여 isTutor 변수에 할당
        const isTutorPending = authList.some(a => a.auth === "ROLE_TUTOR_PENDING" || a === "ROLE_TUTOR_PENDING");
        // isTutorPending: authList 배열에 "ROLE_TUTOR_PENDING" 권한이 있는지 확인 / some(): 배열 내 조건에 맞는 요소가 있는지 확인 메서드
        // authList 배열에서 "ROLE_TUTOR_PENDING" 권한이 있는지 확인 (튜터 승인 대기 중)
        // 전체해석: authList 배열에서 "ROLE_TUTOR_PENDING" 권한이 있는지 확인하여 isTutorPending 변수에 할당

        // pending: 대기 중인, 보류 중인

        if ( isTutor || isTutorPending ) {
            // 튜터 권한이 있거나 튜터 승인 대기중인 경우
            navUserMyPageBtn.style.display = "none";
            // 일반 사용자 마이페이지 버튼을 숨김

            if (isTutorPending) {
                // 튜터 승인 대기중인 경우
                navTutorDashboardBtn.style.display = "none";
                // 튜터 대시보드 버튼 숨김(아직 승인 대기중 이므로)
                navTutorMyPageBtn.style.display = "inline-block";
                // 튜터 마이페이지 버튼 표시
                navTutorMyPageBtn.textContent = "추가 정보 작성";
                // 버튼 텍스트를"추가 정보 작성"으로 설정
                navTutorMyPageBtn.onclick = () => { location.href = "/tutor/register"; };
                // 버튼클릭 시 "/tutor/register" 페이지로 이동
            } else {
                // 튜터 승인이 완료된 경우
                navTutorDashboardBtn.style.display = "inline-block";
                // 튜터 대시보드 버튼 표시
                navTutorMyPageBtn.style.display = "inline-block";
                // 튜터 마이페이지 버튼 표시
            }
        } 
        
        else {
            // 일반 사용자인 경우(튜터가 아닌경우)
            navUserMyPageBtn.style.display = "inline-block";
            // 일반 사용자 마이페이지 버튼 표시
            navTutorDashboardBtn.style.display = "none";
            // 튜터 대시보드 숨김
            navTutorMyPageBtn.style.display = "none";
            // 튜터 마이페이지 버튼 숨김
        }
    }

    else {
        // isAuth가 false(비인증 사용자)
        navGuestArea.style.display = "flex";
        // 게스트 영역 표시
        navUserArea.style.display = "none";
        // 사용자 영역 숨김
    }

}

function fetchUserInfo() {
    // 사용자 정보를 조회하는 함수 정의
    console.log("[FetchUserInfo] 시작");
    // 콘솔에 사용자 정보 조회 시작 로그 출력
    fetch("/api/users/me", {
        // fetch API로 "/api/users/me" 엔드포인트에 GET 요청
        // 엔드포인트: API에서 특정 기능이나 자원에 접근하기 위한 URL 경로        
        method: "GET",
        // HTTP 메서드를 "GET"으로 설정(데이터 조회용)
        headers: buildAuthHeaders(),
        // 요청 헤더 설정(인증 헤더 포함)
        credentials: "include"
        // 쿠키 포함하여 요청
    })
    .then(response => {
        // fetch의 첫 번째 then: 응답을 받으면 실행되는 콜백 함수
        console.log("[FetchUserInfo] 응답 상태:", response.status);
        // 콘솔 응답 상태 코드 출력
        if (response.ok) {
            // 응답이 성공적인 경우
            return response.json();
            // 응답 본문을 JSON으로 파싱하여 반환
        }

        return refreshAccessToken()
        // 응답이 실패한 경우 토큰 갱신 시도
            .then((refreshed) => {
                // 토큰 갱신 결과를 받는 콜백 함수
                console.log("[FetchUserInfo] 토큰 갱신 결과:", refreshed);
                // 콘솔에 갱신 결과 출력(true/false)
                if (!refreshed) {
                    // 토큰 갱신 실패 시
                    throw new Error("토큰 갱신에 실패했습니다.");
                    // 에러 던지기
                }
                return fetch("/api/users/me", {
                    // 토큰 갱신 성공 시 다시 사용자 정보 요청
                    method: "GET",
                    // HTTP 메서드를 "GET"으로 설정
                    headers: buildAuthHeaders(),
                    // 새로운 토큰으로 인증 헤더 생성
                    credentials: "include"
                    // 쿠키 포함
                });
            })
            .then((res) => {
                // 재시도한 요청의 응답을 받는 콜백 함수
                console.log("[FetchUserInfo] 재시도 응답 상태:", res.status);
                // 콘솔에 재시도 응답 상태 출력
                if (res.ok) {
                    // 재시도한 응답이 성공적인 경우
                    return res.json();
                    // 응답 본문을 JSON으로 파싱하여 반환
                }
                throw new Error("토큰 갱신 후 사용자 정보를 불러오지 못했습니다.");
                // 재시도도 실패하면 경우 에러 던지기
            });
    })
    .then((data) => {
        // 사용자 정보를 받는 최종 then 블록: 응답 데이터를 처리
        console.log("[FetchUserInfo] 사용자 데이터:", data);
        if (data && data.success && data.data) {
            const authList = data.data.authList || [];
            setNavState(true, authList);

            const isTutorPending = Array.isArray(authList) && authList.some(a => a.auth === "ROLE_TUTOR_PENDING" || a === "ROLE_TUTOR_PENDING");
            const isRegisterPage = location.pathname.startsWith("/tutor/register");
            if (isTutorPending && !isRegisterPage) {
                location.href = "/tutor/register";
            }
        } else {
            setNavState(false);
        }
    })
    .catch((error) => {
        console.error("사용자 정보 조회 실패:", error);
        setNavState(false);
    });
}


function setupLogoutButton() {
    const logoutBtn = document.getElementById("navLogoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            const refreshToken = localStorage.getItem('refreshToken');
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
                credentials: "include"
            });

            clearTokens();
            setNavState(false);
            window.location.href = "/";
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await refreshAccessToken();
    fetchUserInfo();
    setupLogoutButton();
});
