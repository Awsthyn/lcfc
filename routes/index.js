const { Router } = require('express');
const bodyParser = require('body-parser');
const matchsRouter = require('./matchs.js')
const userRouter = require('./user.js')


const router = Router();

router.use(bodyParser.json());

router.use('/user', userRouter);
router.use('/matchs', matchsRouter);


module.exports = router;
