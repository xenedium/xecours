# XeCours
A plateform made for sharing static files and documents.
Made using Next.js, React, JWT, MySQL, Prisma.

Currently hosted at https://xeso.site


## Installation :

```sh
$ npm install
```

## Database setup :
Create a .env file and add the following line :
```sh
DATABASE_URL="mysql://username:password@localhost:3306/mydb"
```

The open your terminal and run this :
```sh
$ npx prisma migrate dev --name init
```

## This app is still under developement. More documentation will be available as soon as the app is finished, Switch the branch to see the old version made with React/Express