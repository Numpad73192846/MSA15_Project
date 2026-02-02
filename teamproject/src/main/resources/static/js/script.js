// 사용자 정의 자바스크립트

let accessTokenMemory = null;

function setAccessToken(token) {
    accessTokenMemory = token || null;
}

function getAccessToken() {
    return accessTokenMemory;
}

function buildAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
    const response = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({})
    });

    if (!response.ok) {
        return false;
    }

    const data = await response.json();
    if (data && data.success && data.data && data.data.accessToken) {
        setAccessToken(data.data.accessToken);
        return true;
    }

    return false;
}

function clearTokens() {
    accessTokenMemory = null;
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
        method: "GET",
        headers: buildAuthHeaders()
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }

        return refreshAccessToken()
            .then((refreshed) => {
                if (!refreshed) {
                    throw new Error("토큰 갱신에 실패했습니다.");
                }
                return fetch("/api/users/me", {
                    method: "GET",
                    headers: buildAuthHeaders()
                });
            })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                throw new Error("토큰 갱신 후 사용자 정보를 불러오지 못했습니다.");
            });
    })
    .catch((error) => {
        console.error(error);
        setNavState(false);
        return null;
    })
    .then((data) => {
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

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", fetchUserInfo);
=======
document.addEventListener("DOMContentLoaded", async () => {
    await refreshAccessToken();
    fetchUserInfo();
});
>>>>>>> 5a44d9fe660f3bb25aed0316e0d5f8a20547784a
