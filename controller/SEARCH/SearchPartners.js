const express = require('express');
const app = express();
const { PartnersModel } = require('../../model/Partners');
const { Op } = require('sequelize');



exports.SearchPartners = async (req, res) => {
    try {
        const query = req.body.query;

        if (query === '') {
            res.send([]);
            return;
        }
        const results = await PartnersModel.findAll({
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