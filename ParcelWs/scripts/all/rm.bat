@echo off

for %%a in ("..\..\libs\trmrk",
"..\..\libs\trmrk-angular\projects\trmrk-angular",
"..\..\libs\trmrk-axios",
"..\..\libs\trmrk-blazor",
"..\..\libs\trmrk-browser",
"..\..\libs\trmrk-lithtml",
"..\..\libs\trmrk-react",
"..\..\libs\trmrk-solidjs",
"..\..\libs\trmrk-svelte",
"..\..\libs\trmrk-vue",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior",
"..\..\libs\trmrk-mkscripts-parcelws-sync-behavior-testapp",
"..\..\libs\trmrk-text-transform-behavior",
"..\..\libs\trmrk-text-transform-behavior-testapp",
"..\..\libs\trmrk-text-transform-defaultbehavior",
"..\..\libs\trmrk-text-transform-mybehavior",
"..\..\libs\trmrk-angular\projects\trmrk-angular-testapp",
"..\..\apps\trmrk-audiobook-ngapp",
"..\..\apps\trmrk-onedrive-notes-ngapp",
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-svelteapp",
"..\..\apps\trmrk-notes-vueapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-quicknotes-solidjsapp",
"..\..\apps\trmrk-localfs-notes-solidjsapp",
"..\..\apps\trmrk-localfs-notes-solidjs-tauriapp",
"..\..\apps\trmrk-localfs-quicknotes-solidjs-tauriapp") do (
  cd %%a
  .\_\rm.bat
)

@echo on