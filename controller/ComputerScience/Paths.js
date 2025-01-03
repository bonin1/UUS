const News = require('../../model/NewsModel');
const NewsCategory = require('../../model/NewsCategory');
const NewsMedia = require('../../model/NewsMedia');
const User = require('../../model/UsersModel');

exports.getComputerScience = async (req, res) => {
    try {
        const category = await NewsCategory.findOne({
            where: { category_name: 'ComputerScience' }
        });

        if (!category) {
            throw new Error('Computer Science category not found');
        }

        const news = await News.findAll({
            where: { category_id: category.category_id },
            order: [['publish_date', 'DESC']]
        });

        const enrichedNews = await Promise.all(news.map(async (newsItem) => {
            const user = await User.findOne({
                where: { id: newsItem.published_by_id }
            });
            
            const media = await NewsMedia.findOne({
                where: { news_id: newsItem.news_id }
            });

            return {
                ...newsItem.toJSON(),
                User: user,
                NewsMedia: media ? [media] : []
            };
        }));

        res.render('computerscience', { news: enrichedNews });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).send('Error fetching news');
    }
};


