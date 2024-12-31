const News = require('../../../model/NewsModel')
const NewsMedia = require('../../../model/NewsMedia')
const NewsTag = require('../../../model/NewsTag')
const ArticleTag = require('../../../model/ArticleTag')
const fs = require('fs');

exports.ViewAllNews = async (req, res) => {
    try {
        const news = await News.findAll();
        const newsMedia = await NewsMedia.findAll();
        const newsTags = await NewsTag.findAll();
        const articleTags = await ArticleTag.findAll();

        const formattedNewsMedia = newsMedia.map(media => ({
            ...media.toJSON(),
            primary_image: media.primary_image ? `data:image/jpeg;base64,${media.primary_image.toString('base64')}` : null,
            additional_media: media.additional_media ? 
                media.media_type === 'video' ?
                    `data:video/mp4;base64,${media.additional_media.toString('base64')}` :
                    `data:image/jpeg;base64,${media.additional_media.toString('base64')}`
                : null
        }));

        res.render('AdminNews', { 
            news: news,
            newsMedia: formattedNewsMedia,
            newsTags: newsTags,
            articleTags: articleTags,
            successAlert: req.flash('success'), 
            dangerAlert: req.flash('danger') 
        });
    } catch (error) {
        console.error('Error in ViewAllNews:', error);
        req.flash('danger', 'Error loading news data');
        res.redirect('/admin/dashboard');
    }
}

exports.ViewNewsById = async (req, res) => {
    try {
        const newsId = req.params.id;
        const news = await News.findByPk(newsId);
        const newsMedia = await NewsMedia.findAll({
            where: { news_id: newsId }
        });
        const newsTags = await NewsTag.findAll({
            where: { news_id: newsId }
        });
        const articleTags = await ArticleTag.findAll();

        if (!news) {
            req.flash('danger', 'News not found');
            return res.redirect('/admin/dashboard');
        }

        const formattedNewsMedia = newsMedia.map(media => ({
            ...media.toJSON(),
            primary_image: media.primary_image ? `data:image/jpeg;base64,${media.primary_image.toString('base64')}` : null,
            additional_media: media.additional_media ? 
                media.media_type === 'video' ?
                    `data:video/mp4;base64,${media.additional_media.toString('base64')}` :
                    `data:image/jpeg;base64,${media.additional_media.toString('base64')}`
                : null
        }));

        res.render('admin-news-detail', { 
            news: news,
            newsMedia: formattedNewsMedia,
            newsTags: newsTags,
            articleTags: articleTags,
            successAlert: req.flash('success'), 
            dangerAlert: req.flash('danger') 
        });
    } catch (error) {
        console.error('Error in ViewNewsById:', error);
        req.flash('danger', 'Error loading news details');
        res.redirect('/admin/dashboard');
    }
}
