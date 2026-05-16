# Global scripts

How to generate a pdf from document scan image files:

```shell
mkdir _

dir /b /a-d > _\files.txt

_cvdc -i :docScanImgs -p _\files.txt -o "Declaratie Unica 2026.html"

_cvdc -o "Declaratie Unica 2026.pdf" -i "Declaratie Unica 2026.html"
```