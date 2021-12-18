const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.all('/*', Controllers.Main.authenticate)

router.post('/upgrade-nft', Controllers.Main.upgradeNft)
router.post('/mint', Controllers.Main.mint)
router.post('/mint-whitelist', Controllers.Main.mintWhitelist)
router.post('/get-starttime', Controllers.Main.getStarttime)
router.post('/set-starttime', Controllers.Main.setStarttime)
router.get('/whitelist', Controllers.Main.isWhitelist)

router.post('/auth/twitter/request_token', Controllers.AuthTwitter.getOAuthToken)
router.post('/auth/twitter/profile', Controllers.AuthTwitter.getProfile)

router.post('/auth/discord/profile', Controllers.AuthDiscord.getProfile)

module.exports = router;
