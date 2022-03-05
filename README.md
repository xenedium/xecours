# XeCours
A plateform made for sharing static files with dynamic routing.
Made using Express, React SSR, JWT, MySQL.
Currently hosted at https://xeso.site

## Installation :


```sh
$ npm install
```

# Database setup :

## Create a MySQL database and run the following script :
```sql
create table logs
(
    id         int auto_increment   primary key,
    ip         varchar(16)          null,
    method     varchar(10)          not null,
    url        varchar(200)         not null,
    user_agent varchar(200)         null,
    referer    varchar(200)         null,
    timestamp  bigint               not null
);

create table users
(
    id         int auto_increment   primary key,
    username   varchar(10)          not null,
    password   varchar(64)          not null,
    email      varchar(100)         not null,
    first_name varchar(20)          not null,
    last_name  varchar(30)          not null,
    is_mod     tinyint default 0    not null,
    constraint users_username_uindex unique (username)
);

create table deleted_files
(
    path     varchar(200)   not null,
    username varchar(20)    not null,
    constraint deleted_files_users_username_fk
        foreign key (username) references users (username)
            on update cascade
);

create table files
(
    path     varchar(100)   not null primary key,
    username varchar(20)    not null,
    constraint files_users_username_fk
        foreign key (username) references users (username)
            on update cascade
);
```
# Config files :

## Create a directory called certs with the following files :
- [domain].[name].cert
- [domain].[name].key
- certs.js

```js
// certs/certs.js
import fs from 'fs';
const certs = {
    key: fs.readFileSync('./certs/[domain].[name].key'),
    cert: fs.readFileSync('./certs/[domain].[name].cert'),
}

export default certs;
```
## Create a config.json file :
All the fields must be given, replace each key with it's value
```json
{
    "username": "mysql username",     
    "password": "mysql password",     
    "host": "mysql host",         
    "database": "mysql db name",     
    "discordhook": "discord webhook",  
    "secret": "jwt secret"        
}
```
## Create an empty directory called public then run using :
```sh
$ npm run production
```

