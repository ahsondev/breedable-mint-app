const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/*', Controllers.Main.authenticate)
router.put('/*', Controllers.Main.authenticate)
router.delete('/*', Controllers.Main.authenticate)

router.post('/upgrade-nft', Controllers.Main.upgradeNft)
router.post('/mint', Controllers.Main.mint)
router.post('/get-starttime', Controllers.Main.getStarttime)
router.post('/set-starttime', Controllers.Main.setStarttime)

module.exports = router;
