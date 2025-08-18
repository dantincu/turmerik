Command to serve the app on https and on network:

```
ng serve --project=trmrk-angular-testapp --host=0.0.0.0 --ssl=true --ssl-key=./sslcert/key.pem --ssl-cert=./sslcert/cert.pem
```

Command to build the app:

```
ng build --project=trmrk-angular-testapp --base-href=/app/ --configuration production
```

Command to run the production build:

```
http-server ./dist/trmrk-angular-testapp/browser -S -C ./sslcert/cert.pem -K ./sslcert/key.pem -p 443
```
