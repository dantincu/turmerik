import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log('Extension "Minimize Window" is now active!');

  let disposable = vscode.commands.registerCommand(
    "extension.minimizeWindow",
    () => {
      const { exec } = require("child_process");
      const platform = process.platform;

      if (platform === "win32") {
        exec(
          'powershell -Command "$hwnd = (Get-Process -Id $PID).MainWindowHandle; Add-Type -TypeDefinition \'"using System; using System.Runtime.InteropServices; public class Win32 { [DllImport(\\"user32.dll\\")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow); }"\' ; [Win32]::ShowWindow($hwnd, 6)"',
          (err: any, stdout: any, stderr: any) => {
            if (err) {
              vscode.window.showErrorMessage(`Error: ${err.message}`);
              return;
            } else {
              vscode.window.showInformationMessage(`Success`);
            }
            console.log(stdout);
            console.log(stderr);
          }
        );
      } else if (platform === "darwin") {
        exec(
          'osascript -e "tell application \\"System Events\\" to set visible of first application process whose frontmost is true to false"'
        );
      } else if (platform === "linux") {
        exec("xdotool getactivewindow windowminimize");
      } else {
        vscode.window.showErrorMessage(
          "Minimize window is not supported on this platform."
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
