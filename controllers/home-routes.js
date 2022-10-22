const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
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
                    mode: User,
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
        const posts = dbPost.map(post => post.get({ plain: true }));
        res.render('all-posts', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/post/:id', (req, res) => {
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
        if (!dbPost) {
            res.status(404).json({ message: 'No Post Found!'});
            return;
        }

        const post = dbPost.get({ plain:true })

        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;