$lwrArgs = New-Object string[] $args.Length;
$keepRootDir = $false;
$dirName = "";

for ($i = 0; $i -lt $args.Length; $i++) {
  $arg = $args[$i].ToLower();
  $stWtColon = $arg.StartsWith(":");
  $stWtDblColonr = $stWtColon -and $arg.StartsWith("::");
  $isFlag = $stWtColon -and (-not $stWtDblColonr);

  if (-not $isFlag) {
    if ($stWtDblColonr) {
      $arg = $arg.Substring(1);
    }

    $dirName = $arg.Trim("""");
  }

  $arg = $lwrArgs[$i] = $arg.ToLower();

  if ($isFlag) {
    if ($arg -eq ":kr") {
      $keepRootDir = $true;
    }
  }
}

$searchDirName = $dirName + "\";
$dirContents = $dirName + "\*";

# Write-Output ("removing " + $dirName + " " + $searchDirName + " " + $dirName + " " + $dirContents)
# ("removing " + $dirName + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"

if (Test-Path -Path "$searchDirName" -PathType Container) {
  if ($keepRootDir) {
    Remove-Item "$dirContents" -Recurse -Force
  } else {
    Remove-Item "$dirName" -Recurse -Force
  }
  
  Remove-Item "$dirContents"
  # ("removed " + $dirName + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"
} else {
  # ("not removed " + $dirName + " " + $searchDirName + " " + $dirName + " " + $dirContents) | Out-File -FilePath "out.txt"
}
