const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');

class Comment extends Modle {}

customElements.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
    },
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            },
        },
    },
    {
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            reference: {
                model: 'post',
                key: 'id',
            },
        },
    },
    {
        comment_text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
            },
        },
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment',
    }
);

module.exports = Comment;