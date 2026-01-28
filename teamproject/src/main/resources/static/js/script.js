// 사용자 정의 자바스크립트

document.addEventListener('DOMContentLoaded', function () {
    console.log('Script loaded successfully');
});

// Mock storage keys
const STORAGE_KEYS = {
    currentUser: 'tukos.currentUser',
    bookings: 'tukos.bookings'
};

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch (e) {
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatNumberWithComma(n) {
    try {
        return Number(n).toLocaleString('ko-KR');
    } catch (e) {
        return String(n);
    }
}

function toast(message) {
    alert(message);
}

function getCurrentUser() {
    return readJson(STORAGE_KEYS.currentUser, null);
}

function setCurrentUser(user) {
    writeJson(STORAGE_KEYS.currentUser, user);
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
}

function getBookings() {
    return readJson(STORAGE_KEYS.bookings, []);
}

function setBookings(bookings) {
    writeJson(STORAGE_KEYS.bookings, bookings);
}

function updateHeaderForUser() {
    const $area = $('#navAuthArea');
    const $myPageBtn = $('#navMyPageBtn');

    if ($area.length === 0) return;

    const user = getCurrentUser();
    if (!user) {
        $area.html(
            '<button class="btn btn-outline-primary" onclick="location.href=\'/login\'">로그인</button>' +
            '<button class="btn btn-primary" onclick="location.href=\'/login\'">회원가입</button>'
        );
        $myPageBtn.hide();
        return;
    }

    const name = String(user.name || '사용자');
    const role = String(user.role || 'student');
    const dashLink = role === 'tutor' ? '<button class="btn btn-outline-primary" onclick="location.href=\'/tutor/dashboard\'">대시보드</button>' : '';

    $area.html(
        '<span class="me-2 small text-muted">' + name + '</span>' +
        dashLink +
        '<button class="btn btn-outline-secondary" id="btnLogout">로그아웃</button>'
    );

    // Show mypage button and set appropriate link
    $myPageBtn.show();
    if (role === 'tutor') {
        $myPageBtn.off('click').on('click', function () {
            location.href = '/mypages';
        });
    } else {
        $myPageBtn.off('click').on('click', function () {
            location.href = '/mypage';
        });
    }

    $('#btnLogout').on('click', function () {
        clearCurrentUser();
        setBookings([]);
        toast('로그아웃 되었습니다');
        location.href = '/';
    });
}

function initTutorListFiltering() {
    const $list = $('#tutorList');
    if ($list.length === 0) return;

    const $search = $('#tutorSearch');
    const $subject = $('#subjectFilter');
    const $price = $('#priceFilter');
    const $empty = $('#tutorEmpty');

    function normalize(s) {
        return String(s || '').toLowerCase();
    }

    function applyFilters() {
        const searchTerm = normalize($search.val());
        const subjectFilter = String($subject.val() || 'all');
        const priceFilter = String($price.val() || 'all');

        let visibleCount = 0;

        $('.tutor-card').each(function () {
            const $card = $(this);
            const name = normalize($card.attr('data-name'));
            const subjectsRaw = normalize($card.attr('data-subjects'));
            const hourlyRate = Number($card.attr('data-hourly-rate') || 0);

            const matchesSearch = !searchTerm || name.includes(searchTerm) || subjectsRaw.includes(searchTerm);
            const matchesSubject = subjectFilter === 'all' || subjectsRaw.split(',').map(s => s.trim()).includes(subjectFilter);

            let matchesPrice = true;
            if (priceFilter === 'low') matchesPrice = hourlyRate < 35000;
            else if (priceFilter === 'mid') matchesPrice = hourlyRate >= 35000 && hourlyRate <= 40000;
            else if (priceFilter === 'high') matchesPrice = hourlyRate > 40000;

            const ok = matchesSearch && matchesSubject && matchesPrice;
            $card.closest('.col-md-6, .col-lg-4, .col-md-6.col-lg-4, .col-md-6.col-lg-4').toggle(ok);
            if (ok) visibleCount += 1;
        });

        if (visibleCount === 0) $empty.removeClass('d-none');
        else $empty.addClass('d-none');
    }

    $search.on('input', applyFilters);
    $subject.on('change', applyFilters);
    $price.on('change', applyFilters);
    applyFilters();
}

function initBookingForm() {
    const $form = $('#bookingForm');
    if ($form.length === 0) return;

    $form.on('submit', function (e) {
        e.preventDefault();

        const user = getCurrentUser();
        if (!user) {
            toast('로그인이 필요합니다');
            location.href = '/login';
            return;
        }

        const tutorId = String($form.attr('data-tutor-id') || '');
        const tutorName = String($form.attr('data-tutor-name') || '');
        const hourlyRate = Number($form.attr('data-hourly-rate') || 0);

        const formData = new FormData($form.get(0));
        const date = String(formData.get('date') || '');
        const time = String(formData.get('time') || '');
        const duration = Number(formData.get('duration') || 1);
        const subject = String(formData.get('subject') || '');
        const message = String(formData.get('message') || '');

        if (!date || !time || !subject) {
            toast('필수 항목을 모두 입력해주세요');
            return;
        }

        const booking = {
            id: String(Date.now()),
            tutorId: tutorId,
            tutorName: tutorName,
            date: date,
            time: time,
            duration: duration,
            subject: subject,
            message: message,
            status: '예약됨',
            totalPrice: hourlyRate * duration
        };

        const bookings = getBookings();
        bookings.unshift(booking);
        setBookings(bookings);

        toast('예약이 완료되었습니다!');
        location.href = '/bookings';
    });
}

function renderBookingCard(booking, isUpcoming) {
    const badgeClass = booking.status === '예약됨'
        ? 'text-bg-primary'
        : booking.status === '완료'
            ? 'text-bg-success'
            : 'text-bg-danger';

    const cancelBtn = isUpcoming
        ? '<button class="btn btn-sm btn-outline-danger ms-2 btn-cancel-booking" data-booking-id="' + booking.id + '">취소</button>'
        : '';

    const msg = booking.message ?
        '<div class="mt-3 p-2 bg-light rounded small text-muted"><span class="fw-semibold">요청사항: </span>' +
        $('<div>').text(booking.message).html() +
        '</div>'
        : '';

    return (
        '<div class="card shadow-sm ' + (isUpcoming ? '' : 'opacity-75') + '">' +
        '<div class="card-body">' +
        '<div class="d-flex justify-content-between align-items-start">' +
        '<div>' +
        '<div class="fw-bold">' + booking.tutorName + ' 튜터</div>' +
        '<div class="small text-muted mt-1">' +
        '<span class="badge text-bg-light me-1">' + booking.subject + '</span>' +
        '<span class="badge ' + badgeClass + '">' + booking.status + '</span>' +
        '</div>' +
        '</div>' +
        '<div class="text-end">' + cancelBtn + '</div>' +
        '</div>' +
        '<div class="row mt-3 g-2 small">' +
        '<div class="col-md-4">📅 ' + booking.date + '</div>' +
        '<div class="col-md-4">⏰ ' + booking.time + ' (' + booking.duration + '시간)</div>' +
        '<div class="col-md-4">💰 <span class="fw-semibold text-primary">' + formatNumberWithComma(booking.totalPrice) + '원</span></div>' +
        '</div>' +
        msg +
        '</div>' +
        '</div>'
    );
}

function initBookingsPage() {
    const $content = $('#bookingContent');
    if ($content.length === 0) return;

    const user = getCurrentUser();
    if (!user) {
        toast('로그인이 필요합니다');
        location.href = '/login';
        return;
    }

    const $empty = $('#bookingEmpty');
    const $upcomingList = $('#upcomingList');
    const $pastList = $('#pastList');
    const $upcomingCount = $('#upcomingCount');
    const $pastCount = $('#pastCount');

    function render() {
        const bookings = getBookings();
        if (!bookings || bookings.length === 0) {
            $content.addClass('d-none');
            $empty.removeClass('d-none');
            return;
        }

        $empty.addClass('d-none');
        $content.removeClass('d-none');

        const upcoming = bookings.filter(b => b.status === '예약됨');
        const past = bookings.filter(b => b.status === '완료' || b.status === '취소됨');

        $upcomingCount.text(upcoming.length);
        $pastCount.text(past.length);

        $upcomingList.html(upcoming.map(b => renderBookingCard(b, true)).join(''));
        $pastList.html(past.map(b => renderBookingCard(b, false)).join(''));

        $('.btn-cancel-booking').off('click').on('click', function () {
            const bookingId = String($(this).attr('data-booking-id') || '');
            if (!bookingId) return;

            if (window.confirm('정말로 이 예약을 취소하시겠습니까?')) {
                const updated = getBookings().map(b => {
                    if (String(b.id) === bookingId) {
                        return Object.assign({}, b, { status: '취소됨' });
                    }
                    return b;
                });
                setBookings(updated);
                toast('예약이 취소되었습니다');
                render();
            }
        });
    }

    render();
}

function initLoginPage() {
    const $loginForm = $('#loginForm');
    const $signupForm = $('#signupForm');
    if ($loginForm.length === 0 && $signupForm.length === 0) return;

    let userType = 'student';
    const $btnStudent = $('#userTypeStudent');
    const $btnTutor = $('#userTypeTutor');

    function setUserType(next) {
        userType = next;
        if (userType === 'student') {
            $btnStudent.addClass('btn-primary').removeClass('btn-outline-primary');
            $btnTutor.addClass('btn-outline-primary').removeClass('btn-primary');
        } else {
            $btnTutor.addClass('btn-primary').removeClass('btn-outline-primary');
            $btnStudent.addClass('btn-outline-primary').removeClass('btn-primary');
        }
    }

    $btnStudent.on('click', function () { setUserType('student'); });
    $btnTutor.on('click', function () { setUserType('tutor'); });

    setUserType('student');

    function inferRoleFromAuthList(authList) {
        if (!Array.isArray(authList)) return 'student';
        const auths = authList.map(a => String(a.auth || '').toUpperCase());
        if (auths.includes('ROLE_TUTOR')) return 'tutor';
        if (auths.includes('ROLE_ADMIN')) return 'admin';
        return 'student';
    }

    $loginForm.on('submit', function (e) {
        e.preventDefault();
        const fd = new FormData($loginForm.get(0));
        const email = String(fd.get('email') || '');
        const password = String(fd.get('password') || '');
        if (!email || !password) {
            toast('이메일과 비밀번호를 입력해주세요');
            return;
        }

        fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: email, password: password })
        })
            .then(res => res.json())
            .then(result => {
                if (!result || !result.success) {
                    toast('로그인 실패: ' + (result?.message || '오류'));
                    return;
                }

                const user = result.data || {};
                const currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.username,
                    role: inferRoleFromAuthList(user.authList)
                };

                setCurrentUser(currentUser);
                toast((currentUser.name || '사용자') + '님, 환영합니다!');
                location.href = '/';
            })
            .catch(err => {
                console.error(err);
                toast('로그인 중 오류가 발생했습니다');
            });
    });

    $signupForm.on('submit', function (e) {
        e.preventDefault();
        const fd = new FormData($signupForm.get(0));
        const name = String(fd.get('name') || '');
        const email = String(fd.get('email') || '');
        const password = String(fd.get('password') || '');
        const confirmPassword = String(fd.get('confirmPassword') || '');

        if (!name || !email || !password) {
            toast('모든 필드를 입력해주세요');
            return;
        }
        if (password !== confirmPassword) {
            toast('비밀번호가 일치하지 않습니다');
            return;
        }

        fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, username: email, password: password })
        })
            .then(res => res.json())
            .then(result => {
                if (!result || !result.success) {
                    toast('회원가입 실패: ' + (result?.message || '오류'));
                    return;
                }
                toast('회원가입이 완료되었습니다! 로그인해주세요');
                $('#tabLogin').tab('show');
            })
            .catch(err => {
                console.error(err);
                toast('회원가입 중 오류가 발생했습니다');
            });
    });
}

function initTutorDashboardMock() {
    const $buttons = $('.tutor-booking-action');
    if ($buttons.length === 0) return;

    let currentBookingData = null;

    // Handle button clicks to open modals
    $buttons.on('click', function () {
        const $btn = $(this);
        const action = String($btn.attr('data-action') || '');
        const bookingId = String($btn.attr('data-booking-id') || '');

        // Get booking data from the card
        const $card = $btn.closest('.card');
        const studentName = $card.find('.fw-bold').first().text();
        const studentEmail = $card.find('.text-muted.small').first().text();
        const dateText = $card.find('span').eq(0).text();
        const timeText = $card.find('span').eq(1).text();
        const durationText = $card.find('span').eq(2).text();
        const subjectText = $card.find('span').eq(3).text();
        const priceText = $card.find('.fw-semibold.text-primary').text();

        currentBookingData = {
            id: bookingId,
            studentName: studentName,
            studentEmail: studentEmail,
            date: dateText,
            time: timeText,
            duration: durationText,
            subject: subjectText,
            price: priceText
        };

        // Open appropriate modal
        if (action === 'accept') {
            $('#acceptStudentName').text(currentBookingData.studentName);
            $('#acceptDateTime').text(currentBookingData.date + ' ' + currentBookingData.time);
            $('#acceptSubject').text(currentBookingData.subject);
            $('#acceptPrice').text(currentBookingData.price);
            new bootstrap.Modal(document.getElementById('acceptModal')).show();
        } else if (action === 'reject') {
            $('#rejectStudentName').text(currentBookingData.studentName);
            $('#rejectDateTime').text(currentBookingData.date + ' ' + currentBookingData.time);
            $('#rejectSubject').text(currentBookingData.subject);
            $('#rejectReason').val('').removeClass('is-invalid');
            new bootstrap.Modal(document.getElementById('rejectModal')).show();
        } else if (action === 'complete') {
            $('#completeStudentName').text(currentBookingData.studentName);
            $('#completeDateTime').text(currentBookingData.date + ' ' + currentBookingData.time);
            $('#completeSubject').text(currentBookingData.subject);
            $('#completePrice').text(currentBookingData.price);
            $('#completeNotes').val('');
            new bootstrap.Modal(document.getElementById('completeModal')).show();
        }
    });

    // Handle confirm accept
    $('#confirmAccept').on('click', function () {
        showSuccessToast('예약을 확정했습니다! 학생에게 알림이 전송되었습니다.');
        bootstrap.Modal.getInstance(document.getElementById('acceptModal')).hide();
        // In real implementation, would update booking status via API
    });

    // Handle confirm reject
    $('#confirmReject').on('click', function () {
        const reason = $('#rejectReason').val().trim();
        if (!reason) {
            $('#rejectReason').addClass('is-invalid');
            return;
        }
        $('#rejectReason').removeClass('is-invalid');
        showSuccessToast('예약을 거절했습니다. 학생에게 거절 사유가 전송되었습니다.');
        bootstrap.Modal.getInstance(document.getElementById('rejectModal')).hide();
        // In real implementation, would update booking status and send reason via API
    });

    // Handle confirm complete
    $('#confirmComplete').on('click', function () {
        const notes = $('#completeNotes').val().trim();
        showSuccessToast('수업을 완료 처리했습니다!');
        bootstrap.Modal.getInstance(document.getElementById('completeModal')).hide();
        // In real implementation, would update booking status and save notes via API
    });

    // Clear validation on input
    $('#rejectReason').on('input', function () {
        $(this).removeClass('is-invalid');
    });
}

function initMemberMyPage() {
    
    function inferRoleFromAuthList(authList) {
        if (!Array.isArray(authList)) return 'student';
        const auths = authList.map(a => String(a.auth || '').toUpperCase());
        if (auths.includes('ROLE_TUTOR')) return 'tutor';
        if (auths.includes('ROLE_ADMIN')) return 'admin';
        return 'student';
    }

    const $memberName = $('#memberName');
    const $memberEmail = $('#memberEmail');
    const $tutorName = $('#tutorName');
    const $tutorEmail = $('#tutorEmail');

    if ($memberName.length === 0 && $memberEmail.length === 0 && $tutorName.length === 0 && $tutorEmail.length === 0) {
        return;
    }

    fetch('/api/users/me', {
        method: 'GET',
        credentials: 'same-origin'
    })
        .then(res => res.json())
        .then(result => {
            if (!result || !result.success) {
                toast('로그인이 필요합니다');
                location.href = '/login';
                return;
            }

            const user = result.data || {};
            const role = inferRoleFromAuthList(user.authList);

            const displayName = user.nickname || user.name || '사용자';
            const displayEmail = user.username || '';

            if (role === 'tutor') {
                if ($tutorName.length) $tutorName.text(displayName);
                if ($tutorEmail.length) $tutorEmail.text(displayEmail);
            } else {
                if ($memberName.length) $memberName.text(displayName);
                if ($memberEmail.length) $memberEmail.text(displayEmail);
            }
        })
        .catch(err => {
            console.error(err);
            toast('회원 정보를 불러오지 못했습니다');
        });
}

function showSuccessToast(message) {
    // Create a better toast notification
    const toastHtml = `
        <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999">
            <div class="toast show" role="alert">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">✓ 성공</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        </div>
    `;

    const $toast = $(toastHtml);
    $('body').append($toast);

    setTimeout(function () {
        $toast.find('.toast').removeClass('show');
        setTimeout(function () {
            $toast.remove();
        }, 300);
    }, 3000);
}

$(function () {
    updateHeaderForUser();
    initTutorListFiltering();
    initBookingForm();
    initBookingsPage();
    initLoginPage();
    initTutorDashboardMock();
    initMemberMyPage();
});
