@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-lithtml",
"..\..\libs\trmrk-react",
"..\..\libs\trmrk-solidjs",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior-testapp",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior",
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\upd-pcks.bat
)

@echo on