lines = open(r'c:\MSA15\security\portfolio\src\main\resources\templates\index.html', encoding='utf-8').readlines()
header = lines[:130]
secA = lines[130:190]
secB = lines[191:254]
secC = lines[255:368]
secD = lines[369:505]
secE = lines[506:559]
secF = lines[560:593]
secG = lines[594:644]
secH = lines[645:693]
footer = lines[693:]
new = header + ['\n'] + secB + ['\n'] + secC + ['\n'] + secD + ['\n'] + secH + ['\n'] + secA + ['\n'] + secE + ['\n'] + secF + ['\n'] + secG + ['\n'] + footer
with open(r'c:\MSA15\security\portfolio\src\main\resources\templates\index.html', 'w', encoding='utf-8') as f:
    f.writelines(new)
print(f'Done. Old:{len(lines)} New:{len(new)}')
