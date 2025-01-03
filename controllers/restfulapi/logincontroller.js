const commonFunctions = require('../../helpers/function')

exports.login = async (req, res) => {
    var env_type = req.body.env_type
    var reqdata;
    var reqkey = commonFunctions.randomString(32);
    if (env_type == 'production') {
        reqdata = req.body.reqdata
        reqkey = req.body.reqkey
    }

    if (reqkey?.length == 32) {
        var decData;
        if (env_type == 'production') {
            decData = await commonFunctions.getCheckApiDataBefore(reqkey, reqdata)
        } else {
            decData = req.body;
        }
        if (decData != false) {
            try {
                let { name } = decData;
                if (!name) {
                    return res.badRequest({ message: 'Insufficient request parameters name options is required.' });
                }

            } catch (err) {
                return res.badRequest({ message: err.message });
            }
        } else {
            return res.unAuthorized({ message: "Unauthorized Request." });
        }
    } else {
        return res.unAuthorized({ message: "Unauthorized Request." });
    }
}