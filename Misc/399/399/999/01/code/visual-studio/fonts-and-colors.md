# Desert Sand — Visual Studio Fonts and Colors

Visual Studio stores syntax-highlighting colors (Tools > Options > Environment > Fonts and Colors)
as a compressed binary blob when exported to `.vssettings`, so it can't be hand-authored or generated
outside a running Visual Studio instance. Apply these manually — it's a one-time, ~10 minute pass —
then export your own `.vssettings` afterward to reuse or share the result.

Tools > Options > Environment > Fonts and Colors > Text Editor. Set "Item foreground"/"Item background"
for each Display Item below (values from [palette.json](palette.json)):

| Display Item | Foreground | Background | Notes |
|---|---|---|---|
| Plain Text | `#5C3A1E` | `#FAE7BE` | base editor colors |
| Selected Text | (default) | `#F0BE7E` | |
| Indicator Margin | — | `#FAE7BE` | |
| Line Numbers | `#D9B87F` | `#FAE7BE` | |
| Comment | `#A9793F` | (default) | italic, if the font supports it |
| Keyword | `#B5651D` | (default) | |
| String | `#74902A` | (default) | |
| Number | `#C08552` | (default) | |
| Operator | `#8F5A26` | (default) | |
| User Types | `#A56B1C` | (default) | bold |
| User Types(Interfaces) | `#A56B1C` | (default) | bold |
| User Types(Enums) | `#A56B1C` | (default) | bold |
| User Members | `#8F5A26` | (default) | (properties/fields) |
| XML Doc Comment | `#A9793F` | (default) | italic |
| XML Doc Tag | `#B5651D` | (default) | |
| Preprocessor Keyword | `#B5651D` | (default) | |
| Symbol Definition | `#5C3A1E` | (default) | |
| Symbol Reference | `#5C3A1E` | (default) | |
| Parameter | `#8F4518` | (default) | |
| HTML/XML Attribute | `#A0522D` | (default) | |
| HTML/XML Element Name | `#B5651D` | (default) | |
| Error List Errors | `#C0392B` | (default) | |
| Error List Warnings | `#D68910` | (default) | |
| Error List Messages | `#B8752E` | (default) | |
| Compiler Error | `#C0392B` | (default) | squiggle |
| Warning | `#D68910` | (default) | squiggle |
| Breakpoint (Enabled) | `#FFF6E5` | `#C0392B` | |
| Bookmark | (default) | `#F0D394` | |
| Brace Matching | (default) | `#F0BE7E` | |
| Hyperlink | `#A0522D` | (default) | |

## Steps

1. Tools > Options > Environment > Fonts and Colors.
2. Show settings for: **Text Editor**.
3. Pick each Display Item from the table, set Item foreground / Item background using the hex values
   above (Custom... > enter RGB).
4. Once done, File > Export Settings (or Tools > Import and Export Settings > Export) if you want a
   `.vssettings` file to reuse on another machine or share.
