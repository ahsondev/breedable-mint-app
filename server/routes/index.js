const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

router.post('/*', Controllers.Main.authenticate)
router.put('/*', Controllers.Main.authenticate)
router.delete('/*', Controllers.Main.authenticate)

router.post('/upgrade-nft', Controllers.Main.upgradeNft)
router.post('/mint', Controllers.Main.mint)
router.get('/get-starttime', Controllers.Main.getStarttime)
router.get('/get-pause', Controllers.Main.getPause)
router.post('/set-starttime', Controllers.Main.setStarttime)
router.post('/set-pause', Controllers.Main.setPause)

module.exports = router;
