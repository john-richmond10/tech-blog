const path = require('path');
const express = require('express');
const session = require('express-session');
const exphb = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const sequelize = require('./config/config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

require('dotenv').config();

const sess = {
    secret: process.env.SESS,
    cookie: {
        expires: 10 * 60 * 1000
    },
    resave: true,
    rolling: true,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize,
    }),
};

app.use(session(sess));

const helpers = require('./utils/helpers');
const hbs = exphb.create({ helpers });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(require('./controllers'));

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on ${PORT}!`));
})