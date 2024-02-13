const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/contacts', require('./contacts'));
//router.use('/', require('./contacts'));


module.exports = router;