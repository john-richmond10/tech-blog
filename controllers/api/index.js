const router = require('express').Router();

const commentRoutes = require('./comment-routes');
const postRoutes = require('./post-routes');
const userRoutes = require('./user-routes');

router.use('/Users', userRoutes);
router.use('/Posts', postRoutes);
router.use('/Comments', commentRoutes);

module.exports = router;