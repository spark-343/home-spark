# home-spark

*Everybody is welcome on this project.*

A smart cube that displays your notifications in the most suitable ways everywhere in your home.

For now, the cube works only if you are online.

In the final version, **home-spark** will be composed of:

* 1 arduino for the hardware interface
* 1 raspberry pi 3 for the online interface and the computing power

> Maybe only arduino will be necessary if all the computing is transfered online.

> For development raspberry pi can be replaced by a computer.



## Setup the Apis

* create the file .env
* add your api keys in the file .env

See more on the file .env_example

## Development

```javascript

$ npm install -g vagrant

$ npm install

// to generate js from ts, css from less for angular
$ npm run webpack

$ vagrant up

$ vagrant ssh

vagrant$ cd spark

// to start the webserver
vagrant$ npm start

// to clean the temporary files
npm run clean

```

To install a dependency:

```javascript

npm install <module> --save

typings install <module> --save --global --source <source> // try without argument source, typings will make you proposition
```

## Theme

We use [semanticUi](http://semantic-ui.com/) and [Android icons](http://zavoloklom.github.io/material-design-iconic-font/icons.html).
