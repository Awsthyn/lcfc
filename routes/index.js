const { Router } = require('express');
const bodyParser = require('body-parser');
const matchsRouter = require('./matchs.js')

const router = Router();

router.use(bodyParser.json());

router.use('/matchs', matchsRouter);


module.exports = router;
