const crypto = require("crypto");
const http = require("https");
// const axios = require("axios")
const path = require('path');
const fs = require('fs')
const date = require('date-and-time')
var moment = require("moment");
const nodemailer = require("nodemailer")
const auth_key = "@993sjdsf7fgsjsfs7fgsf(shoppingApp)30sn^ddsjfs88nf473jfs";
const specialNumber = ["9988554433", "9977332211", "9944332211", "9966332211", "9955332211"]

module.exports = {
    sendSms: (message, mobile) => {
        var options = {
            "method": "GET",
            "hostname": "2factor.in",
            "port": null,
            "path": `/API/V1/46882ac9-80b8-11eb-a9bc-0200cd936042/SMS/${mobile}/${message}`,
            "headers": {}
        };

        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks);
                console.log(body.toString());
            });
        });
        req.end();
    },
    randomString: function (len) {
        charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    randomAlphaString: function (len) {
        charSet = 'DEFGHIJKLMNOPQRSTUVWdefghijklmnopqrstuvw';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    },
    changeAlphaString: function (text, n) {
        var text = '' + text + ''
        var array = text.split('');
        var changeString = '';
        for (var i = 0; i < array.length; i++) {
            var assci = array[i].charCodeAt(0);
            var new_number = parseInt(assci) + parseInt(n)
            if (assci >= 97 && assci <= 122) {
                if (new_number > 122) {
                    var extra = parseInt(new_number) - parseInt(122);
                    var final = parseInt(96) + parseInt(extra);
                    var changeString = changeString + String.fromCharCode(final);
                } else {
                    var changeString = changeString + String.fromCharCode(new_number);
                }
            } else {
                if (new_number > 90) {
                    var extra = parseInt(new_number) - parseInt(90);
                    var final = parseInt(64) + parseInt(extra);
                    var changeString = changeString + String.fromCharCode(final);
                } else {
                    var changeString = changeString + String.fromCharCode(new_number);
                }
            }
        }
        return changeString;
    },
    EncrptDecryptApiData: (text, key, type) => {
        /* key = 'rbfgkmkuyickqrzpawcuuveaeiizetdr' */
        if (type.toString() === 'encrypt') {
            /* var cipher = crypto.createCipheriv('aes-256-ebc', key, null);
            var encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64'); // encrypted text
            return encrypted.toString(); */
            const cipher = crypto.createCipheriv("aes-256-ecb", key, null);
            var encrypted = cipher.update(text, 'utf8', 'base64') + cipher.final('base64'); // encrypted text
            return encrypted;
        } else {
            try {
                var decipher = crypto.createDecipheriv("aes-256-ecb", key, null);
                var decrypted = decipher.update(text, 'base64', 'utf8') + decipher.final('utf8');
                var object = JSON.parse(decrypted);
                return object;
            }
            catch {
                return false
            }
            /*  var decipher = crypto.createDecipheriv('aes-256-ebc', key, null);
             var decrypted = decipher.update(text.toString(), 'base64', 'utf8') + decipher.final('utf8'); //decrypted text
             return decrypted.toString(); */
        }
    },
    crypto: function (text, type) {
        var algorithm = 'aes-192-cbc';
        var password = 'DarkWorldEncryption';
        var key = crypto.scryptSync(password, 'salt', 24, { N: 1024 }); //create key
        var iv = crypto.scryptSync(password, 'salt', 16, { N: 1024 }); //create initVector

        if (type.toString() === 'encrypt') {
            var cipher = crypto.createCipheriv(algorithm, key, iv);
            var encrypted = cipher.update(text.toString(), 'utf8', 'hex') + cipher.final('hex'); // encrypted text
            return encrypted.toString();
        } else {
            var decipher = crypto.createDecipheriv(algorithm, key, iv);
            var decrypted = decipher.update(text.toString(), 'hex', 'utf8') + decipher.final('utf8'); //decrypted text
            return decrypted.toString();
        }
    },
    checkRequestAuth: function (app_key) {
        var key = 'qwertyuiopasdfgh';
        var enc_key = 'F636BD475BDE0CB691146365F7FF0B2946BBB8FFEA2C9CB493CF169FB1E490457A2CA40F7C1D34EDF1E4EED6401677917342B667ED368287B278B93FC2167466';
        var decipher = crypto.createDecipheriv("aes-128-ecb", key, null);
        var check_key = decipher.update(app_key, 'hex', 'utf8') + decipher.final('utf8');
        console.log(check_key);

        if (check_key == auth_key) {
            return true
        } else {
            return false
        }
    },
    getOtp: function (length) {
        return 123456;
        if (length == 4) {
            return Math.floor(1000 + Math.random() * 9000);
        } else {
            return Math.floor(100000 + Math.random() * 900000);
        }
    },
    getCheckApiDataBefore: function (reqkey, reqdata) {
        var mykey = reqkey.match(/.{1,8}/g)
        var myKey1 = this.changeAlphaString(mykey[1], 3)
        var myKey2 = this.changeAlphaString(mykey[3], 3)
        var original_key = mykey[0] + myKey1 + mykey[2] + myKey2
        var decData = this.EncrptDecryptApiData(reqdata, original_key, 'decrypt');
        return decData;
    },
    getCheckApiDataAfter: function (finalResult) {
        let response = JSON.stringify(finalResult);
        var key = this.randomAlphaString(32)
        var resData = this.EncrptDecryptApiData(response, key, 'encrypt')
        var mykey = key.match(/.{1,8}/g)
        var myKey1 = this.changeAlphaString(mykey[1], 3)
        var myKey2 = this.changeAlphaString(mykey[3], 3)
        var original = mykey[0] + myKey1 + mykey[2] + myKey2

        return { resData, original }
    },
    nodeEmail: function (mail, subject, message) {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            const mailOptions = {
                from: "Admin Forget Pass Link <no-reply@admin.com>",
                to: mail,
                subject: subject,
                text: message,
                html: message,
            }
            transporter.sendMail(mailOptions, function (err, success) {
                if (err) {
                    console.log(`inerror`, err.message);
                    resolve(err);
                } else {
                    console.log(`sucess`, true);
                    resolve(true);
                }
            })
        })
    },

    convertMillisecondsToDigitalClock: function (ms) {
        hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
        minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
        seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds

        return {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            clock: (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds),
            clockString: (hours < 10 ? '0' + hours : hours) + " Hours, " + (minutes < 10 ? '0' + minutes : minutes) + " Minutes and " + (seconds < 10 ? '0' + seconds : seconds) + " Seconds."
        };
    },
    getMonthName: function (monthNumber) {
        const date = new Date();
        date.setMonth(monthNumber - 1);

        return date.toLocaleString('en-US', {
            month: 'short',
        });
    },
    diffrenceDaysBetweenTwoDates: function (starDate, endDate) {
        var date1 = new Date(starDate);
        var date2 = new Date(endDate);
        var Difference_In_Time = date2.getTime() - date1.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return Difference_In_Days;
    },
    UTCtoIST: function (timeUTC) {
        timeUTC = timeUTC.getTime()
        let timeIST = new Date(timeUTC);
        timeIST.setHours(timeIST.getHours() + 6)
        return timeIST.setMinutes(timeIST.getMinutes() + 30)
    },
    numberFormat: function (number, decimals = 2, decimalSeparator = '.', thousandsSeparator = '') {
        number = parseFloat(number);

        if (isNaN(number)) {
            return 'NaN';
        }
        const fixedNumber = number.toFixed(decimals);
        const parts = fixedNumber.split('.');
        const integerPart = parts[0];
        const decimalPart = parts.length > 1 ? decimalSeparator + parts[1] : '';

        return integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator) + decimalPart;
    },
    findDuplicateStrings: function (arr) {
        const duplicates = {};

        for (let i = 0; i < arr.length; i++) {
            const currentItem = arr[i];
            if (!duplicates[currentItem]) {
                duplicates[currentItem] = [i + 1]; // Initialize with the current position
            } else {
                i = i + 1
                duplicates[currentItem].push(i); // Add the current position to the list
            }
        }

        const result = [];
        for (const key in duplicates) {
            if (duplicates[key].length > 1) {
                result.push(...duplicates[key]);
            }
        }

        return result;
    },
    getRandomChar: function (charset) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        return charset.charAt(randomIndex);
    },
    generatePassword: async function (length) {
        const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
        const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const digitChars = "0123456789";
        const specialChars = "@";
        const allChars = lowercaseChars + uppercaseChars + digitChars + specialChars;

        if (length < 8) {
            throw new Error("Password length must be at least 8 characters");
        }

        let password = "";
        password += this.getRandomChar(lowercaseChars);
        password += this.getRandomChar(uppercaseChars);
        password += this.getRandomChar(digitChars);
        password += this.getRandomChar(specialChars);

        for (let i = 4; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            password += allChars.charAt(randomIndex);
        }
        return password;
    },
    replaceTag: function (sting) {
        let newStr = sting.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        return newStr;
    },
    handleFileUploads: async function (fileEntries, fileConfigs) {
        const uploadedFiles = {}; // Store filenames using inputName

        // Phase 1: Validate all files and continue to the next one if any issues are found
        for (const [index, [key, file]] of fileEntries.entries()) {
            const config = fileConfigs[index]; // Get the configuration for the current file

            if (!config) {
                console.warn(`No configuration found for file ${key}, skipping...`);
                continue; // Skip this entry and move to the next one
            }

            // Check if file is present, otherwise skip it
            if (!file || !file.filepath || !file.originalFilename) {
                console.warn(`File not provided or missing data for ${key}, skipping...`);
                continue; // Skip this entry and move to the next one
            }

            const validationError = isValidFile(file, config, index);
            if (validationError) {
                console.warn(`Validation error for file ${key}: ${validationError}, skipping...`);
                continue; // Skip this entry and move to the next one
            }
        }

        // Phase 2: If no errors, save all valid files
        for (const [index, [key, file]] of fileEntries.entries()) {
            const config = fileConfigs[index];

            // Check if file is valid before processing
            if (!file || !file.filepath || !file.originalFilename || !config) {
                continue; // Skip invalid or missing files
            }

            const fileName = generateFileName(file.originalFilename); // Generate the new file name
            const newPath = createFilePath(config.fileNewPath, fileName); // Create the file path

            try {
                await saveFile(file.filepath, newPath); // Save the file
                uploadedFiles[config.inputName] = fileName; // Store using inputName
            } catch (err) {
                console.error(`Error during file upload for ${fileName}: ${err.message}`);
                return {
                    error: true,
                    message: `Error during file upload for ${config.inputName}`,
                    data: { id: key }
                };
            }
        }

        // If all files are processed successfully, return the uploaded files
        return {
            error: false,
            message: 'All files uploaded successfully',
            data: uploadedFiles
        };

        // File validation function
        function isValidFile(file, config, index) {
            const { fileType, validSizeInKb, inputName } = config;
            const fileTypes = {
                1: ['jpg', 'jpeg', 'png', 'webp'],
                2: ['pdf'],
                3: ['xlsx', 'xlsm', 'xlsb', 'xltx'],
                4: ['doc', 'docx', 'txt'],
                5: ['*']
            };

            const ext = file.originalFilename.split('.').pop().toLowerCase();
            const sizeInKb = Math.ceil(file.size / 1024);

            if (!fileTypes[fileType] || (fileTypes[fileType] !== '*' && !fileTypes[fileType].includes(ext))) {
                return `Invalid file type for ${inputName}. Allowed types: ${fileTypes[fileType].join(', ')}`;
            }

            if (sizeInKb > validSizeInKb) {
                return `File size exceeds ${formatFileSize(validSizeInKb)} limit for ${inputName}.`;
            }

            return null;  // No error
        }

        // Helper function to generate a file name
        function generateFileName(originalFilename) {
            let lastDotIndex = originalFilename.lastIndexOf('.');
            if (lastDotIndex === -1) {
                return Date.now() + '_' + originalFilename;
            }

            let namePart = originalFilename.substring(0, lastDotIndex); // Filename without extension
            let extensionPart = originalFilename.substring(lastDotIndex + 1).toLowerCase(); // Extension in lowercase

            let fileName = namePart.replace(/\s+/g, ''); // Remove spaces from the file name

            if (fileName.length > 100) {
                fileName = fileName.slice(0, 100);
            }

            return Date.now() + '_' + fileName + '.' + extensionPart;
        }

        // Helper function to create the file path
        function createFilePath(fileNewPath, fileName) {
            return path.join('public', fileNewPath, fileName);
        }

        // Helper function to save the file
        async function saveFile(filePath, newPath) {
            if (!fs.existsSync(path.dirname(newPath))) {
                fs.mkdirSync(path.dirname(newPath), { recursive: true });
            }
            const rawData = await fs.promises.readFile(filePath);
            await fs.promises.writeFile(newPath, rawData);
        }

        // Helper function to format file size
        function formatFileSize(sizeInKB) {
            return sizeInKB < 1024 ? `${sizeInKB} KB` : `${(sizeInKB / 1024).toFixed(0)} MB`;
        }
    }
}

