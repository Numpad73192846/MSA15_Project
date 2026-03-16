const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'teamproject-app', 'src', 'components', 'pages', 'TutorsContent.jsx');
let s = fs.readFileSync(filePath, 'utf8');
const replacements = [
  [/���� ����/g, '언어 선택'],
  [/���ݴ� ����/g, '가격대 선택'],
  [/>��</g, '>▼<'],
  [/��ü/g, '전체'],
  [/�Ϲ�/g, '일반'],
  [/�оߺ�/g, '분야별'],
  [/(timeIcon\} alt=)'����'/g, "$1'경력'"],
  [/(moneyIcon\} alt=)'����'/g, "$1'가격'"],
  [/���� <span/g, '경력 <span'],
  [/\{tutor\.experience \|\| '���� ����'\}/g, "{tutor.experience || '정보 없음'}"],
  [/������ <span/g, '수업당 <span'],
  [/<\/span>��/g, '</span>원'],
  [/������ ����/g, '프로필 보기'],
];
replacements.forEach(([from, to]) => {
  s = s.replace(from, to);
});
fs.writeFileSync(filePath, s, 'utf8');
console.log('Replacements applied');
