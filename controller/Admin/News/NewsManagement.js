const News = require('../../../model/NewsModel')
const NewsMedia = require('../../../model/NewsMedia')
const NewsTag = require('../../../model/NewsTag')
const ArticleTag = require('../../../model/ArticleTag')
const fs = require('fs');
const { sendNewsNotification } = require('../../../service/emailService');
const User = require('../../../model/UsersModel');

const {getUserFromToken} = require('../../../middleware/GetUserFromToken');


exports.CreateNews = async (req, res) => {
    const performer = await getUserFromToken(req);
    const {
        title,
        content,
        category_id,
        tags,
        notify_users
    } = req.body;

    try {
        const newsData = {
            title,
            content,
            category_id,
            published_by_id: performer.id,
        };

        const news = await News.create(newsData);

        if (tags) {
            const tagList = tags.split(',');
            for (const tag of tagList) {
                let tagData = await NewsTag.findOne({ where: { tag } });
                if (!tagData) {
                    tagData = await NewsTag.create({ tag });
                }
                await ArticleTag.create({ 
                    news_id: news.news_id, 
                    tag_id: tagData.tag_id 
                });
            }
        }

        if (req.files) {
            const mediaData = {
                news_id: news.news_id,
                primary_image: req.files.primary_image ? req.files.primary_image[0].buffer : null,
                additional_media: req.files.additional_media ? req.files.additional_media[0].buffer : null,
                media_type: req.files.additional_media && req.files.additional_media[0].mimetype.startsWith('video/') ? 'video' : 'image'
            };
            await NewsMedia.create(mediaData);
        }

        if (notify_users) {
            try {
                const users = await User.findAll({
                    attributes: ['email'],
                    where: {
                        role: 'student',
                    }
                });

                const emailPromises = users.map(user => 
                    sendNewsNotification(user.email, title, content)
                );
                
                await Promise.all(emailPromises);
            } catch (emailError) {
                console.error('Error sending news notifications:', emailError);
            }
        }

        req.flash('success', 'News created successfully');
        res.redirect('back');
    } catch (error) {
        console.error('Error in CreateNews:', error);
        req.flash('danger', 'Error creating news');
        res.redirect('back');
    }
}
