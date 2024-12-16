const PartnersModel = require('../../../model/Partners');


exports.PartnerPath = async(req,res)=>{
    const userId = req.params.id;
    try {
        const partner = await PartnersModel.findOne({
            where: { id: userId },
            attributes: ['id','name','countries','open_scolars','level','semester','dep_id','partners_photos']
        });
        if (!partner) {
            return res.status(404).send('Partner not found');
        }
        res.render('editpartners',{data : partner,  successAlert: req.flash('success'), dangerAlert: req.flash('danger')})
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};