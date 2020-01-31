#  Foot Swell 
> A football app for scoring kids games. 

Set up:
* Team name
* Your players
* Who is the captain
* Home or away?
* The opponent team name. 

Then kick off! 

* Record who scored and when, 
* Pause the clock 
* Move players around when paused
* cross out mistakes
* Final whistle, download the CVS of the match (without the mistakes)

## Installing / Getting started

This is hosted on github pages [here](http://bangbangsoftware.github.io/footswell/).
A quick introduction of the minimal setup you need to get a hello world up &
running.

## Security

Everything is stored locally, so as long as your local storage is safe, so is your data.

A pure js application that makes great use of local storage using [binder] (https://github.com/bangbangsoftware/binder). 

```shell
# install dependencies
npm install

# serve with hot reload at [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
npm start

# build for production with minification 
npm run build - yet to do 

# run test
npm run unit - could be better
```

### Built with
Binder which is just pure JS and tiny.

### Prerequisites
Nothing, no back end, no babel... just go.

### Setting up dev

Here's a brief intro about what a developer must do in order to start developing
the project further:

```shell
git clone https://github.com/bangbangsoftware/footswell.git
cd footswell/
npm i
npm start 
```

### Building, Deploying / Publishing

To build the project...

```shell
npm run build
```
 This will build the site to dist, which can be commited and served by github
 pages

## To Do

* [x] Team layout design
* [x] Team layout, with toggle buttons
* [x] README - this
* [x] linting
* [x] jest
* [x] Team setup page
* [x] Vrs Field
* [x] Home and away toggle buttons
* [x] Start Button
* [x] Playing layout design
* [x] import / export
* [x] put on github pages
* [x] Formation button

## Versioning

Undecided.

## Configuration

There is zero configuration as of yet apart from setting up the inital team

## Style guide

Undecided.

## Api Reference

See JSON in local storage

## Licensing

GNU General Public License v3.0


