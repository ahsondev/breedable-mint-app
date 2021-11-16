const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/index', Controllers.Main.index)

router.post('/auth/twitter/request_token', Controllers.AuthTwitter.getOAuthToken)
router.post('/auth/twitter/profile', Controllers.AuthTwitter.getProfile)

router.post('/auth/discord/profile', Controllers.AuthDiscord.getProfile)

module.exports = router;
