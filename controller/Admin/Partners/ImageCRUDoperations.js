const PartnersModel = require('../../../model/PartnersModel');

exports.UpdatePartnerImage = async (req, res) => {
    const userId = req.params.id;

    try {
        if (!req.file) {
            req.flash('danger', 'No file uploaded!');
            return res.redirect(`/admin/partners/${userId}`);
        }

        const newImage = {
            name: req.file.originalname,
            data: req.file.buffer 
        };
        const partner = await PartnersModel.findByPk(userId);
        if (!partner) {
            req.flash('danger', 'Partner not found!');
            return res.redirect(`/admin/partners/${userId}`);
        }

        partner.partners_photos = newImage.data;
        await partner.save();

        req.flash('success', 'Image updated successfully!');
        res.redirect(`/admin/partners/${userId}`);
    } catch (error) {
        console.error('Error updating image:', error);
        req.flash('danger', 'Error updating image!');
        res.redirect(`/admin/partners/${userId}`);
    }
};