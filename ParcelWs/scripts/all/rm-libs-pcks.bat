@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-browser-testapp",
"..\..\libs\trmrk-react",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior-testapp",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior") do (
  cd %%a
  .\_\rm-pcks.bat
)

@echo on