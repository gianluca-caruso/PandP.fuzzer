# PandP | fuzzer

<div style="display:flex; flex-direction:row; gap:20px;justify-content: flex-start;">
<img src="./public/readme-logo.png" width="20%" />
<img src="./public/robot-zap.svg" width="25%"/>
</div>

### PandP: fuzzer along with OWASP ZAP to be more powerful.
___

PandP: fuzzer uses the OWASP ZAP REST API to allow us to create fuzzers with the ability to save, modify, and repeat them whenever we want. With its appealing and facilitating UI, operations will become much easier to do.

## Working
Once we have configured the settings to connect to the API endpoint, we can create our fuzzer and send it to ZAP.
To do so we can use zest script loading so that, once we have a match on the reflected of the request, the script will be generated and sent automatically and we would only have to worry about starting it in OWASP ZAP.
___
>The application is working but still in work in progress....

 <img src="./public/utils/work-in-progress.png" width="30%"/>

_____

# Getting Started

## Next.js

install package.json
```console
$ npm install 
```
>In `package.json` it is possible to change **port** and **host** application .
> change .env variables, especially **secret** ,**NEXTAUTH_URL**,**NEXTAUTH_SECRET** for production.
> if You use providers such as Google, Apple, etc... You can setup **strategy** in api/auth/[...nextauth.ts] on ``database`` rather than ``jwt``

run in dev mode
```console
$ npm run dev
```
to build
```console
$ npm run build
```
run after build
```console
$ npm start
```
____
## Prisma
migrate db
```console
$ npx prisma migrate dev --name {name}
```
run prisma studio
```console
$ npx prisma studio
```

>to create fuzzers in https, remember to disable **TLS ALPN extension** that you'll find at this section in OWASP ZAP:

![tls-alpn](/public/utils/tls-alpn.png)


# # FAQ

## Why use this tool?
Because OWASP ZAP has limited use of the fuzzer. This tool could cover this gap until ZAP extends the operation of the fuzzer itself, so that it'll become as complete as Burp's ("intruder").

## Why Zest ?
Using zest scripts you have the ability within OWASP ZAP itself to edit and add : conditions, assertion and much more in an easy way. By using it you have more flexibility.

____
## Have fun

