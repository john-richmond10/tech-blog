const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.post('/', (req, res) => {
    User.create({
        username: req.body.username,
        email: req.body.email,
        github: req.body.github,
        password: req.body.password
    })
    .then(dbUser => {
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;

            res.json(dbUser);
        })
    })
    .catch(err => {
        console.log(err);
        res.status(400).json(err);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(dbUser => {
        if(!dbUser) {
            res.status(400).json({ message: 'No user assoicated with that emaail!'})
            return;
        }
        const rightPass = dbUser.checkPassword(req.body.password);
        if(!rightPass) {
            res.status(400).json({ message: 'Thats not the right password!'});
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUser.id;
            req.session.username = dbUser.username;
            req.session.loggedIn = true;

            res.json({ user: dbUser, message: 'Sucessfully Logged In!'});
        });
    });
});

router.post('/logout', withAuth, (req, res) => {
    if (req.session.loggedIn) {
        req.session.destory(() => {
            res.status(200).end();
        })
    } else {
        res.status(400).end();
    }
});

module.exports = router;