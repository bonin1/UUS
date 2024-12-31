const News = require('../../../model/NewsModel')
const NewsMedia = require('../../../model/NewsMedia')
const NewsTag = require('../../../model/NewsTag')
const ArticleTag = require('../../../model/ArticleTag')
const fs = require('fs');


exports.uploadNewsMedia = async (req, res) => {
    try {
        const { primary_image, additional_media, news_id } = req.files;
        
        const getMediaType = (file) => {
            if (!file) return null;
            return file.mimetype.startsWith('video/') ? 'video' : 'image';
        };

        const formatMedia = (file) => {
            if (!file) return null;
            const mediaType = getMediaType(file);
            const base64Data = file.buffer.toString('base64');
            return `data:${file.mimetype};base64,${base64Data}`;
        };

        const mediaData = {
            news_id,
            primary_image: primary_image ? primary_image.buffer : null,
            additional_media: additional_media ? additional_media.buffer : null,
            media_type: getMediaType(additional_media)
        };

        await NewsMedia.create(mediaData);
        
        req.flash('success', 'Media uploaded successfully');
        res.redirect('back');
    } catch (error) {
        console.error('Error in uploadNewsMedia:', error);
        req.flash('danger', 'Error uploading media');
        res.redirect('back');
    }
}