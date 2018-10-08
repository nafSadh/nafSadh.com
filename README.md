nafSadh's homepage
==================

## deployment

#### dev deploy nuxt on heroku
deployed on heroku at: https://skybeam.herokuapp.com/

**setup env vars on heroku**
```
> heroku config:set HOST=0.0.0.0
> heroku config:set NODE_ENV=production
> heroku config:set NPM_CONFIG_PRODUCTION=false
```

**trigger build with git push**
```
> git subtree push --prefix src/nuxt heroku master
```
