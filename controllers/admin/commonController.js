/// Model For Queries
const dbService = require('../../utils/dbService');

const modal = require('../../model');



exports.updateStatus = async (req, res) => {
    try {
        const { id, newStatus, modalName, type } = req.body;
        let data = {}
        if (type && type == 3) {
            data.isActive = newStatus === 'Active';
            await dbService.update(modal[modalName], { groupName: id }, data);
            res.json({ success: true });
        } else {
            const data = await modal[modalName].findByPk(id);
            if (data) {
                // Update the status
                data.isActive = newStatus === 'Active';
                await data.save();
                // Send a success response
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'data not found' });
            }
        }
    } catch (error) {
        console.error('Error updating status:', error);
        return res.internalServerError({ message: error.message });
    }
}

exports.fetchAllCities = async (req, res, next) => {
    try {
        let id = req.body.stateId
        let where = { isDeleted: 0, 'isActive': true, stateId: id }
        let cityData = await District.findAll({
            where: where,
            attributes: ['id', 'districtName'],
            order: [['districtName', 'ASC']]
        });
        return res.success({ message: 'City List', data: cityData });
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
}

// Location update
