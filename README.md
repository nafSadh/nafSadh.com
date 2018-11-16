nafSadh's homepage
==================

## deployment

### Simple deployment

#### dev deploy nuxt on heroku
deployed on heroku at: https://skybeam.herokuapp.com/

set build pack to php.

**trigger build with git push**
```
> git subtree push --prefix src/simple heroku master
```



### NUXT deployment

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



### troubleshooting
for heroku force push:
https://stackoverflow.com/questions/13756055/git-subtree-subtree-up-to-date-but-cant-push

