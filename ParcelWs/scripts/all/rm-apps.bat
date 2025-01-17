@echo off

for %%a in ("..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-svelteapp",
"..\..\apps\trmrk-notes-vueapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-localfs-notes-solidjsapp",
"..\..\apps\trmrk-localfs-notes-solidjs-tauriapp",
"..\..\apps\trmrk-localfs-quicknotes-solidjs-tauriapp") do (
  cd %%a
  .\_\rm.bat
)

@echo on