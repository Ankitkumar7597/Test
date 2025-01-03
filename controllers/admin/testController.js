const formidable = require('formidable')
const moment = require('moment')
const { Op } = require('sequelize')
const fs = require('fs')
const path = require('path');

// DB table
const Test = require('../../model/test')
// helperFunction
const helperFunc = require('../../helpers/function')
const upload = require('../../middleware/imageUpload');



exports.subH1 = (req, res) => {
    try {
        const data = { type: 2, fileName: 'test/index' }
        res.render('admin/index', { flag_name: "testListTableFlag", title: "Add Form", bannerTitle: 'Add Form', masterMenu: "mainManagement", activeMenu: 'sub-h-1', data, })
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
}

exports.addForm = async (req, res) => {
    const id = req.params.any
    console.log('id', id)
    try {
        const data = {}
        if (id != 0 && id != undefined) {
            const testData = await Test.findOne({ where: { id: id } })
            data.id = testData.id
            data.name = testData.name
            data.mobile_number = testData.mobile_number
            data.address = testData.address
            data.office_address = testData.office_address
            data.image = testData.image
            data.banner = testData.banner
        } else {
            data.id = ''
            data.name = ''
            data.mobile_number = ''
            data.address = ''
            data.office_address = ''
            data.image = ""
            data.banner = ""
        }

        // console.log('data', data)
        res.render('admin/test/model', { data, })
    } catch (error) {
        return res.internalServerError({ message: error.message });
    }
}

exports.submitAddForm = (req, res) => {
    try {
        console.log("body", req.body)
    } catch (err) {
        return res.internalServerError({ message: error.message });
    }
};

exports.formListGridData = async (req, res) => {
    try {
        const searchStr = req.body['search[value]'] || '';
        let status = req.params.any;

        const columns = {
            0: 'id',
            1: 'name',
            2: 'mobile_number',
            3: 'address',
            4: 'office_address',
            5: 'isActive',
            6: 'createdAt',
            7: 'id',
        };

        let searchConditions = {};

        if (searchStr !== '') {
            searchConditions = {
                mobile_number: { [Op.like]: `%${searchStr}%` }
            };
        }

        if (status !== undefined && status !== 'all') {
            status = status == 1 ? true : false;
            searchConditions.isActive = status;
        }

        const start = Number(req.body.start) || 0;
        const limit = Number(req.body.length) || 10;
        const ordername = columns[req.body['order[0][column]']] || 'createdAt';
        const dir = req.body['order[0][dir]'] || 'desc';

        // Total and filtered count
        const recordsTotal = await Test.count();
        const recordsFiltered = await Test.count({ where: searchConditions });

        // Query for the filtered data
        const results = await Test.findAll({
            where: searchConditions,
            order: [[ordername, dir]],
            limit: limit,
            offset: start,
        });

        // Process the results into the correct format
        const resultData = results.map((result, index) => {
            const displayStatus = result.isActive
                ? `<button class="status_show${result.id}" style="background-color: green; color: #fff; padding: 3px 13px; border-radius: 15px; border: none;font-size:11px;">Active</button>`
                : `<button class="status_show${result.id}" style="background-color: red; color: #fff; padding: 3px 13px; border-radius: 15px; border: none;font-size:11px;">Inactive</button>`;

            const createdValue = moment(result.createdAt).format('ddd, DD MMM YYYY hh:mm A');

            return {
                sr: start + index + 1,
                id: result.id,
                name: result.name || 'N/A',
                mobile_number: result.mobile_number || 'N/A',
                address: result.address || 'N/A',
                office_address: result.office_address || 'N/A',
                displayStatus: displayStatus,
                creationDate: createdValue,
                status: result.isActive,
            };
        });

        // Send the response
        const data = {
            draw: req.body.draw,
            recordsFiltered: recordsFiltered,
            recordsTotal: recordsTotal,
            data: resultData
        };

        res.json(data);

    } catch (error) {
        console.error(error);
        return res.internalServerError({ message: error.message });
    }
};
