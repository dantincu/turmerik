# My AutoHotKey scripts

If you press [Ctrl + Alt + Shift + Win] keys simultaneously, the Office 365 Copilot launches. In order to prevent that from hapenning, run:

```bash
REG ADD HKCU\Software\Classes\ms-officeapp\Shell\Open\Command /t REG_SZ /d rundll32
```

In order to remove that registry entry, run:

```bash
REG DELETE HKCU\Software\Classes\ms-officeapp\Shell\Open\Command
```
