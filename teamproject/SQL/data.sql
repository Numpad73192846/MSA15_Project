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
('sg-jpn', '일본어', 3),
('sg-chn', '중국어', 4),
('sg-fra', '프랑스어', 5),
('sg-spa', '스페인어', 6),
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
('sg-kor', 'sub-kor-mid', 'Middle School Korean', 1),
('sg-kor', 'sub-kor-high','High School Korean',   2),
('sg-eng', 'sub-eng-mid', 'Middle School English',1),
('sg-eng', 'sub-eng-high','High School English',  2),
('sg-eng', 'sub-eng-toeic','TOEIC',               3),
('sg-jpn', 'sub-jpn-basic','Basic Japanese',      1),
('sg-chn', 'sub-chn-basic','Basic Chinese',       1);

-- Tutor profile
INSERT INTO tutor_profile (
    user_id, id, profile_img, phone, headline, bio, self_intro, video_url,
    default_zoom_url, bank_name, account_number, account_holder,
    is_verified, rating_avg, review_count
)
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
('u-tutor-1', 'tc-1', 'Alpha Academy', 'Education', 'Instructor', 2019, NULL),
('u-tutor-2', 'tc-2', 'Global Corp',   'Business',  'Trainer',    2018, 2023),
('u-tutor-3', 'tc-3', 'Language Center','Education','Tutor',      2021, NULL);

-- Tutor education
INSERT INTO tutor_education (user_id, id, school_name, degree, start_year, graduated_year)
VALUES
('u-tutor-1', 'te-1', 'Seoul National University', 'BA Korean Education', 2012, 2016),
('u-tutor-2', 'te-2', 'Yonsei University',         'BA English',          2011, 2015),
('u-tutor-3', 'te-3', 'Osaka University',          'BA Japanese',         2014, 2018);

-- Tutor documents
INSERT INTO tutor_document (user_id, id, doc_type, file_size, original_name, store_name, file_path, content_type)
VALUES
('u-tutor-1', 'td-1', 'EDUCATION',        120000, 'education-proof.pdf',      'td-1.pdf', '/uploads/tutors/documents/td-1.pdf', 'application/pdf'),
('u-tutor-1', 'td-2', 'DEGREE',           110000, 'degree-proof.pdf',         'td-2.pdf', '/uploads/tutors/documents/td-2.pdf', 'application/pdf'),
('u-tutor-1', 'td-3', 'CERTIFICATE_TEXT', 0,      'Korean Teacher Cert',      'td-3.txt', '/uploads/tutors/documents/td-3.txt', 'text/plain'),
('u-tutor-2', 'td-4', 'CERTIFICATE',       98000, 'toeic-cert.jpg',           'td-4.jpg', '/uploads/tutors/documents/td-4.jpg', 'image/jpeg');

-- Tutor base time ranges
INSERT INTO tutor_time_range (user_id, id, start_at, end_at, day_of_week)
VALUES
('u-tutor-1', 'tr-1', '18:00:00', '22:00:00', 'MON'),
('u-tutor-1', 'tr-2', '18:00:00', '22:00:00', 'WED'),
('u-tutor-2', 'tr-3', '19:00:00', '23:00:00', 'TUE'),
('u-tutor-3', 'tr-4', '10:00:00', '14:00:00', 'SAT');

-- Tutor availability slots
INSERT INTO tutor_availability (user_id, id, start_at, end_at, status)
VALUES
('u-tutor-1', 'avail-1', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 1 DAY), INTERVAL 1 HOUR), 'BOOKED'),
('u-tutor-1', 'avail-2', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 3 DAY), INTERVAL 1 HOUR), 'OPEN'),
('u-tutor-2', 'avail-3', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 2 DAY), INTERVAL 1 HOUR), 'OPEN'),
('u-tutor-3', 'avail-4', DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(DATE_ADD(NOW(), INTERVAL 4 DAY), INTERVAL 1 HOUR), 'OPEN');

-- Bookings
INSERT INTO booking (
    user_id, tutor_id, lesson_id, availability_id, id, title,
    requested_at, confirmed_at, paid_at, memo, zoom_join_url
)
VALUES
('u-student-1', 'u-tutor-1', 'lesson-1', 'avail-1', 'book-1', 'Korean class booking',
 NOW(), DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'First class', 'https://zoom.us/j/1111111111'),
('u-student-2', 'u-tutor-1', 'lesson-2', 'avail-2', 'book-2', 'English class booking',
 NOW(), DATE_SUB(NOW(), INTERVAL 10 MINUTE), NULL, 'Need speaking practice', 'https://zoom.us/j/1111111111');

-- Payments
INSERT INTO payment (user_id, booking_id, id, amount, provider, status, paid_at)
VALUES
('u-student-1', 'book-1', 'pay-1', 30000, 'CARD', 'PAID', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('u-student-2', 'book-2', 'pay-2', 32000, 'CARD', 'PENDING', NULL);

-- Reviews
INSERT INTO review (booking_id, id, rating, content)
VALUES
('book-1', 'review-1', 5, 'Very clear explanation and helpful feedback.');

-- Tutor notes
INSERT INTO tutor_student_note (id, tutor_id, student_id, progress, notes)
VALUES
('tsn-1', 'u-tutor-1', 'u-student-1', 'Completed grammar chapter 1', 'Homework submission is consistent.');

-- Messages
INSERT INTO tutor_message (id, booking_id, tutor_id, student_id, sender_role, content, created_at)
VALUES
('tm-1', 'book-1', 'u-tutor-1', 'u-student-1', 'TUTOR',  'Please review chapter 1 before next class.', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('tm-2', 'book-1', 'u-tutor-1', 'u-student-1', 'STUDENT','Understood. I will finish it tonight.',       DATE_SUB(NOW(), INTERVAL 20 HOUR));

-- Korean proverb game seed
INSERT INTO korean_proverb (
    question, answer, option1, option2, option3, option4,
    meaning, difficulty, is_active
)
VALUES
('When a tiger dies, it leaves its skin. When a person dies, it leaves ____.', 'name', 'money', 'name', 'house', 'secret',
 'Legacy matters more than temporary gain.', 'EASY', TRUE),
('Even if one says "A", one can understand "B".', 'quick understanding', 'slow growth', 'quick understanding', 'good memory', 'strong body',
 'Used when someone catches the point fast.', 'MEDIUM', TRUE),
('Starting is half of ____.', 'the work', 'the work', 'the result', 'the journey', 'the cost',
 'Beginning a task is often the hardest part.', 'EASY', TRUE);
