# Global Script Notes

## Sample contents of a batch script to temporarily add path to the PATH env variable:

```shell
@echo off
set "PATH=%PATH%;X:\some-path"
```

Then execute the batch script like this:

```shell
call add-path.bat
```