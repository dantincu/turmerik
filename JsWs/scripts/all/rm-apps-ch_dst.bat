@echo off

for %%a in ("..\..\apps\trmrk-filemanager-ngapp",
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-mailbox-ngapp",
"..\..\apps\trmrk-notes-ngapp",
"..\..\apps\trmrk-svelte-testapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-svelteapp",
"..\..\apps\trmrk-notes-reactapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
)
@echo on