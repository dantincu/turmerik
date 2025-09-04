$lwrArgs = New-Object string[] $args.Length;
$entryName = "";
$recursive = $false;
$force = $false;

for ($i = 0; $i -lt $args.Length; $i++) {
  $arg = $args[$i];
  $stWtColon = $arg.StartsWith(":");
  $stWtDblColonr = $stWtColon -and $arg.StartsWith("::");
  $isFlag = $stWtColon -and (-not $stWtDblColonr);

  if (-not $isFlag) {
    if ($stWtDblColonr) {
      $arg = $arg.Substring(1);
    }

    $entryName = $arg;
  }

  $arg = $lwrArgs[$i] = $arg.ToLower();

  if ($isFlag) {
    switch ($arg) {
      ":rc" { $recursive = $true }
      ":fr" { $force = $true }
    }
  }
}

$inputEntryName = $args[0];
$entryName = $inputEntryName.TrimEnd("*");

if (Test-Path -Path "$entryName") {
  if ($recursive) {
    if ($force) {
      Remove-Item "$inputEntryName" -Recurs -Force
    }
    else {
      Remove-Item "$inputEntryName" -Recurs
    }
  }
  else {
    if ($force) {
      Remove-Item "$inputEntryName" -Force
    }
    else {
      Remove-Item "$inputEntryName"
    }
  }
}
