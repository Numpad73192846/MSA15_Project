// 사용자 정의 자바스크립트

document.addEventListener('DOMContentLoaded', function() {
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
    if ($area.length === 0) return;

    const user = getCurrentUser();
    if (!user) {
        $area.html(
            '<button class="btn btn-outline-primary" onclick="location.href=\'/login\'">로그인</button>' +
            '<button class="btn btn-primary" onclick="location.href=\'/login\'">회원가입</button>'
        );
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

    $('#btnLogout').on('click', function() {
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

        $('.tutor-card').each(function() {
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

    $form.on('submit', function(e) {
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

        $('.btn-cancel-booking').off('click').on('click', function() {
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

    $btnStudent.on('click', function() { setUserType('student'); });
    $btnTutor.on('click', function() { setUserType('tutor'); });

    setUserType('student');

    $loginForm.on('submit', function(e) {
        e.preventDefault();
        const fd = new FormData($loginForm.get(0));
        const email = String(fd.get('email') || '');
        const password = String(fd.get('password') || '');
        if (!email || !password) {
            toast('이메일과 비밀번호를 입력해주세요');
            return;
        }

        const mockUser = {
            id: String(Date.now()),
            name: userType === 'tutor' ? '김민지 튜터' : '홍길동',
            email: email,
            role: userType
        };

        setCurrentUser(mockUser);
        toast(mockUser.name + '님, 환영합니다!');
        location.href = '/';
    });

    $signupForm.on('submit', function(e) {
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

        const mockUser = {
            id: String(Date.now()),
            name: name,
            email: email,
            role: userType
        };

        setCurrentUser(mockUser);
        toast('회원가입이 완료되었습니다!');
        location.href = '/';
    });
}

function initTutorDashboardMock() {
    const $buttons = $('.tutor-booking-action');
    if ($buttons.length === 0) return;

    $buttons.on('click', function() {
        const action = String($(this).attr('data-action') || '');
        if (action === 'accept') toast('예약을 확정했습니다');
        else if (action === 'reject') toast('예약을 거절했습니다');
        else if (action === 'complete') toast('수업을 완료 처리했습니다');
    });
}

$(function() {
    updateHeaderForUser();
    initTutorListFiltering();
    initBookingForm();
    initBookingsPage();
    initLoginPage();
    initTutorDashboardMock();
});
