# Desert Sand for Visual Studio

This is the verified, working process for applying the Desert Sand theme to Visual Studio. It was
worked out empirically against Visual Studio 2026 (v18), which ships a new Fluent-based theming
engine that replaced most of the old `.vstheme`/pkgdef category system used through VS 2022.

Two independent pieces make up the final result:

1. **Bulk conversion** — Microsoft's [theme-converter-for-vs](https://github.com/microsoft/theme-converter-for-vs)
   tool converts `../themes/desert-sand-light-color-theme.json` (the VS Code theme) directly into a
   Visual Studio `.pkgdef` and installs it. This covers editor syntax colors (comment/string/keyword/
   number/etc. — all except "Plain Text", see below), most tool windows, menus, dialogs, and other
   legacy-era surfaces.
2. **Fluent token override** — VS 2026's shell chrome (title bar, status bar, panel headers, editor
   tabs, empty editor background) reads a newer, separate set of ~229 "Shell"/"Shell internal" tokens
   that the converter (built for the older system) doesn't touch. [desert-sand-light-color-theme.json](desert-sand-light-color-theme.json)
   in this folder is a hand-built override file targeting exactly those tokens, sourced from the
   official [theme color token reference](https://learn.microsoft.com/en-us/visualstudio/extensibility/ux-guidelines/theme-color-token-reference).

## 1. Build and run the converter

```
git clone https://github.com/microsoft/theme-converter-for-vs.git
cd theme-converter-for-vs/ThemeConverter/ThemeConverter
dotnet build ThemeConverter.csproj
```

The built exe targets `net6.0`; if only newer .NET runtimes are installed, set a roll-forward policy.
Find your VS install path first (`vswhere -latest -property installationPath`), then from an **admin**
PowerShell:

```powershell
cd <repo>\ThemeConverter\ThemeConverter\bin\Debug\net6.0
$env:DOTNET_ROLL_FORWARD="LatestMajor"
& ".\ThemeConverter.exe" -i "<path to>\themes\desert-sand-light-color-theme.json" -t "<VS install path>"
```

You must `cd` into that exact folder first — the tool loads `TokenMappings.json`/`OverlayMapping.json`
relative to the current directory, not the exe's location. `-t` patches the pkgdef into the target VS
install and launches it.

Once launched, Tools > Options > Environment > General (or Tools > Themes) > select
"desert-sand-light-color-theme".

## 2. Fix the one thing the converter misses

See [fonts-and-colors.md](fonts-and-colors.md) — the converter never sets the base "Plain Text"
Fonts and Colors item, so the editor canvas keeps its old background/foreground until you set it by
hand (one dialog, two values).

## 3. Apply the Fluent shell override

Find your VS instance folder and drop the override file in:

```powershell
Get-ChildItem "$env:LOCALAPPDATA\Microsoft\VisualStudio" -Directory   # find the 18.0_xxxxxxxx one
$dest = "$env:LOCALAPPDATA\Microsoft\VisualStudio\18.0_xxxxxxxx\ColorThemes"
New-Item -ItemType Directory -Force -Path $dest | Out-Null
Copy-Item "desert-sand-light-color-theme.json" "$dest\desert-sand-light-color-theme.json" -Force
```

The override file name must match the theme's internal name (`desert-sand-light-color-theme`, i.e.
lowercase-hyphenated, no spaces). Fully restart Visual Studio (not just switch the theme dropdown —
some chrome only repaints on relaunch).

Tools > Options > Environment > Visual Experience > Theme colors > "Customize color values for the
current theme" opens this exact file from inside VS, which is the fastest way to confirm the path and
tweak further tokens using the live token reference.

## Files

- [desert-sand-light-color-theme.json](desert-sand-light-color-theme.json) — the Fluent Shell/Shell
  internal token override (step 3). This is the actively-maintained file; edit and redeploy it here
  when adjusting IDE chrome colors.
- [fonts-and-colors.md](fonts-and-colors.md) — the one manual Fonts and Colors fix (step 2).
- [palette.json](palette.json) — canonical Desert Sand hex values by semantic role, shared with the
  VS Code theme.

`theme-converter-for-vs/` (Microsoft's cloned tool) and the generated `.pkgdef` are build tooling/output
— not checked in here as golden artifacts. Re-clone and re-run per step 1 whenever
`themes/desert-sand-light-color-theme.json` changes.
