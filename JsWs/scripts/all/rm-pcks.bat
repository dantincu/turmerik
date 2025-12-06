@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-angular",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-filemanager-nglib",
"..\..\libs\trmrk-mailbox-nglib",
"..\..\libs\trmrk-mkscripts-jsws-sync-behavior",
"..\..\libs\trmrk-mkscripts-jsws-sync-behavior-testapp",
"..\..\libs\trmrk-notes-nglib",
"..\..\libs\trmrk-testing-nglib",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior",
"..\..\apps\trmrk-filemanager-ngapp",
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-mailbox-ngapp",
"..\..\apps\trmrk-notes-ngapp") do (
  cd %%a
  .\_\rm-pcks.bat
)

@echo on