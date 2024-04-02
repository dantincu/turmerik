for %arg in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-react",
"..\..\apps\trmrk-notes-blazorapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-text-tranform-behavior",
"..\..\apps\trmrk-text-tranform-behavior-testapp",
"..\..\apps\trmrk-text-tranform-defaultbehavior",
"..\..\apps\trmrk-text-tranform-mybehavior") do (
  cd %arg
  .\rm-ch_dst.bat
)