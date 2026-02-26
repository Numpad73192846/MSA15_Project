CREATE DATABASE board;


INSERT INTO boards (id, title, writer, content)
SELECT 
  UUID(),
  CONCAT('게시판 샘플 데이터 ', t.num),
  CONCAT('작성자 ', t.num),
  CONCAT('내용 샘플 데이터 ', t.num)
FROM (
  SELECT @row := @row + 1 AS num
  FROM information_schema.tables, (SELECT @row := 0) r
  LIMIT 100
) t;

select * from boards;