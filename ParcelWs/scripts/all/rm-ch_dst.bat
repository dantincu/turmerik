@echo off

for %%a in ("..\..\libs\trmrk",
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
"..\..\apps\trmrk-http-proxy-nodejsapp",
"..\..\apps\trmrk-notes-lithtmlapp",
"..\..\apps\trmrk-notes-reactapp",
"..\..\apps\trmrk-notes-svelteapp",
"..\..\apps\trmrk-notes-vueapp",
"..\..\apps\trmrk-react-testapp",
"..\..\apps\trmrk-notes-solidjsapp",
"..\..\apps\trmrk-localfs-notes-solidjsapp") do (
  cd %%a
  .\_\rm-ch_dst.bat
)
@echo on