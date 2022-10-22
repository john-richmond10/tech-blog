const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: ['id', 'title', 'pot_body', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                Model: Comment,
                attriubes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username', 'github']
                }
            },
            {
                model: User,
                attributes: ['username', 'github']
            }
        ]
    })
    .then(dbPost => res.json(dbPost))
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attriubes: ['id', 'title', 'post_body', 'created_at'],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username', 'github']
                }
            },
            {
                model: User,
                attributes: ['username', 'github']
            }
        ]
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'No post found!'});
        }
        res.json(dbPost);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    })
});

router.put(':/id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title,
            post_body: req.body.post_body
        },
        {
            where: {
                id: req.params.id
        }
    })
    .then(dbPost => {
        if(!dbPost) {
            res.status(404).json({ message: 'No post found!'});
        }
        res.json(dbPost);
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

module.exports = router;