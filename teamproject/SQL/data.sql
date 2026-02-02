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

<<<<<<< HEAD
-- 테스트 학생, 튜터 데이터 삽입 (30명)
=======

-- 테스트 유저 데이터 삽입
>>>>>>> origin/cheshire
INSERT INTO users (id, username, password, name, nickname)
VALUES
('u-student-1','student1@test.com', '{noop}1234', '박학생', '열공중'),
('u-student-2','student2@test.com', '{noop}1234', '김학생', '공부천재'),
('u-student-3','student3@test.com', '{noop}1234', '이학생', '영어초보'),
('u-student-4','student4@test.com', '{noop}1234', '최학생', '수학도사'),
('u-student-5','student5@test.com', '{noop}1234', '정학생', '회화도사'),
('u-student-6','student6@test.com', '{noop}1234', '조학생', '시험준비중'),
('u-student-7','student7@test.com', '{noop}1234', '윤학생', '실무영어'),
('u-student-8','student8@test.com', '{noop}1234', '장학생', '발음교정'),
('u-student-9','student9@test.com', '{noop}1234', '임학생', '토익준비'),
('u-student-10','student10@test.com', '{noop}1234', '하학생', '일본어시작'),
('u-tutor-1','tutor1@test.com', '{noop}1234', '김튜터', '수학마스터'),
('u-tutor-2','tutor2@test.com', '{noop}1234', '이튜터', '영어천재'),
('u-tutor-3','tutor3@test.com', '{noop}1234', '박튜터', '회화전문'),
('u-tutor-4','tutor4@test.com', '{noop}1234', '최튜터', '발음완벽'),
('u-tutor-5','tutor5@test.com', '{noop}1234', '정튜터', '문법마스터'),
('u-tutor-6','tutor6@test.com', '{noop}1234', '조튜터', '토익강사'),
('u-tutor-7','tutor7@test.com', '{noop}1234', '윤튜터', '중국어전문'),
('u-tutor-8','tutor8@test.com', '{noop}1234', '장튜터', '일본어마스터'),
('u-tutor-9','tutor9@test.com', '{noop}1234', '임튜터', '스페인어'),
('u-tutor-10','tutor10@test.com', '{noop}1234', '하튜터', '비즈니스영어'),
('u-tutor-11','tutor11@test.com', '{noop}1234', '강튜터', '드라마로배우는영어'),
('u-tutor-12','tutor12@test.com', '{noop}1234', '고튜터', '노래로배우는영어'),
('u-tutor-13','tutor13@test.com', '{noop}1234', '곽튜터', '영어문화'),
('u-tutor-14','tutor14@test.com', '{noop}1234', '구튜터', '여행영어'),
('u-tutor-15','tutor15@test.com', '{noop}1234', '권튜터', '어린이영어'),
('u-tutor-16','tutor16@test.com', '{noop}1234', '김동튜터', '고등수학'),
('u-tutor-17','tutor17@test.com', '{noop}1234', '김선튜터', '중등수학'),
('u-tutor-18','tutor18@test.com', '{noop}1234', '김주튜터', '물리전문'),
('u-tutor-19','tutor19@test.com', '{noop}1234', '김찬튜터', '화학전문'),
('u-tutor-20','tutor20@test.com', '{noop}1234', '김태튜터', '생물전문');

-- 테스트 학생, 튜터 권한 데이터 삽입 (30명)
INSERT INTO user_auth (user_id, id, auth)
VALUES
('u-student-1', 'ua-s1', 'ROLE_USER'),
('u-student-2', 'ua-s2', 'ROLE_USER'),
('u-student-3', 'ua-s3', 'ROLE_USER'),
('u-student-4', 'ua-s4', 'ROLE_USER'),
('u-student-5', 'ua-s5', 'ROLE_USER'),
('u-student-6', 'ua-s6', 'ROLE_USER'),
('u-student-7', 'ua-s7', 'ROLE_USER'),
('u-student-8', 'ua-s8', 'ROLE_USER'),
('u-student-9', 'ua-s9', 'ROLE_USER'),
('u-student-10', 'ua-s10', 'ROLE_USER'),
('u-tutor-1', 'ua-t1', 'ROLE_TUTOR'),
('u-tutor-2', 'ua-t2', 'ROLE_TUTOR'),
('u-tutor-3', 'ua-t3', 'ROLE_TUTOR'),
('u-tutor-4', 'ua-t4', 'ROLE_TUTOR'),
('u-tutor-5', 'ua-t5', 'ROLE_TUTOR'),
('u-tutor-6', 'ua-t6', 'ROLE_TUTOR'),
('u-tutor-7', 'ua-t7', 'ROLE_TUTOR'),
('u-tutor-8', 'ua-t8', 'ROLE_TUTOR'),
('u-tutor-9', 'ua-t9', 'ROLE_TUTOR'),
('u-tutor-10', 'ua-t10', 'ROLE_TUTOR'),
('u-tutor-11', 'ua-t11', 'ROLE_TUTOR'),
('u-tutor-12', 'ua-t12', 'ROLE_TUTOR'),
('u-tutor-13', 'ua-t13', 'ROLE_TUTOR'),
('u-tutor-14', 'ua-t14', 'ROLE_TUTOR'),
('u-tutor-15', 'ua-t15', 'ROLE_TUTOR'),
('u-tutor-16', 'ua-t16', 'ROLE_TUTOR'),
('u-tutor-17', 'ua-t17', 'ROLE_TUTOR'),
('u-tutor-18', 'ua-t18', 'ROLE_TUTOR'),
('u-tutor-19', 'ua-t19', 'ROLE_TUTOR'),
('u-tutor-20', 'ua-t20', 'ROLE_TUTOR');

-- 테스트 튜터 프로필 데이터 삽입 (20명)
INSERT INTO tutor_profile (user_id, id, headline, bio, is_verified, rating_avg, review_count)
VALUES
('u-tutor-1', 'tp-1', '수학 전문 튜터', '중고등 수학 10년 경력, 국제학교 출신', TRUE, 4.9, 45),
('u-tutor-2', 'tp-2', '영어 회화 튜터', '미국 거주 5년, 원어민 발음', TRUE, 4.8, 38),
('u-tutor-3', 'tp-3', '회화 전문가', 'BBC 라디오 진행자 출신, 실전회화 중심', TRUE, 4.9, 52),
('u-tutor-4', 'tp-4', '발음 전문가', '발음교정 전문, 미국 음성학 자격증', TRUE, 4.9, 41),
('u-tutor-5', 'tp-5', '문법의 정석', '영어문법 20년 경력, 논리적 설명', TRUE, 4.8, 35),
('u-tutor-6', 'tp-6', 'TOEIC 강사', '만점자, 실전 문제집 저자', TRUE, 4.9, 48),
('u-tutor-7', 'tp-7', '중국어 전문가', '중국 베이징 대학 졸업, HSK 6급', TRUE, 4.7, 28),
('u-tutor-8', 'tp-8', '일본어 마스터', '일본 도쿄 거주 3년, JLPT N1', TRUE, 4.8, 33),
('u-tutor-9', 'tp-9', '스페인어 강사', '스페인 바르셀로나 유학생, 실전 회화', TRUE, 4.6, 22),
('u-tutor-10', 'tp-10', '비즈니스 영어', '국제기업 경력 8년, 협상 전문', TRUE, 4.9, 39),
('u-tutor-11', 'tp-11', '드라마로 배우기', '넷플릭스로 배우는 일상영어', TRUE, 4.7, 26),
('u-tutor-12', 'tp-12', '노래로 배우기', '팝송과 뮤지컬로 배우는 영어', TRUE, 4.8, 30),
('u-tutor-13', 'tp-13', '영어 문화 강사', '영미 문화 전문, 교양영어', TRUE, 4.7, 25),
('u-tutor-14', 'tp-14', '여행 영어 전문', '50개국 여행경험, 실용 여행영어', TRUE, 4.8, 32),
('u-tutor-15', 'tp-15', '어린이 영어', '유아교육과 졸업, 재미있는 수업', TRUE, 4.8, 36),
('u-tutor-16', 'tp-16', '고등수학 전문', '수능만점자, 과학고 출신', TRUE, 4.9, 44),
('u-tutor-17', 'tp-17', '중등수학 강사', '중1~3 전과정 완벽 정리', TRUE, 4.8, 37),
('u-tutor-18', 'tp-18', '물리 전문가', '입시물리 15년 경력, 원리 중심', TRUE, 4.9, 43),
('u-tutor-19', 'tp-19', '화학 강사', '화학반응 시각화 전문, 실험중심', TRUE, 4.8, 34),
('u-tutor-20', 'tp-20', '생물 전문가', '의학계열 입시 전문, 생명과학 수능만점', TRUE, 4.8, 40);

-- 테스트 과목 그룹 및 과목 데이터 삽입
INSERT INTO subject_group (id, name, seq)
VALUES
<<<<<<< HEAD
('sg-kor', '한국어', 1),
('sg-eng', '영어', 2),
('sg-chn', '중국어', 3),
('sg-jpn', '일본어', 4);
=======
('sg-1', '한국어', 1),
('sg-2', '영어', 2),
('sg-3', '중국어', 3),
('sg-4', '일본어', 4),
('sg-5', '스페인어', 5),
('sg-6', '스페인어', 6),
('sg-7', '기타', 7);
>>>>>>> origin/cheshire

-- 테스트 언어 분야 데이터 삽입
INSERT INTO language_field (id, name, category, seq)
VALUES
('lf-general-1', '회화', 'GENERAL', 1),
('lf-general-2', '문법', 'GENERAL', 2),
('lf-general-3', '읽기', 'GENERAL', 3),
('lf-general-4', '작문', 'GENERAL', 4),
('lf-general-5', '발음', 'GENERAL', 5),
('lf-general-6', '청취', 'GENERAL', 6),
('lf-domain-1', '학교', 'DOMAIN', 1),
('lf-domain-2', '비즈니스', 'DOMAIN', 2),
('lf-domain-3', '여행', 'DOMAIN', 3),
('lf-domain-4', '영화', 'DOMAIN', 4),
('lf-domain-5', '드라마', 'DOMAIN', 5),
('lf-domain-6', '노래', 'DOMAIN', 6),
('lf-domain-7', '문화', 'DOMAIN', 7);

INSERT INTO subject (group_id, id, name, seq_in_group)
VALUES
('sg-kor', 'sub-kor-1', '중등 한국어', 1),
('sg-kor', 'sub-kor-2', '고등 한국어', 2),
('sg-kor', 'sub-kor-3', '비지니스 한국어', 3),
('sg-eng', 'sub-eng-1', '영어 회화', 1),
('sg-eng', 'sub-eng-2', '영어 문법', 2),
('sg-eng', 'sub-eng-3', 'TOEIC', 3),
('sg-chn', 'sub-chn-1', '중국어', 1),
('sg-chn', 'sub-chn-3', '비지니스 중국어', 3),
('sg-jpn', 'sub-jpn-1', '일본어', 1),
('sg-jpn', 'sub-jpn-2', '일본어 회화', 2),
('sg-jpn', 'sub-jpn-3', '비지니스 일본어', 3);
-- 테스트 튜터 과목 매핑 데이터 삽입 (20명 튜터 + 각 과목)
INSERT INTO tutor_subject (user_id, subject_id, id, seq)
VALUES
('u-tutor-1', 'sub-kor-1', 'ts-1-1', 1),
('u-tutor-1', 'sub-kor-2', 'ts-1-2', 2),
('u-tutor-2', 'sub-eng-1', 'ts-2-1', 1),
('u-tutor-3', 'sub-eng-1', 'ts-3-1', 1),
('u-tutor-4', 'sub-eng-1', 'ts-4-1', 1),
('u-tutor-5', 'sub-eng-2', 'ts-5-1', 1),
('u-tutor-6', 'sub-eng-3', 'ts-6-1', 1),
('u-tutor-7', 'sub-chn-1', 'ts-7-1', 1),
('u-tutor-8', 'sub-jpn-2', 'ts-8-1', 1),
('u-tutor-9', 'sub-chn-3', 'ts-9-1', 1),
('u-tutor-10', 'sub-eng-1', 'ts-10-1', 1),
('u-tutor-11', 'sub-eng-1', 'ts-11-1', 1),
('u-tutor-12', 'sub-eng-1', 'ts-12-1', 1),
('u-tutor-13', 'sub-eng-1', 'ts-13-1', 1),
('u-tutor-14', 'sub-eng-1', 'ts-14-1', 1),
('u-tutor-15', 'sub-eng-1', 'ts-15-1', 1),
('u-tutor-16', 'sub-kor-2', 'ts-16-1', 1),
('u-tutor-17', 'sub-kor-1', 'ts-17-1', 1),
('u-tutor-18', 'sub-kor-3', 'ts-18-1', 1),
('u-tutor-19', 'sub-kor-2', 'ts-19-1', 1),
('u-tutor-20', 'sub-kor-3', 'ts-20-1', 1);

-- 테스트 튜터 분야 매핑 데이터 삽입
INSERT INTO tutor_field (user_id, field_id, id, seq)
VALUES
('u-tutor-1', 'lf-general-1', 'tf-1-1', 1),
('u-tutor-1', 'lf-domain-1', 'tf-1-2', 2),
('u-tutor-2', 'lf-general-1', 'tf-2-1', 1),
('u-tutor-2', 'lf-domain-2', 'tf-2-2', 2),
('u-tutor-3', 'lf-general-1', 'tf-3-1', 1),
('u-tutor-4', 'lf-general-5', 'tf-4-1', 1),
('u-tutor-5', 'lf-general-2', 'tf-5-1', 1),
('u-tutor-6', 'lf-general-1', 'tf-6-1', 1),
('u-tutor-7', 'lf-general-1', 'tf-7-1', 1),
('u-tutor-8', 'lf-general-1', 'tf-8-1', 1),
('u-tutor-9', 'lf-general-1', 'tf-9-1', 1),
('u-tutor-10', 'lf-domain-2', 'tf-10-1', 1),
('u-tutor-11', 'lf-domain-5', 'tf-11-1', 1),
('u-tutor-12', 'lf-domain-6', 'tf-12-1', 1),
('u-tutor-13', 'lf-domain-7', 'tf-13-1', 1),
('u-tutor-14', 'lf-domain-3', 'tf-14-1', 1),
('u-tutor-15', 'lf-general-1', 'tf-15-1', 1),
('u-tutor-16', 'lf-general-1', 'tf-16-1', 1),
('u-tutor-17', 'lf-general-1', 'tf-17-1', 1),
('u-tutor-18', 'lf-general-1', 'tf-18-1', 1),
('u-tutor-19', 'lf-general-1', 'tf-19-1', 1),
('u-tutor-20', 'lf-general-1', 'tf-20-1', 1);

-- 테스트 레슨 데이터 삽입 (20명 튜터 각각 1~2개 레슨)
INSERT INTO lesson (user_id, subject_id, id, title, description, price, status)
VALUES
('u-tutor-1', 'sub-kor-1', 'lesson-1', '중등 한국어 기초', '개념부터 탄탄히, 실력있는 강사와 함께', 30000, 'OPEN'),
('u-tutor-1', 'sub-kor-2', 'lesson-1-2', '고등 한국어 심화', '수능 만점을 위한 집중 강좌', 35000, 'OPEN'),
('u-tutor-2', 'sub-eng-1', 'lesson-2', '영어 회화 입문', '실전 회화 중심, 원어민 발음', 40000, 'OPEN'),
('u-tutor-3', 'sub-eng-1', 'lesson-3', '일상 회화 완성', '일상에서 바로 쓸 수 있는 표현', 38000, 'OPEN'),
('u-tutor-4', 'sub-eng-1', 'lesson-4', '발음 완벽 마스터', '미국 발음, 영국 발음 완벽 구분', 42000, 'OPEN'),
('u-tutor-5', 'sub-eng-2', 'lesson-5', '문법의 정석', '기초부터 고급까지 문법 완정복', 35000, 'OPEN'),
('u-tutor-6', 'sub-eng-3', 'lesson-6', 'TOEIC 집중반', '950점 이상 목표, 문제풀이 중심', 45000, 'OPEN'),
('u-tutor-7', 'sub-chn-1', 'lesson-7', '중국어 기초', 'HSK 3급까지 완전 정복', 32000, 'OPEN'),
('u-tutor-8', 'sub-jpn-2', 'lesson-8', '일본어 초급', 'JLPT N4까지 목표', 33000, 'OPEN'),
('u-tutor-9', 'sub-chn-3', 'lesson-9', '비즈니스 중국어', '비즈니스 회의와 협상용', 34000, 'OPEN'),
('u-tutor-10', 'sub-eng-1', 'lesson-10', '비즈니스 영어', '국제회의, 이메일 작성 완벽 가이드', 50000, 'OPEN'),
('u-tutor-11', 'sub-eng-1', 'lesson-11', '드라마로 배우는 영어', '넷플릭스 드라마로 재미있게', 36000, 'OPEN'),
('u-tutor-12', 'sub-eng-1', 'lesson-12', '노래로 배우는 영어', '팝송과 뮤지컬로 자연스럽게', 37000, 'OPEN'),
('u-tutor-13', 'sub-eng-1', 'lesson-13', '영어 문화', '영미권 문화와 함께 배우는 영어', 38000, 'OPEN'),
('u-tutor-14', 'sub-eng-1', 'lesson-14', '여행 영어', '세계 여행을 위한 실용 영어', 39000, 'OPEN'),
('u-tutor-15', 'sub-eng-1', 'lesson-15', '어린이 영어', '아이들을 위한 재미있는 영어 수업', 25000, 'OPEN'),
('u-tutor-16', 'sub-kor-2', 'lesson-16', '수능 한국어 만점반', '년 20명 수능 만점자 배출', 40000, 'OPEN'),
('u-tutor-17', 'sub-kor-1', 'lesson-17', '한국어를 쉽게', '개념 설명 최고 강사', 28000, 'OPEN'),
('u-tutor-18', 'sub-kor-3', 'lesson-18', '한국어 입시 완성', '한국어 문제풀이 전문', 41000, 'OPEN'),
('u-tutor-19', 'sub-kor-2', 'lesson-19', '한국어 반응 마스터', '한국어 반응식 완벽 정리', 39000, 'OPEN'),
('u-tutor-20', 'sub-kor-3', 'lesson-20', '한국어 수능 만점', '의학계 입시 전문가', 42000, 'OPEN');

-- 테스트 튜터 가능 시간 데이터 삽입 (모든 튜터)
INSERT INTO tutor_availability (user_id, id, start_at, end_at, status)
VALUES
('u-tutor-1', 'avail-1', '2026-02-03 10:00:00', '2026-02-03 11:00:00', 'OPEN'),
('u-tutor-1', 'avail-1-2', '2026-02-03 14:00:00', '2026-02-03 15:00:00', 'OPEN'),
('u-tutor-2', 'avail-2', '2026-02-03 09:00:00', '2026-02-03 10:00:00', 'OPEN'),
('u-tutor-2', 'avail-2-2', '2026-02-03 16:00:00', '2026-02-03 17:00:00', 'OPEN'),
('u-tutor-3', 'avail-3', '2026-02-03 11:00:00', '2026-02-03 12:00:00', 'OPEN'),
('u-tutor-4', 'avail-4', '2026-02-03 13:00:00', '2026-02-03 14:00:00', 'OPEN'),
('u-tutor-5', 'avail-5', '2026-02-03 10:00:00', '2026-02-03 11:00:00', 'OPEN'),
('u-tutor-6', 'avail-6', '2026-02-03 15:00:00', '2026-02-03 16:00:00', 'OPEN'),
('u-tutor-7', 'avail-7', '2026-02-03 18:00:00', '2026-02-03 19:00:00', 'OPEN'),
('u-tutor-8', 'avail-8', '2026-02-03 19:00:00', '2026-02-03 20:00:00', 'OPEN'),
('u-tutor-9', 'avail-9', '2026-02-03 17:00:00', '2026-02-03 18:00:00', 'OPEN'),
('u-tutor-10', 'avail-10', '2026-02-03 09:00:00', '2026-02-03 10:00:00', 'OPEN'),
('u-tutor-11', 'avail-11', '2026-02-03 14:00:00', '2026-02-03 15:00:00', 'OPEN'),
('u-tutor-12', 'avail-12', '2026-02-03 16:00:00', '2026-02-03 17:00:00', 'OPEN'),
('u-tutor-13', 'avail-13', '2026-02-03 10:00:00', '2026-02-03 11:00:00', 'OPEN'),
('u-tutor-14', 'avail-14', '2026-02-03 15:00:00', '2026-02-03 16:00:00', 'OPEN'),
('u-tutor-15', 'avail-15', '2026-02-03 11:00:00', '2026-02-03 12:00:00', 'OPEN'),
('u-tutor-16', 'avail-16', '2026-02-03 19:00:00', '2026-02-03 20:00:00', 'OPEN'),
('u-tutor-17', 'avail-17', '2026-02-03 17:00:00', '2026-02-03 18:00:00', 'OPEN'),
('u-tutor-18', 'avail-18', '2026-02-03 20:00:00', '2026-02-03 21:00:00', 'OPEN'),
('u-tutor-19', 'avail-19', '2026-02-03 18:00:00', '2026-02-03 19:00:00', 'OPEN'),
('u-tutor-20', 'avail-20', '2026-02-03 21:00:00', '2026-02-03 22:00:00', 'OPEN');

-- 테스트 예약 데이터 삽입 (학생들이 튜터 레슨 예약)
INSERT INTO booking (user_id, lesson_id, availability_id, id, title, requested_at, confirmed_at)
VALUES
('u-student-1', 'lesson-1', 'avail-1', 'book-1', '중등 수학 예약', NOW(), NOW()),
('u-student-2', 'lesson-2', 'avail-2', 'book-2', '영어 회화 예약', NOW(), NOW()),
('u-student-3', 'lesson-3', 'avail-3', 'book-3', '일상 회화 예약', NOW(), NOW()),
('u-student-4', 'lesson-4', 'avail-4', 'book-4', '발음 교정 예약', NOW(), NOW()),
('u-student-5', 'lesson-5', 'avail-5', 'book-5', '문법 수업 예약', NOW(), NOW()),
('u-student-6', 'lesson-6', 'avail-6', 'book-6', 'TOEIC 예약', NOW(), NOW()),
('u-student-7', 'lesson-10', 'avail-10', 'book-7', '비즈니스 영어 예약', NOW(), NOW()),
('u-student-8', 'lesson-11', 'avail-11', 'book-8', '드라마 영어 예약', NOW(), NOW()),
('u-student-9', 'lesson-14', 'avail-14', 'book-9', '여행 영어 예약', NOW(), NOW()),
('u-student-10', 'lesson-16', 'avail-16', 'book-10', '수능 수학 예약', NOW(), NOW()),
('u-student-1', 'lesson-2', 'avail-2-2', 'book-11', '영어 회화 추가 예약', DATE_ADD(NOW(), INTERVAL 1 DAY), NULL),
('u-student-2', 'lesson-3', 'avail-3', 'book-12', '일상 회화 추가', DATE_ADD(NOW(), INTERVAL 2 DAY), NULL),
('u-student-3', 'lesson-7', 'avail-7', 'book-13', '중국어 시작', NOW(), NOW()),
('u-student-4', 'lesson-8', 'avail-8', 'book-14', '일본어 시작', NOW(), NOW()),
('u-student-5', 'lesson-18', 'avail-18', 'book-15', '물리 예약', NOW(), NOW());

-- 테스트 결제 데이터 삽입
INSERT INTO payment (user_id, booking_id, id, amount, provider, status, paid_at)
VALUES
('u-student-1', 'book-1', 'pay-1', 30000, 'CARD', 'PAID', NOW()),
('u-student-2', 'book-2', 'pay-2', 40000, 'CARD', 'PAID', NOW()),
('u-student-3', 'book-3', 'pay-3', 38000, 'CARD', 'PAID', NOW()),
('u-student-4', 'book-4', 'pay-4', 42000, 'CARD', 'PAID', NOW()),
('u-student-5', 'book-5', 'pay-5', 35000, 'CARD', 'PAID', NOW()),
('u-student-6', 'book-6', 'pay-6', 45000, 'TRANSFER', 'PAID', NOW()),
('u-student-7', 'book-7', 'pay-7', 50000, 'CARD', 'PAID', NOW()),
('u-student-8', 'book-8', 'pay-8', 36000, 'CARD', 'PAID', NOW()),
('u-student-9', 'book-9', 'pay-9', 39000, 'CARD', 'PAID', NOW()),
('u-student-10', 'book-10', 'pay-10', 40000, 'CARD', 'PAID', NOW()),
('u-student-1', 'book-11', 'pay-11', 40000, 'CARD', 'PENDING', NULL),
('u-student-2', 'book-12', 'pay-12', 38000, 'TRANSFER', 'PENDING', NULL),
('u-student-3', 'book-13', 'pay-13', 32000, 'CARD', 'PAID', NOW()),
('u-student-4', 'book-14', 'pay-14', 33000, 'CARD', 'PAID', NOW()),
('u-student-5', 'book-15', 'pay-15', 41000, 'CARD', 'PAID', NOW());

-- 테스트 리뷰 데이터 삽입
INSERT INTO review (booking_id, id, rating, content)
VALUES
('book-1', 'review-1', 5, '설명이 정말 이해 잘 됐어요! 다시 수강하고 싶습니다.'),
('book-2', 'review-2', 5, '원어민 발음이 정말 좋아요. 추천합니다!'),
('book-3', 'review-3', 4, '친절하고 자세한 설명이 좋았어요.'),
('book-4', 'review-4', 5, '발음 교정이 정말 도움됐습니다. 감사합니다!'),
('book-5', 'review-5', 5, '문법을 논리적으로 설명해주셔서 이해가 쉬웠어요.'),
('book-6', 'review-6', 4, 'TOEIC 문제풀이가 체계적이에요.'),
('book-7', 'review-7', 5, '비즈니스 영어 표현을 많이 배웠습니다!'),
('book-8', 'review-8', 5, '드라마를 보면서 배우니까 정말 재미있어요!'),
('book-9', 'review-9', 4, '여행 준비하는데 정말 도움됐어요.'),
('book-10', 'review-10', 5, '수능 준비가 체계적이에요. 강추합니다!');

-- 테스트 추천 튜터 데이터 삽입 (상위 5명)
INSERT INTO featured_tutor (user_id, id, seq, visible)
VALUES
('u-tutor-1', 'ft-1', 1, TRUE),
<<<<<<< HEAD
('u-tutor-2', 'ft-2', 2, TRUE),
('u-tutor-6', 'ft-3', 3, TRUE),
('u-tutor-10', 'ft-4', 4, TRUE),
('u-tutor-16', 'ft-5', 5, TRUE);

-- 테스트 튜터 경력 데이터 삽입
INSERT INTO tutor_career (user_id, id, company_name, job_category, job_role, start_year, end_year)
VALUES
('u-tutor-1', 'tc-1', '대학학원', '교육', '수학강사', '2016-01-01', NULL),
('u-tutor-2', 'tc-2', '영어학원', '교육', '영어강사', '2021-01-01', NULL),
('u-tutor-3', 'tc-3', '국제학교', '교육', '영어교사', '2019-01-01', NULL),
('u-tutor-4', 'tc-4', '어학센터', '교육', '발음강사', '2018-01-01', NULL),
('u-tutor-6', 'tc-6', '여행사', '관광', '가이드', '2014-01-01', '2019-12-31'),
('u-tutor-10', 'tc-10', 'IT회사', '기술', 'PM', '2012-01-01', NULL),
('u-tutor-16', 'tc-16', '학원', '교육', '수학강사', '2006-01-01', NULL),
('u-tutor-18', 'tc-18', '학원', '교육', '과학강사', '2011-01-01', NULL),
('u-tutor-20', 'tc-20', '의학원', '교육', '입시강사', '2015-01-01', NULL);

-- 테스트 튜터 교육 데이터 삽입
INSERT INTO tutor_education (user_id, id, school_name, degree, start_year, graduated_year)
VALUES
('u-tutor-1', 'te-1', '서울대학교', '이학학사(수학)', '2012-03-01', '2016-02-28'),
('u-tutor-2', 'te-2', 'UC Berkeley', '영문학 학사', '2014-09-01', '2018-05-31'),
('u-tutor-3', 'te-3', '경희대학교', '영문과 학사', '2013-03-01', '2017-02-28'),
('u-tutor-4', 'te-4', 'Georgetown University', '언어학 석사', '2017-09-01', '2019-05-31'),
('u-tutor-6', 'te-6', '고려대학교', '영문과 학사', '2010-03-01', '2014-02-28'),
('u-tutor-7', 'te-7', '北京大学', '중국어 학사', '2014-09-01', '2018-06-30'),
('u-tutor-8', 'te-8', '東京大学', '일본어 석사', '2016-04-01', '2018-03-31'),
('u-tutor-16', 'te-16', '서울대학교', '수학 박사', '2012-03-01', '2018-02-28'),
('u-tutor-20', 'te-20', '서울의대', '의학 학사', '2010-03-01', '2016-02-28');
=======
('u-tutor-2', 'ft-2', 2, TRUE);
>>>>>>> origin/cheshire
