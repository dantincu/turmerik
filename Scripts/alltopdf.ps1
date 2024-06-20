Get-ChildItem -Filter *.md | ForEach-Object {
  Write-Output $_.FullName
  pandoc -o ($_.FullName + '.html') $_.FullName
  wkhtmltopdf ($_.FullName + '.html') ($_.FullName + '.pdf')
}
