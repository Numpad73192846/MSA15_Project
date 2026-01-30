// 사용자 정의 자바스크립트

function clearTokens() {
    // JWT는 HttpOnly 쿠키로 관리됨
}

function setNavState(isAuth, authList) {
    const navGuestArea = document.getElementById("navGuestArea");
    const navUserArea = document.getElementById("navUserArea");
    const navUserMyPageBtn = document.getElementById("navUserMyPageBtn");
    const navTutorDashboardBtn = document.getElementById("navTutorDashboardBtn");
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

            if (isTutorPending) {
                navTutorDashboardBtn.style.display = "none";
                navTutorMyPageBtn.style.display = "inline-block";
                navTutorMyPageBtn.textContent = "추가 정보 작성";
                navTutorMyPageBtn.onclick = () => { location.href = "/tutor/register"; };
            } else {
                navTutorDashboardBtn.style.display = "inline-block";
                navTutorMyPageBtn.style.display = "inline-block";
            }
        }
        
        else {
            navUserMyPageBtn.style.display = "inline-block";
            navTutorDashboardBtn.style.display = "none";
            navTutorMyPageBtn.style.display = "none";
        }
    }

    else {
        navGuestArea.style.display = "flex";
        navUserArea.style.display = "none";
    }

}

function fetchUserInfo() {
    fetch("/api/users/me", {
        method: "GET"
    })
    .then (response => {
        if ( response.ok ) {
            return response.json();
        }

        return fetch("/api/auth/refresh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        })
        .then (res => {
            if ( res.ok ) {
                return res.json();
            }
            throw new Error("토큰 갱신에 실패했습니다.");
        })
        .then (data => {
            if ( data && data.success && data.data ) {
                return fetch("/api/users/me", {
                    method: "GET"
                });
            }
            throw new Error("토큰 갱신 응답이 올바르지 않습니다.");
        })
        .then (res => {
            if ( res.ok ) {
                return res.json();
            }
            throw new Error("토큰 갱신 후 사용자 정보를 불러오지 못했습니다.");
        })
        .catch (error => {
            console.error(error);
            setNavState(false);
            return null;
        });
    })
    .then (data => {
        if ( data && data.success && data.data ) {
            const authList = data.data.authList || [];
            setNavState(true, authList);

            const isTutorPending = Array.isArray(authList) && authList.some(a => a.auth === "ROLE_TUTOR_PENDING" || a === "ROLE_TUTOR_PENDING");
            if (isTutorPending && location.pathname !== "/tutor/register") {
                location.href = "/tutor/register";
            }
        }
        else {
            setNavState(false);
        }
    });
}

const logoutBtn = document.getElementById("navLogoutBtn");

if ( logoutBtn ) {
    logoutBtn.addEventListener("click", async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        clearTokens();
        setNavState(false);
        window.location.href = "/";
    });
}

document.addEventListener("DOMContentLoaded", fetchUserInfo);
