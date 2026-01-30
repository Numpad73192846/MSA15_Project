// 사용자 정의 자바스크립트

function getTokens() {
    return {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken")
    };
}

function setTokens(tokens) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
}

function clearTokens() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

function setNavState(isAuth, authList) {
    const navGuestArea = document.getElementById("navGuestArea");
    const navUserArea = document.getElementById("navUserArea");
    const navUserMyPageBtn = document.getElementById("navUserMyPageBtn");
    const navTutorMyPageBtn = document.getElementById("navTutorMyPageBtn");

    if ( !navGuestArea || !navUserArea ) {
        return;
    }

    if ( !Array.isArray(authList) ) {
        authList = [];
    }

    if ( isAuth ) {
        navGuestArea.style.display = "none";
        navUserArea.style.display = "flex";

        const isTutor = authList.some(a => a.auth === "ROLE_TUTOR" || a === "ROLE_TUTOR");
        const isTutorPending = authList.some(a => a.auth === "ROLE_TUTOR_PENDING" || a === "ROLE_TUTOR_PENDING");

        if ( isTutor || isTutorPending ) {
            navUserMyPageBtn.style.display = "none";
            navTutorMyPageBtn.style.display = "inline-block";

            if (isTutorPending) {
                navTutorMyPageBtn.textContent = "추가 정보 작성";
                navTutorMyPageBtn.onclick = () => { location.href = "/tutor/register"; };
            } else {
                navTutorMyPageBtn.textContent = "마이페이지";
                navTutorMyPageBtn.onclick = () => { location.href = "/tutor/mypage"; };
            }
        }
        
        else {
            navUserMyPageBtn.style.display = "inline-block";
            navTutorMyPageBtn.style.display = "none";
        }
    }

    else {
        navGuestArea.style.display = "flex";
        navUserArea.style.display = "none";
    }

}

function fetchUserInfo() {
    const tokens = getTokens();

    if ( tokens.accessToken ) {
        fetch("/api/users/me", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + tokens.accessToken
            },
        })
        .then (response => {
            if ( response.ok ) {
                return response.json();
            }
            else {
                if ( !tokens.refreshToken ) {
                    clearTokens();
                    setNavState(false);
                    return null;
                }
                return fetch("/api/auth/refresh", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refreshToken: tokens.refreshToken
                    })
                })
                .then (res => {
                    if ( res.ok ) {
                        return res.json();
                    }
                    else {
                        throw new Error("토큰 갱신에 실패했습니다.");
                    }
                })
                .then (data => {
                    if ( data && data.success && data.data ) {
                        setTokens({
                            accessToken: data.data.accessToken,
                            refreshToken: data.data.refreshToken
                        });
                        return fetch("/api/users/me", {
                            method: "GET",
                            headers: {
                                "Authorization": "Bearer " + data.data.accessToken
                            },
                        });
                    }
                    else {
                        throw new Error("토큰 갱신 응답이 올바르지 않습니다.");
                    }
                })
                .then (res => {
                    if ( res.ok ) {
                        return res.json();
                    }
                    else {
                        throw new Error("토큰 갱신 후 사용자 정보를 불러오지 못했습니다.");
                    }
                })
                .catch (error => {
                    console.error(error);
                    clearTokens();
                    setNavState(false);
                });
            }
        })
        .then (data => {
            if ( data && data.success && data.data ) {
                const authList = data.data.authList || [];
                setNavState(true, authList);

                // ====== 수정: 튜터 회원가입 페이지들도 허용 ======
                const isTutorPending = Array.isArray(authList) && authList.some(a => a.auth === "ROLE_TUTOR_PENDING" || a === "ROLE_TUTOR_PENDING");
                const isRegisterPage = location.pathname.startsWith("/tutor/register");
                if (isTutorPending && !isRegisterPage) {
                    location.href = "/tutor/register";
                }
                // ====== 수정 종료 ======
            }
            else {
                setNavState(false);
            }
        });
    }

    else {
        setNavState(false);
    }

}

const logoutBtn = document.getElementById("navLogoutBtn");

if ( logoutBtn ) {
    logoutBtn.addEventListener("click", async () => {
        const { refreshToken } = getTokens();

        if ( refreshToken ) {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    refreshToken
                })
            });
        } 

        clearTokens();
        setNavState(false);
        window.location.href = "/";
    });
}

document.addEventListener("DOMContentLoaded", fetchUserInfo);