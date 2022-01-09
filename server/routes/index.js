const Router = require('express').Router
const Controllers = require('../controllers')

const router = new Router()

// auth middleware
router.post('/*', Controllers.Main.authenticate)
router.put('/*', Controllers.Main.authenticate)
router.delete('/*', Controllers.Main.authenticate)

// admin routes
router.post('/admin/get-sign-root', Controllers.Admin.getSignRoot)
router.post('/admin/get-whitelist-root', Controllers.Admin.getWhitelistRoot)
router.post('/admin/set-starttime', Controllers.Admin.setStarttime)
router.post('/admin/get-proof', Controllers.Admin.getProof)

// main routes
router.post('/mint-whitelist', Controllers.Main.mintWhitelist)
router.get('/get-starttime', Controllers.Main.getStarttime)
router.get('/get-time', Controllers.Main.getTime)

module.exports = router;
