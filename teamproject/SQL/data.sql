USE matching;

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

-- Shared bcrypt hash for password: Admin102938$&
SET @pw = '$2a$10$eZzE7fa53G86AOcvAN8wbOVoAnOVq5YnvLEAgsFaNDzsgFYCVXRye';

-- Users
INSERT INTO users (id, username, password, name, nickname, status)
VALUES
('u-student-1', 'student1@test.com', @pw, 'Student1', 'student_one','ACTIVE'),
('u-student-2', 'student2@test.com', @pw, 'Student2', 'student_two','ACTIVE'),
('u-tutor-1',   'tutor1@test.com',   @pw, 'Tutor1',   'tutor_one', 'ACTIVE'),
('u-tutor-2',   'tutor2@test.com',   @pw, 'Tutor2',   'tutor_two', 'ACTIVE'),
('u-tutor-3',   'tutor3@test.com',   @pw, 'Tutor3',   'tutor_three','ACTIVE');

-- Roles
INSERT INTO user_auth (user_id, id, auth)
VALUES
('u-student-1', 'ua-student-1', 'ROLE_USER'),
('u-student-2', 'ua-student-2', 'ROLE_USER'),
('u-tutor-1',   'ua-tutor-1', 'ROLE_TUTOR'),
('u-tutor-2',   'ua-tutor-2', 'ROLE_TUTOR'),
('u-tutor-3',   'ua-tutor-3', 'ROLE_TUTOR');

-- Subject groups
INSERT INTO subject_group (id, name, seq)
VALUES
('sg-kor', '한국어', 1),
('sg-eng', '영어', 2),
('sg-chn', '중국어', 3),
('sg-jpn', '일본어', 4),
('sg-spa', '스페인어', 5),
('sg-fre', '불어', 6),
('sg-ger', '독일어', 7),
('sg-rus', '러시아어', 8);

-- Language fields
INSERT INTO language_field (id, name, category, seq)
VALUES
('lf-general-conversation', 'Conversation', 'GENERAL', 1),
('lf-general-grammar',      'Grammar',      'GENERAL', 2),
('lf-general-reading',      'Reading',      'GENERAL', 3),
('lf-general-writing',      'Writing',      'GENERAL', 4),
('lf-general-pronunciation','Pronunciation','GENERAL', 5),
('lf-domain-school',        'School',       'DOMAIN',  1),
('lf-domain-business',      'Business',     'DOMAIN',  2),
('lf-domain-travel',        'Travel',       'DOMAIN',  3),
('lf-domain-culture',       'Culture',      'DOMAIN',  4);

-- Subjects
INSERT INTO subject (group_id, id, name, seq_in_group)
VALUES
('sg-kor', 'sub-kor-1', '중등 한국어', 1),
('sg-kor', 'sub-kor-2', '고등 한국어', 2),
('sg-kor', 'sub-kor-3', '한국어', 3),
('sg-eng', 'sub-eng-1', '중등 영어', 1),
('sg-eng', 'sub-eng-2', '고등 영어', 2),
('sg-eng', 'sub-eng-3', 'TOEIC', 3),
('sg-eng', 'sub-eng-4', '영어', 4),
('sg-chn', 'sub-chn-1', '중등 중국어', 1),
('sg-chn', 'sub-chn-2', '고등 중국어', 2),
('sg-chn', 'sub-chn-3', '중국어', 3),
('sg-jpn', 'sub-jpn-1', '중등 일본어', 1),
('sg-jpn', 'sub-jpn-2', '고등 일본어', 2),
('sg-jpn', 'sub-jpn-3', '일본어', 3);
-- 테스트 튜터 과목 매핑 데이터 삽입 (20명 튜터 + 각 과목)
INSERT INTO tutor_subject (user_id, subject_id, id, seq)
VALUES
('u-tutor-1', 'tp-1', '/img/tutors/default.png', '010-1111-1111', 'Korean/English tutor', 'Exam-focused class', 'Systematic tutoring for beginners to advanced.', NULL,
 'https://zoom.us/j/1111111111', 'KB', '111-111-111111', 'Tutor1', TRUE, 4.80, 12),
('u-tutor-2', 'tp-2', '/img/tutors/default.png', '010-2222-2222', 'Business English tutor', 'Practical business communication', 'Interview and presentation focused classes.', NULL,
 'https://zoom.us/j/2222222222', 'Shinhan', '222-222-222222', 'Tutor2', TRUE, 4.70, 8),
('u-tutor-3', 'tp-3', '/img/tutors/default.png', '010-3333-3333', 'Japanese tutor', 'Basic to JLPT prep', 'Conversation first, grammar second.', NULL,
 'https://zoom.us/j/3333333333', 'Woori', '333-333-333333', 'Tutor3', TRUE, 4.60, 5);

-- Tutor field mapping
INSERT INTO tutor_field (user_id, field_id, id, seq)
VALUES
('u-tutor-1', 'lf-general-grammar',       'tf-1-1', 1),
('u-tutor-1', 'lf-general-conversation',  'tf-1-2', 2),
('u-tutor-2', 'lf-domain-business',       'tf-2-1', 1),
('u-tutor-2', 'lf-general-conversation',  'tf-2-2', 2),
('u-tutor-3', 'lf-general-pronunciation', 'tf-3-1', 1);

-- Lessons
INSERT INTO lesson (user_id, subject_id, field_id, id, title, description, status, price)
VALUES
('u-tutor-1', 'sub-kor-high',  'lf-general-grammar',      'lesson-1', 'High School Korean Core', 'Core grammar and reading', 'OPEN', 30000),
('u-tutor-1', 'sub-eng-mid',   'lf-general-conversation', 'lesson-2', 'Middle School English Talk', 'Conversation with patterns', 'OPEN', 32000),
('u-tutor-2', 'sub-eng-toeic', 'lf-domain-business',      'lesson-3', 'TOEIC + Business Writing', 'Target score and work email', 'OPEN', 45000),
('u-tutor-3', 'sub-jpn-basic', 'lf-general-pronunciation','lesson-4', 'Basic Japanese Speaking', 'Pronunciation and daily phrase', 'OPEN', 28000);

-- Tutor subject mapping
INSERT INTO tutor_subject (user_id, subject_id, id, seq)
VALUES
('u-tutor-1', 'sub-kor-high',  'ts-1-1', 1),
('u-tutor-1', 'sub-eng-mid',   'ts-1-2', 2),
('u-tutor-2', 'sub-eng-toeic', 'ts-2-1', 1),
('u-tutor-3', 'sub-jpn-basic', 'ts-3-1', 1);

-- Featured tutors
INSERT INTO featured_tutor (user_id, id, seq, visible)
VALUES
('u-tutor-1', 'ft-1', 1, TRUE),
('u-tutor-2', 'ft-2', 2, TRUE),
('u-tutor-3', 'ft-3', 3, TRUE);

-- Tutor career
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

-- Tutor education
INSERT INTO tutor_education (user_id, id, school_name, degree, start_year, graduated_year)
VALUES
('u-tutor-1', 'te-1', '서울대학교', '이학학사(수학)', '2012-10-01', '2016-02-28'),
('u-tutor-2', 'te-2', 'UC Berkeley', '영문학 학사', '2014-09-01', '2018-05-31'),
('u-tutor-3', 'te-3', '경희대학교', '영문과 학사', '2013-10-01', '2017-02-28'),
('u-tutor-4', 'te-4', 'Georgetown University', '언어학 석사', '2017-09-01', '2019-05-31'),
('u-tutor-6', 'te-6', '고려대학교', '영문과 학사', '2010-10-01', '2014-02-28'),
('u-tutor-7', 'te-7', '北京大学', '중국어 학사', '2014-09-01', '2018-06-30'),
('u-tutor-8', 'te-8', '東京大学', '일본어 석사', '2016-04-01', '2018-10-31'),
('u-tutor-16', 'te-16', '서울대학교', '수학 박사', '2012-10-01', '2018-02-28'),
('u-tutor-20', 'te-20', '서울의대', '의학 학사', '2010-10-01', '2016-02-28');