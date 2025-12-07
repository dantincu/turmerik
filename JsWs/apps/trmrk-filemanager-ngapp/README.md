Command to serve the app on https and on network:

```shell
ng serve --host=0.0.0.0 --port=4201 --ssl=true --ssl-key=./sslcert/key.pem --ssl-cert=./sslcert/cert.pem
```

Command to build the app:

```shell
ng build --project=trmrk-angular-testapp --base-href=/app/ --configuration production
```

Command to run the production build:

```shell
http-server ./dist/trmrk-angular-testapp/browser -S -C ./sslcert/cert.pem -K ./sslcert/key.pem -p 443
```

Commands to update trmrk libs:

```shell
.\src\trmrk-angular\_\push_to_trmrk-angular_ppgp.bat

.\src\trmrk-browser\_\push_to_trmrk-browser_ppgp.bat

.\src\trmrk-browser\_\push_to_trmrk-filemanager-nglib_ppgp.bat

.\src\trmrk\_\push_to_trmrk_ppgp.bat

.\src\_\push_all_ppgp.bat
```
