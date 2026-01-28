-- 테스트용 샘플 데이터: 회원 5명
INSERT INTO users (id, username, password, name, nickname, status) VALUES
('user1-id', 'user1-uuid', 'password1', '김철수', '철수닉', 'ACTIVE'),
('user2-id', 'user2-uuid', 'password2', '이영희', '영희닉', 'ACTIVE'),
('user3-id', 'user3-uuid', 'password3', '박민수', '민수닉', 'ACTIVE'),
('user4-id', 'user4-uuid', 'password4', '정수진', '수진닉', 'ACTIVE'),
('user5-id', 'user5-uuid', 'password5', '홍길동', '길동닉', 'ACTIVE');

UPDATE user_auth SET auth = 'ROLE_TUTOR' WHERE no = 3;

UPDATE user_auth SET auth = 'ROLE_ADMIN' WHERE no = 4;

