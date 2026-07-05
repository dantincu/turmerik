# Desert Sand — Visual Studio editor "Plain Text" fix

The ThemeConverter tool (see [README.md](README.md)) sets almost every editor color correctly from
`themes/desert-sand-light-color-theme.json`, **except** the base "Plain Text" item — the category
that owns the code editor's canvas background/foreground. It's a real gap in the tool (confirmed by
inspecting its `CategoryGuid.json`: there is no plain "Text Editor" category entry, only sub-categories
like "Text Editor Language Service Items" for Comment/String/Keyword/etc.). Everything else (comments,
strings, keywords, numbers, tool windows, tabs, status bar) is handled by the automated conversion.

Set this one item by hand after installing the converted theme:

1. Tools > Options > Environment > Fonts and Colors (if redirected to a "not migrated yet" page,
   follow its link to the legacy dialog).
2. Show settings for: **Text Editor**.
3. Display items: **Plain Text**.
4. Item foreground: RGB `92, 58, 30` (`#5C3A1E`).
5. Item background: RGB `250, 231, 190` (`#FAE7BE`).
6. OK.

If colors look stuck on an old scheme after reinstalling/updating the theme, click **Use Defaults**
in the same dialog first, then reapply the Plain Text values above.
