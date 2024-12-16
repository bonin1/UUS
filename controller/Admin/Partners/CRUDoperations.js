const PartnersModel = require('../../../model/Partners');



exports.DeletePartner = async (req, res) => {
    const userId = req.params.id;
    try {
        const partner = await PartnersModel.findOne({
            where: { id: userId }
        });

        if (!partner) {
            return res.status(404).send('Partner not found');
        }

        await partner.destroy();
        req.session.alert = { type: 'danger', message: 'Partner got deleted successfuly' };
        res.redirect(`/admin/protected`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

exports.CreatePartner = async (req, res) => {
    const {
        name,
        countries,
        open_scolars,
        level,
        semester,
        dep_id
    } = req.body;

    try {
        const existingPartner = await PartnersModel.findOne({
            where: { name: name }
        });

        if (existingPartner) {
            req.session.alert = { type: 'danger', message: 'Partner already exists' };
            return res.redirect('/admin/protected');
        }

        let partnerData = {
            name,
            countries,
            open_scolars,
            level,
            semester,
            dep_id
        };  
// error on image upload 
        if (req.file) {
            const file = req.file;
            const newImage = {
                name: file.originalname,
                data: file.buffer
            };
            partnerData.partners_photos = newImage.data;
            req.flash('success', 'Image uploaded successfully!');
        }

        const newPartner = await PartnersModel.create(partnerData);
        req.session.alert = { type: 'success', message: 'Partner created successfully' };
        res.redirect('/admin/protected');
    } catch (error) {
        console.error('Error creating partner:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            sql: error.sql,
            parameters: error.parameters
        });
        req.flash('danger', 'Insert is not successful, try again later!');
        res.redirect('/admin/protected');
    }
};


exports.EditPartner = async (req, res) => {
    const userId = req.params.id;
    const { 
        name, 
        countries , 
        open_scolars , 
        level , 
        semester , 
        dep_id } = req.body;
    try {
        const partner = await PartnersModel.findByPk(userId);
        if (!partner) {
            return res.status(404).send('User not found');
        }
        partner.name = name;
        partner.countries = countries;
        partner.open_scolars = open_scolars;
        partner.level = level;
        partner.semester = semester;
        partner.dep_id = dep_id;

        await partner.save();
        req.flash('success', 'Partner got edited successfully!');
        res.redirect(`/admin/partners/${userId}`);
        } catch (error) {
        console.error('Error updating user:', error);
        req.flash('danger', 'Error editing Partner!');
    }
};
