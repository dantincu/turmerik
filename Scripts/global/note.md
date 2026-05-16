# Global scripts

How to generate a pdf from document scan image files:

```shell
_cvdc -i :docScanImgs -p _\files.txt -o "Declaratie Unica 2026.html"

_cvdc -o "Declaratie Unica 2026.pdf" -i "Declaratie Unica 2026.html"
```