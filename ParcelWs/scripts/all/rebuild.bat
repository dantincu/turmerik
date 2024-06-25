@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-react",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior-testapp",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
  npm run build
)
@echo on