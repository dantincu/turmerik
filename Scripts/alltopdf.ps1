Get-ChildItem -Filter *.md | ForEach-Object {
  $mdFilePath = [regex]::Escape($_.FullName)
  $htmlFilePath = $mdFilePath + '.html'
  $pdfFilePath = $mdFilePath + '.pdf'

  Write-Output $mdFilePath

  pandoc $mdFilePath -o $htmlFilePath
  wkhtmltopdf $htmlFilePath $pdfFilePath --enable-local-file-access
}
