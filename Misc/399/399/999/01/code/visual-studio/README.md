# Desert Sand for Visual Studio

Visual Studio splits theming into two independent systems, unlike VS Code's single JSON file:

1. **Code editor colors** (comments, keywords, strings, ...) — set via Tools > Options > Fonts and
   Colors, and only exportable as a binary-blob `.vssettings` from a running VS instance.
2. **IDE chrome** (title bar, toolbars, tool windows, tabs, status bar) — set via a `.vstheme` XML
   file shipped in a VSIX extension, whose Category/Color elements require internal GUIDs that VS
   itself stamps in when you use its "Custom Theme" project item template.

Neither format can be safely hand-authored from scratch without a running Visual Studio + SDK to
generate the authoritative base file, so this folder gives you the design (fully specified) and the
tooling to apply it, rather than a fragile guessed-GUID file.

## 1. Editor syntax colors (10 minutes, manual)

Follow [fonts-and-colors.md](fonts-and-colors.md) — a direct hex table for every Fonts and Colors
Display Item, matching the VS Code Desert Sand token colors. Do this in Tools > Options once; export
your own `.vssettings` afterward if you want to reuse it elsewhere.

## 2. IDE chrome re-skin (VSIX extension)

1. Install the **Visual Studio extension development** workload (Visual Studio Installer).
2. File > New > Project > search "VSIX Project" > name it `DesertSandTheme`.
3. In the new project: Add > New Item > Extensibility > **Custom Theme** > name it `DesertSand`.
   This generates `DesertSand.vstheme` (usually cloned from the Light theme) with all the real,
   version-correct Category/Color GUIDs plus the matching `.pkgdef` registration — do not touch
   these GUIDs by hand.
4. Run the merge script against that generated file:
   ```
   python merge_vstheme_colors.py DesertSand.vstheme chrome-colors.json DesertSand.merged.vstheme
   ```
   It rewrites only the `Background`/`Foreground` hex values for `<Color Name="...">` entries it
   recognizes from [chrome-colors.json](chrome-colors.json), and prints which mapping entries it
   found vs. didn't — the "didn't find" list tells you which names need correcting for your VS
   version.
5. Replace the generated `DesertSand.vstheme`'s contents with `DesertSand.merged.vstheme`'s.
6. Build the VSIX project (F6). Double-click the resulting `.vsix` in `bin\Debug` to install.
7. Restart Visual Studio > Tools > Options > Environment > General > Color theme > **Desert Sand**.

### If the mapping is off

`chrome-colors.json` is a best-effort starting point built from patterns seen in other published VS
themes, not verified against a live SDK. After step 4, if entries show up as "not found," paste me
the base `.vstheme`'s list of `<Color Name="...">` values (or the file itself) and the mapping in
`chrome-colors.json` can be corrected exactly rather than guessed.

## Files

- [palette.json](palette.json) — the canonical Desert Sand hex values by semantic role, shared with
  the VS Code theme.
- [fonts-and-colors.md](fonts-and-colors.md) — manual Tools > Options table for code editor colors.
- [chrome-colors.json](chrome-colors.json) — candidate `.vstheme` Color Name → hex mapping.
- [merge_vstheme_colors.py](merge_vstheme_colors.py) — applies the mapping onto a VS-generated base
  `.vstheme` without touching GUIDs.
