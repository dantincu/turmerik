@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-react",
"..\..\libs\trmrk-lithtml",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior-testapp",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-http-proxy-nodejsapp") do (
  cd %%a
  .\_\rm-pcks.bat
)

@echo on