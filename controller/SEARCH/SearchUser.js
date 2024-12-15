const express = require('express');
const app = express();
const User = require('../../model/UsersModel');
const { Op } = require('sequelize');


exports.UserSearch = async (req, res) => {
    try {
        const query = req.body.query;

        if (query === '') {
            res.send([]);
            return;
        }
        const results = await User.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        res.send(results);
    } catch (err) {
        console.error(err);
        res.send([]);
    }
};
