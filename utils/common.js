/**
 * common.js
 * @description :: exports helper methods for project.
 */

const dbService = require('./dbService');

/**
 * convertObjectToEnum : converts object to enum
 * @param {obj} obj : object to be converted
 * @return {array} : converted array
 */
function convertObjectToEnum (obj) {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
}

/**
 * randomNumber : generate random numbers for given length
 * @param {number} length : length of random number to be generated (default 4)
 * @return {number} : generated random number
 */
function randomNumber (length = 4) {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

/**
 * replaceAll: find and replace all occurrence of a string in a searched string
 * @param {string} string  : string to be replace
 * @param {string} search  : string which you want to replace
 * @param {string} replace : string with which you want to replace a string
 * @return {string} : replaced new string
 */
function replaceAll (string, search, replace) { 
  return string.split(search).join(replace); 
} 

/**
 * uniqueValidation: check unique validation while user registration
 * @param {obj} model : sequelize model instance of table
 * @param {obj} data : data, coming from request
 * @return {boolean} : validation status
 */
async function uniqueValidation (Model,data){
  let filter = { $or:[] };
  if (data && data['username']){
    filter.$or.push(
      { 'username':data['username'] },
      { 'email':data['username'] },
    );
  }
  if (data && data['email']){
    filter.$or.push(
      { 'username':data['email'] },
      { 'email':data['email'] },
    );
  }
  filter.isActive = true;
  filter.isDeleted = false;
  let found = await dbService.findOne(Model,filter);
  if (found){
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
function getDifferenceOfTwoDatesInTime (currentDate,toDate){
  let hours = toDate.diff(currentDate,'hour');
  currentDate =  currentDate.add(hours, 'hour');
  let minutes = toDate.diff(currentDate,'minute');
  currentDate =  currentDate.add(minutes, 'minute');
  let seconds = toDate.diff(currentDate,'second');
  currentDate =  currentDate.add(seconds, 'second');
  if (hours){
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
async function getRoleAccessData (model,userId) {
  let userRoles = await dbService.findAll(model.userRole, { userId: userId });
  let routeRoles = await dbService.findAll(model.routeRole, { roleId: { $in: userRoles && userRoles.length ? userRoles.map(u=>u.roleId) : [] } },
    {
      include:[{
        model: model.projectRoute,
        as:'_routeId'
      },{
        model: model.role,
        as: '_roleId'
      }] 
    });
  let models = Object.keys(model);
  let Roles = routeRoles && routeRoles.length ? routeRoles.map(rr => rr._roleId && rr._roleId.name).filter((value, index, self) => self.indexOf(value) === index) : [];
  let roleAccess = {};
  if (Roles.length){
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
const checkUniqueFieldsInDatabase = async (model, fieldsToCheck, data, operation, filter = {})=> {
  switch (operation) {
  case 'INSERT':
    for (const field of fieldsToCheck) {
      //Add unique field and it's value in filter.
      let query = {
        ...filter,
        [field] : data[field] 
      };
      let found = await dbService.findOne(model, query);
      if (found) {
        return {
          isDuplicate : true,
          field: field,
          value:  data[field]
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
          [field] : dataToCheck[field] 
        };
        let found = await dbService.findOne(model, query);
        if (found) {
          return {
            isDuplicate : true,
            field: field,
            value:  dataToCheck[field]
          };
        }
      }
    }
    break;
  case 'UPDATE':
  case 'BULK_UPDATE':
    let existData = await dbService.findAll(model, filter, { select : ['id'] });

    for (const field of fieldsToCheck) {
      if (Object.keys(data).includes(field)) {
        if (existData && existData.length > 1) {
          return {
            isDuplicate : true,
            field: field,
            value:  data[field]
          };
        } else if (existData && existData.length === 1){
          let found = await dbService.findOne(model,{ [field]: data[field] });
          if (found && (existData[0].id !== found.id)) {
            return {
              isDuplicate : true,
              field: field,
              value:  data[field]
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
        [field] : data[field] 
      };
      let found = await dbService.findOne(model, query);
      if (found) {
        return {
          isDuplicate : true,
          field: field,
          value:  data[field]
        };
      }
    }
    //cross field validation required when login with multiple fields are present, to prevent wrong user logged in. 

    let loginFieldFilter = { $or:[] };
    if (data && data['username']){
      loginFieldFilter[$or].push(
        { 'username':data['username'] },
        { 'email':data['username'] },
      );
      loginFieldFilter.isActive = true;
      loginFieldFilter.isDeleted = false;
      let found = await dbService.findOne(model,loginFieldFilter);
      if (found){
        return {
          isDuplicate : true,
          field: 'username and email',
          value:  data['username']
        };
      }
    }
    if (data && data['email']){
      loginFieldFilter[$or].push(
        { 'username':data['email'] },
        { 'email':data['email'] },
      );
      loginFieldFilter.isActive = true;
      loginFieldFilter.isDeleted = false;
      let found = await dbService.findOne(model,loginFieldFilter);
      if (found){
        return {
          isDuplicate : true,
          field: 'username and email',
          value:  data['email']
        };
      }
    }
    break;
  default:
    return { isDuplicate : false };
    break;
  }
  return { isDuplicate : false };
};

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  uniqueValidation,
  getDifferenceOfTwoDatesInTime,
  getRoleAccessData,
  checkUniqueFieldsInDatabase
};
