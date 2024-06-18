Get-ChildItem -Recurse -Filter *.md | ForEach-Object {
  Write-Output $_.FullName
  pandoc --pdf-engine=xelatex -o ($_.FullName + '.pdf') $_.FullName
}
