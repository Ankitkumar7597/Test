/**
 * common.js
 * @description :: exports helper methods for project.
 */
const { Op } = require('sequelize');
const dbService = require('./dbService');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
// const AWS = require("aws-sdk");
const formidable = require('formidable');
const fs = require('fs')
const multer = require("multer");
const axios = require('axios');
const { BUCKET_PATH } = require('../constants/authConstant');
const http = require("https");
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");



/**
 * convertObjectToEnum : converts object to enum 
 * @param {obj} obj : object to be converted
 * @return {array} : converted array
 */
function convertObjectToEnum(obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
}
/**
 * textCapitalize : converts object to enum
 * @param {word} : string
 * @return {type} : check type
 */
function textCapitalize(word, type) {
  const lower = word.toLowerCase();
  if (type == 1) return word.charAt(0).toUpperCase() + lower.slice(1);
  else if (type == 2) return lower
  else return word.charAt(0).toUpperCase() + lower.slice(1)
};



/**
 * titleCase : converts object to enum
 * @param {str} : pass string
 */

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}


/**
 * checkIFSCcode : check checkIFSCcode
 * @param {ifsc} : pass string
 */

async function checkIFSCcode(ifsc) {
  try {
    const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`, {
      method: 'GET',
    })
    // console.log("response",response); 
    return response
    // responseHandler(response)
    // return await response.json(); 
  }
  catch (err) {
    return err
  }
}

/**
 * randomNumber : generate random numbers for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random number
 */
function randomNumber(length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};


/**
 * generatePassword : generate random password for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random number
 */

function generatePassword(passwordLength) {
  var numberChars = "0123456789";
  var upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var lowerChars = "abcdefghijklmnopqrstuvwxyz";
  var sp_chr = "@!%()";
  var allChars = numberChars + upperChars + lowerChars + sp_chr;
  var randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray[3] = sp_chr;
  randPasswordArray = randPasswordArray.fill(allChars, 4);
  return shuffleArray(randPasswordArray.map(function (x) { return x[Math.floor(Math.random() * x.length)] })).join('');
}
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


/**
 * crypto : generate random password for given length
 * @param {text} : pass string format 
 * @return {type} : type for encrypted and  decrypted
 */
function passwordConvert(text, type) {
  var algorithm = 'aes-256-cbc';
  var password = 'DarkWorldEncryption';
  var key = crypto.scryptSync(password, 'salt', 32, { N: 1024 }); //create key
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
};

function passwordCheck(password) {
  var minMaxLength = /^[\s\S]{8,32}$/,
    upper = /[A-Z]/,
    lower = /[a-z]/,
    number = /[0-9]/,
    special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

  if (minMaxLength.test(password)) {
    /* Password must contain 8 characters*/
    if (!upper.test(password)) return "Password must contain upper case character";
    if (!lower.test(password)) return "Password must contain lower case character";
    if (!number.test(password)) return "Password must contain number";
    if (!special.test(password)) return "Password must contain at least one special character";
    return true
  } else {
    return "Password must contain 8 characters";
  }
  return false;
}


/**
 * sendMail : sendmail for given mail, subject, message
 */
function sendMail(mail, subject, message) {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rahulmehra66293@gmail.com',
        pass: 'Rahul@811886'
      },  
      // service: "gmail",
      // host: "smtp.mailgun.org",
      // secure: true,
      port: 465,
      // auth: {
      //   user: "postmaster@walkinclips.com",
      //   pass: "27dd9d9ccf28e1ea69040f25795ebbe6-15b35dee-1fe3afd8"
      // },
      tls: {
        rejectUnauthorized: false
      }
    })
    const mailOptions = {
      from: 'no-reply@sms.com ',
      to: mail,
      subject: subject,
      text: message,
      html: message,
      attachments: [
        {
          filename: 'marksheet.pdf',
          path: __dirname + '/mailtrap.png',
          cid: 'uniq-mailtrap.png' 
        }
      ]      
    }
    transporter.sendMail(mailOptions, function (err, success) {
      if (err) {
        /* console.log(`inerror`, err); */
        resolve(err);
      } else {
        /* console.log(`sucess`, true); */
        resolve(true);
      }
    })
  })
};

/**
 * randomString : generate random numbers for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random string
 */
function randomString(len) {
  charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

/**
 * replaceAll: find and replace all occurrence of a string in a searched string
 * @param {string} string  : string to be replace
 * @param {string} search  : string which you want to replace
 * @param {string} replace : string with which you want to replace a string
 * @return {string} : replaced new string
 */
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

/**
 * uniqueValidation: check unique validation while user registration
 * @param {obj} model : sequelize model instance of table
 * @param {obj} data : data, coming from request
 * @return {boolean} : validation status
 */
async function uniqueValidation(Model, data) {
  let filter = { $or: [] };
  if (data && data['username']) {
    filter.$or.push(
      { 'username': data['username'] },
      { 'email': data['username'] },
    );
  }
  if (data && data['email']) {
    filter.$or.push(
      { 'username': data['email'] },
      { 'email': data['email'] },
    );
  }
  filter.isActive = true;
  filter.isDeleted = false;
  let found = await dbService.findOne(Model, filter);
  if (found) {
    return false;
  }
  return true;
}

/**
 * getDifferenceOfTwoDatesInTime : get difference between two dates in time
 * @param {date} currentDate  : current date
 * @param {date} toDate  : future date
 * @return {string} : difference of two date in time
 */
function getDifferenceOfTwoDatesInTime(currentDate, toDate) {
  let hours = toDate.diff(currentDate, 'hour');
  currentDate = currentDate.add(hours, 'hour');
  let minutes = toDate.diff(currentDate, 'minute');
  currentDate = currentDate.add(minutes, 'minute');
  let seconds = toDate.diff(currentDate, 'second');
  currentDate = currentDate.add(seconds, 'second');
  if (hours) {
    return `${hours} hour, ${minutes} minute and ${seconds} second`;
  }
  return `${minutes} minute and ${seconds} second`;
}

/** 
 * getRoleAccessData : returns role access of User
 * @param {obj} model : sequelize model instance of tables
 * @param {int} userId : id of user to find role data
 * @return {obj} : user's role access for APIs of model
 */
async function getRoleAccessData(model, userId) {
  let userRoles = await dbService.findAll(model.userRole, { userId: userId });
  let routeRoles = await dbService.findAll(model.routeRole, { roleId: { $in: userRoles && userRoles.length ? userRoles.map(u => u.roleId) : [] } },
    {
      include: [{
        model: model.projectRoute,
        as: '_routeId'
      }, {
        model: model.role,
        as: '_roleId'
      }]
    });
  let models = Object.keys(model);
  let Roles = routeRoles && routeRoles.length ? routeRoles.map(rr => rr._roleId && rr._roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
  let roleAccess = {};
  if (Roles.length) {
    Roles.map(role => {
      roleAccess[role] = {};
      models.forEach(model => {
        if (routeRoles && routeRoles.length) {
          routeRoles.map(rr => {
            if (rr._routeId && rr._routeId.uri.includes(`/${model.toLowerCase()}/`) && rr._roleId && rr._roleId.name === role) {
              if (!roleAccess[role][model]) {
                roleAccess[role][model] = [];
              }
              if (rr._routeId.uri.includes('create') && !roleAccess[role][model].includes('C')) {
                roleAccess[role][model].push('C');
              }
              else if (rr._routeId.uri.includes('list') && !roleAccess[role][model].includes('R')) {
                roleAccess[role][model].push('R');
              }
              else if (rr._routeId.uri.includes('update') && !roleAccess[role][model].includes('U')) {
                roleAccess[role][model].push('U');
              }
              else if (rr._routeId.uri.includes('delete') && !roleAccess[role][model].includes('D')) {
                roleAccess[role][model].push('D');
              }
            }
          });
        }
      });
    });
  }
  return roleAccess;
};

/**
 * checkUniqueFieldsInDatabase: check unique fields in database for insert or update operation.
 * @param {Object} model : mongoose model instance of collection
 * @param {Array} fieldsToCheck : array of fields to check in database.
 * @param {Object} data : data to insert or update.
 * @param {String} operation : operation identification.
 * @param {Object} filter : filter for query.
 * @return {Object} : information about duplicate fields.
 */
const checkUniqueFieldsInDatabase = async (model, fieldsToCheck, data, operation, filter = {}) => {
  switch (operation) {
    case 'INSERT':
      for (const field of fieldsToCheck) {
        //Add unique field and it's value in filter.
        let query = {
          ...filter,
          [field]: data[field]
        };
        let found = await dbService.findOne(model, query);
        if (found) {
          return {
            isDuplicate: true,
            field: field,
            value: data[field]
          };
        }
      }
      break;
    case 'BULK_INSERT':
      for (const dataToCheck of data) {
        for (const field of fieldsToCheck) {
          //Add unique field and it's value in filter.
          let query = {
            ...filter,
            [field]: dataToCheck[field]
          };
          let found = await dbService.findOne(model, query);
          if (found) {
            return {
              isDuplicate: true,
              field: field,
              value: dataToCheck[field]
            };
          }
        }
      }
      break;
    case 'UPDATE':
    case 'BULK_UPDATE':
      let existData = await dbService.findAll(model, filter, { select: ['id'] });

      for (const field of fieldsToCheck) {
        if (Object.keys(data).includes(field)) {
          if (existData && existData.length > 1) {
            return {
              isDuplicate: true,
              field: field,
              value: data[field]
            };
          } else if (existData && existData.length === 1) {
            let found = await dbService.findOne(model, { [field]: data[field] });
            if (found && (existData[0].id !== found.id)) {
              return {
                isDuplicate: true,
                field: field,
                value: data[field]
              };
            }
          }
        }
      }
      break;
    case 'REGISTER':
      for (const field of fieldsToCheck) {
        //Add unique field and it's value in filter.
        let query = {
          ...filter,
          [field]: data[field]
        };
        let found = await dbService.findOne(model, query);
        if (found) {
          return {
            isDuplicate: true,
            field: field,
            value: data[field]
          };
        }
      }
      //cross field validation required when login with multiple fields are present, to prevent wrong user logged in. 

      let loginFieldFilter = { [Op.or]: [] };
      if (data && data['username']) {
        loginFieldFilter[Op.or].push(
          { 'username': data['username'] },
          { 'email': data['username'] },
        );
        loginFieldFilter.isActive = true;
        loginFieldFilter.isDeleted = false;
        let found = await dbService.findOne(model, loginFieldFilter);
        if (found) {
          return {
            isDuplicate: true,
            field: 'username and email',
            value: data['username']
          };
        }
      }
      if (data && data['email']) {
        loginFieldFilter[Op.or].push(
          { 'username': data['email'] },
          { 'email': data['email'] },
        );
        loginFieldFilter.isActive = true;
        loginFieldFilter.isDeleted = false;
        let found = await dbService.findOne(model, loginFieldFilter);
        if (found) {
          return {
            isDuplicate: true,
            field: 'username and email',
            value: data['email']
          };
        }
      }
      break;
    default:
      return { isDuplicate: false };
      break;
  }
  return { isDuplicate: false };
};


/**
 * isValidInstagramUrl: check valid instagram URL.
 * @param {urlString} String : Pass String
 */

const isValidInstagramUrl = urlString => {
  return (/(?:(?:http|https):\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([A-Za-z0-9-_\.]+)/im).test(urlString);
}
/**
 * isValidFacebookUrl: check valid facebook URL.
 * @param {urlString} String : Pass String
 */

const isValidFacebookUrl = urlString => {
  /* return (/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/im).test(urlString);
  return (/(https?:\/\/)?([\w\.]*)facebook\.com\/([a-zA-Z0-9_]*)$/).test(urlString); */
  return (/(?:(?:http|https):\/\/)?(?:www\.)?(?:facebook\.com)\/([A-Za-z0-9-_\.]+)/im).test(urlString);
}
/**
 * isValidLinkedinUrl: check valid instagram URL.
 * @param {urlString} String : Pass String
 */

const isValidLinkedinUrl = urlString => {
  return (/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile|company)\/([A-Za-z0-9-_\.]+)/im).test(urlString);
}
/**
 * isValidYoutubeUrl: check valid youtube URL.
 * @param {urlString} String : Pass String
 */
const isValidYoutubeUrl = urlString => {
  return (/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/).test(urlString);
}
/* 
const EMAIL_REGEX = urlString = {
  return (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;).test(urlString)
} */


const isValidEmail = urlString => {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(urlString)
}

const uploadFileOns3Bucket = async (req, res) => {
  try {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.internalServerError({ message: err.message });
      }
      if (files == undefined) {
        return res.badRequest({ message: 'No File Data Available' });
      }
      console.log("files",files);
      let fileExt = files.image.originalFilename.split('.')
      let extensionDoc = fileExt[fileExt.length-1].toLowerCase()
      let myFile = `${Date.now().toString()}.${fileExt[1]}`

      uploadToS3(fs.readFileSync(files.image.filepath), myFile,extensionDoc).then((result) => {
        return res.success({
          data: {
            location: result.Location, Key: result.Key
          },
          message: 'File Uploaded Successfully.'
        })
      })
    })
  } catch (error) {
    throw new Error(error.message);
  }
}

/* const uploadToS3 = (fileData, myFile) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
  })
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: 'schools3bucket',
      Key: `${myFile}`,
      Body: fileData
    }
    s3.upload(params, (error, data) => {
      if (error) {
        console.log(error);
        reject(error)
      }
      return resolve(data)
    })
  })

  return { Key: '' }
}


const deleteS3File = async (req, res) => {
  var params = {
    Bucket: "schools3bucket",
    Key: req.body.Key
  };
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
  })
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      // res.success({ message: `File Delete Successfully` })
      return true
    }
  });
  return res.success({ message: `File Delete Successfully` })
}

const deleteLogo = async (data) => {
  var params = {
    Bucket: "schools3bucket",
    Key: data.Key
  };
  const s3 = new AWS.S3({
    accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
  })
  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      return true
    }
  });
}

const getS3File = async (req, res) => {
  var params = {
    Bucket: "schools3bucket",
    Key: req.body.key
  };
  s3.getSignedUrl('getObject', params, function (err, url) {
    if (err) { console.log(err, err.stack); }
    else {
      let imageUrl = url.split('?')
      return res.json({ data: imageUrl[0] })
    }
  });
}
 */



const uploadToS3 = (fileData, myFile,extensionDoc) => {
  let fileExt = myFile.split('.')
  if(!extensionDoc){
      extensionDoc = fileExt[fileExt.length-1].toLowerCase()
  }
  return new Promise((resolve, reject) => {
    const s3 = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
      },
    });
    const imageExt = ["png","jpeg","jpg"]
    const params = {
      Bucket: "schools3bucket",
      Key: myFile,
      Body: fileData,
    };
    console.log("imageExt.includes(extensionDoc)",imageExt.includes(extensionDoc));
    if(imageExt.includes(extensionDoc)){
      params.ContentType =  "image/jpeg"
    }else{
      params.ContentType =  "application/pdf"
    }
    const command = new PutObjectCommand(params);

    s3.send(command)
      .then((response) => {
        resolve({
          Location: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
          Key: params.Key,
        });
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
};


const deleteS3File = async (req, res) => {  
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "schools3bucket",
      Key: req.body.Key,
    };
    const s3 = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
      },
    });

    const command = new DeleteObjectCommand(params);
    s3.send(command, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err); // Reject the promise with the error
        return res.failure({ message: err.message })
      } else {
        resolve(true); // Resolve the promise with a value indicating success
        return res.success({ message: `File Delete Successfully` })
      }
    });
  });
};


const deleteLogo = (data) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "schools3bucket",
      Key: data.Key,
    };

    const s3 = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
      },
    });

    const command = new DeleteObjectCommand(params);
    s3.send(command, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err); // Reject the promise with the error
      } else {
        resolve(true); // Resolve the promise with a value indicating success
      }
    });
  });
};


const getS3File = async (req, res) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: "schools3bucket",
      Key: req.body.key,
    };

    const s3 = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.S3Bucket_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3Bucket_SECRET_ACCESS_KEY_ID,
      },
    });

    const command = new GetObjectCommand(params);
    s3.send(command, function (err, data) {
      if (err) {
        console.log(err, err.stack);
        reject(err); // Reject the promise with the error
      } else {
        const imageUrl = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;
        resolve({imageUrl}); // Resolve the promise with a value indicating success
      }
    });
  });
};

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only excel file.", false);
  }
};

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/public/uploads/excel/");
  },
  filename: (req, file, cb) => {

    cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
  },
});

const alphaNumericSort = (arr = [], sortName) => {
  return arr.sort((a, b) => a[sortName].toString().localeCompare(b[sortName].toString(), "en", { numeric: true })
  )
}


async function randomColor() {
  var colors = '';
  let maxVal = 0xFFFFFF;
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  colors = `#${randColor.toUpperCase()}`
  return colors
}
async function uniqueUsername(modelName, value, key, init) {
  var randomString;
  if (init == undefined) {
    randomString = value.replace(/ /g, '')
  } else {
    value = value.replace(/ /g, '').substring(0, value.length - 2);
    randomString = value + init
  }
  var checkRandNum = await modelName.findOne({ where: { [key]: randomString } });
  if (checkRandNum) {
    var k = this.randomString(2)
    return this.uniqueUsername(modelName, value, key, k)
  } else {
    return randomString
  }
}

async function sendNotification(data) {
  try {
    playerId = data.player_ids.split(',');
    console.log("playerId",playerId);
    let logo = `${process.env.BASE_URL}/public/user-school-2.png`;
    var logo_path = logo
    var sendData = {
      app_id: process.env.ONESIGNAL_APP_ID,
      headings: { "en": data.title },
      large_icon: logo_path.toString(),
      small_icon: logo_path.toString(),
      data: data.data,
      content_available: true,
      contents: { "en": data.message },
      include_player_ids: playerId
    };

    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": `Basic ${process.env.ONESIGNAL_API_KEY}`
    };


    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
      res.on('data', function (sendData) {
        try {
          console.log("Response:");
          console.log(JSON.parse(sendData));
        } catch (error) {
          console.log(error);
        }
      });
    });

    req.on('error', function (e) {
      console.log("ERROR:");
      console.log(e);
    });

    req.write(JSON.stringify(sendData));
    req.end();
  } catch (error) {
    console.log(error);
  }
}

function noSpecialChars(str) {
  const noSpecialChars = str.replace(/[^a-zA-Z0-9 ]/g, '');  
  return noSpecialChars
}


function aadharFormat (str) {
  var value = str
  value = value.toString().replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(s => s.length > 0).join(" ");
  return value
}

function activeInactive(modelName, id, type) {
  return new Promise(async (resolve, reject) => {
    let where = { id: id };
    var updateData = {};
    var msg = '';

    const check = await dbService.findOne(modelName, where)
    if (!check) {
      reject('Invalid Id Data Not Found');
      return;
    }
    if (type == 1) {
      updateData = {
        isActive: 1
      };
      msg = 'Activate successfully';
    } else if (type == 0) {
      updateData = {
        isActive: 0
      };
      msg = 'Inactivate successfully';
    } else {
      reject('Invalid type');
      return;
    }

    try {
      await dbService.update(modelName, where, updateData);
      resolve(msg);
      return;
    } catch (error) {
      reject(error);
    }
  });
}

var uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = {
  convertObjectToEnum,
  uniqueUsername,
  // randomColorCheck,
  randomColor,
  randomNumber,
  replaceAll,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
  checkUniqueFieldsInDatabase,
  sendMail,
  randomString, 
  passwordCheck,
  generatePassword,
  passwordConvert,
  textCapitalize,
  titleCase,
  isValidInstagramUrl,
  isValidFacebookUrl,
  isValidLinkedinUrl,
  isValidYoutubeUrl,
  uploadFileOns3Bucket,
  deleteS3File,
  getS3File,
  uploadFile,
  uploadToS3,
  deleteLogo,
  isValidEmail,
  checkIFSCcode,
  alphaNumericSort,
  sendNotification,  
  noSpecialChars,
  aadharFormat,
  activeInactive
};
