// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    trmrk_localfs_quicknotes_solidjs_tauriapp_lib::run()
}
