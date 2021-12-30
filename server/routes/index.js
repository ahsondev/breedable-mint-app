const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/*', Controllers.Main.authenticate)
router.put('/*', Controllers.Main.authenticate)
router.delete('/*', Controllers.Main.authenticate)

router.post('/upgrade-nft', Controllers.Main.upgradeNft)
router.post('/mint', Controllers.Main.mint)
router.get('/get-starttime', Controllers.Main.getStarttime)
router.post('/set-starttime', Controllers.Main.setStarttime)
router.post('/get-whitelist', Controllers.Main.getWhitelist)
// router.get('/token', Controllers.Main.getToken)

module.exports = router;
