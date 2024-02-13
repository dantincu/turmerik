$firstArg = $args[0].Trim("""");
$searchDirName = $firstArg + "\";
$dirName = $firstArg;
$dirContents = $firstArg + "\*";

# Write-Output ("removing " + $firstArg + " " + $searchDirName + " " + $dirName + " " + $dirContents)
# ("removing " + $firstArg + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"

if (Test-Path -Path "$searchDirName" -PathType Container) {
  Remove-Item "$dirName" -Recurse -Force
  # Remove-Item "$dirContents"
  # ("removed " + $firstArg + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"
} else {
  # ("not removed " + $firstArg + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"
}
