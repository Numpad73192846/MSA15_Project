
-- 관리자 계정 생성 id: admin@local.com password: Admin102938$&
SET @admin_id = UUID();

INSERT INTO users (id, username, password, name, nickname, status)
VALUES (
  @admin_id,
  'admin@local.com',
  '$2a$10$H0BAEl9U9wCjOdkvsSlOK.E3FtKW8hm4Cj2/RaEvPos3/ww2O3jUu',
  '관리자',
  'admin',
  'ACTIVE'
);

INSERT INTO user_auth (user_id, id, auth)
VALUES (@admin_id, UUID(), 'ROLE_ADMIN');


-- 테스트 유저 데이터 삽입
INSERT INTO users (id, username, password, name, nickname)
VALUES
('u-tutor-1','tutor1@test.com', '{noop}1234', '김튜터', '수학마스터'),
('u-tutor-2','tutor2@test.com', '{noop}1234', '이튜터', '영어천재'),
('u-student-1','student1@test.com', '{noop}1234', '박학생', '열공중');

-- 테스트 유저 권한 데이터 삽입
INSERT INTO user_auth (user_id, id, auth)
VALUES
('u-tutor-1', 'ua-1', 'ROLE_TUTOR'),
('u-tutor-2', 'ua-2', 'ROLE_TUTOR'),
('u-student-1', 'ua-3', 'ROLE_USER');

-- 테스트 튜터 프로필 데이터 삽입
INSERT INTO tutor_profile (user_id, id, headline, bio, is_verified, rating_avg, review_count)
VALUES
('u-tutor-1', 'tp-1', '수학 전문 튜터', '중고등 수학 10년 경력', TRUE, 4.8, 12),
('u-tutor-2', 'tp-2', '영어 회화 튜터', '미국 거주 5년', TRUE, 4.5, 8);

-- 테스트 과목 그룹 및 과목 데이터 삽입
INSERT INTO subject_group (id, name, seq)
VALUES
('sg-math', '수학', 1),
('sg-eng', '영어', 2);

-- 테스트 언어 분야 데이터 삽입
INSERT INTO language_field (id, name, category, seq)
VALUES
('lf-general-1', '회화', 'GENERAL', 1),
('lf-general-2', '문법', 'GENERAL', 2),
('lf-general-3', '읽기', 'GENERAL', 3),
('lf-general-4', '작문', 'GENERAL', 4),
('lf-general-5', '발음', 'GENERAL', 5),
('lf-domain-1', '학교', 'DOMAIN', 1),
('lf-domain-2', '비즈니스', 'DOMAIN', 2),
('lf-domain-3', '여행', 'DOMAIN', 3),
('lf-domain-4', '영화', 'DOMAIN', 4),
('lf-domain-5', '드라마', 'DOMAIN', 5),
('lf-domain-6', '노래', 'DOMAIN', 6),
('lf-domain-7', '문화', 'DOMAIN', 7);

INSERT INTO subject (group_id, id, name, seq_in_group)
VALUES
('sg-math', 'sub-math-1', '중등 수학', 1),
('sg-math', 'sub-math-2', '고등 수학', 2),
('sg-eng', 'sub-eng-1', '영어 회화', 1);

-- 테스트 튜터 과목 매핑 데이터 삽입
INSERT INTO tutor_subject (user_id, subject_id, id, seq)
VALUES
('u-tutor-1', 'sub-math-1', 'ts-1', 1),
('u-tutor-1', 'sub-math-2', 'ts-2', 2),
('u-tutor-2', 'sub-eng-1', 'ts-3', 1);

-- 테스트 튜터 분야 매핑 데이터 삽입
INSERT INTO tutor_field (user_id, field_id, id, seq)
VALUES
('u-tutor-1', 'lf-general-1', 'tf-1', 1),
('u-tutor-1', 'lf-domain-1', 'tf-2', 2),
('u-tutor-2', 'lf-general-1', 'tf-3', 1),
('u-tutor-2', 'lf-domain-2', 'tf-4', 2);

-- 테스트 레슨 데이터 삽입
INSERT INTO lesson (user_id, subject_id, id, title, description, price)
VALUES
('u-tutor-1', 'sub-math-1', 'lesson-1', '중등 수학 기초', '개념부터 탄탄히', 30000),
('u-tutor-2', 'sub-eng-1', 'lesson-2', '영어 회화 입문', '실전 회화 중심', 40000);

-- 테스트 튜터 가능 시간 데이터 삽입
INSERT INTO tutor_availability (user_id, id, start_at, end_at)
VALUES
('u-tutor-1', 'avail-1', '2026-02-01 10:00:00', '2026-02-01 11:00:00'),
('u-tutor-2', 'avail-2', '2026-02-01 14:00:00', '2026-02-01 15:00:00');

-- 테스트 예약 데이터 삽입
INSERT INTO booking (user_id, lesson_id, availability_id, id, title, requested_at, confirmed_at)
VALUES
('u-student-1', 'lesson-1', 'avail-1', 'book-1', '중등 수학 예약',
 NOW(), NOW()),
('u-student-1', 'lesson-2', 'avail-2', 'book-2', '영어 회화 예약',
 NOW(), NOW());

-- 테스트 결제 데이터 삽입
INSERT INTO payment (user_id, booking_id, id, amount, provider, status, paid_at)
VALUES
('u-student-1', 'book-1', 'pay-1', 30000, 'CARD', 'PAID', NOW());

-- 테스트 리뷰 데이터 삽입
INSERT INTO review (booking_id, id, rating, content)
VALUES
('book-1', 'review-1', 5, '설명이 정말 이해 잘 됐어요!');

-- 테스트 추천 튜터 데이터 삽입
INSERT INTO featured_tutor (user_id, id, seq, visible)
VALUES
('u-tutor-1', 'ft-1', 1, TRUE),
('u-tutor-2', 'ft-2', 2, TRUE);