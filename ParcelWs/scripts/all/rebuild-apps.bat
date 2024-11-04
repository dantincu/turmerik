@echo off

for %%a in ("..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-notes-svelteapp",
"..\..\apps\trmrk-notes-vueapp",
"..\..\apps\trmrk-react-testapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
  npm run build
)
@echo on