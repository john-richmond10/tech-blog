const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/config');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
        where: {
            //use session id to find user id
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'title',
            'post_body',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_test', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        const posts = dbPost.map(post => post.get({ plain: true}))
        res.render('dashboard', {posts, loggedIn: true });
    })
    .catch (err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id,
        },
        attributes: [
            'id',
            'title',
            'post_body',
            'created_at',
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'No post found!'});
            return;
        }

        const post = dbPost.get({ plain:true });

        res.render('edit-post', {
            post,
            loggedIn: true
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;