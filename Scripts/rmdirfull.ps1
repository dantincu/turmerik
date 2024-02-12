if (Test-Path -Path ($args[0] + '\') -PathType Container) {
  Remove-Item ($args[0] + '\*') -Recurse -Force
  Remove-Item $args[0]
}
