//importing the model
const mongoose = require('mongoose'),
      GroupModel = mongoose.model('group');
      UserModel = mongoose.model('user');
// logger

const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
var x = 0;

/**
 * Group Service
 * 
 * @author manorath_bajaj
 */    

 /** 
  * Saves and returns the new Group Object.
  *  @param group {group object}
  *  @param createdUserID {user ID}
  */
 exports.save =(group,createdUserID) => {
     let newGroup = new GroupModel();
     newGroup.name = group.name;
     newGroup.groupType = group.groupType;
     
     //console.log(group.memberEmail);
    return this.getMemberFromEmails(group.memberEmail).then((users) =>{  
      users.forEach( user => { 
         if(user === null) {
            console.log("user with email " + email + " does not exist in the database");
            throw new CustomBadRequestError("user with email " + email + " does not exist in the database");
         }
         else{
            console.log("user Email" + user.email);
            newGroup.members.push(user.id);
         }
      });
     }).then((ret) => {
         console.log("members right now: " + newGroup.members);
         newGroup.members.push(createdUserID);
         newGroup.createdBy = createdUserID;
         const promise = newGroup.save();
         return promise;
     });
     
 }

 /**  
  * Returns an Array of groups matching the search parameters.
  * @param params {any parameter to search groups by}
  */
 exports.search = (params) => {
    const promise = GroupModel.find(params).exec();
    return promise; 
 }

 /**  
  * Returns an Array of groups matching the search parameters.
  * @param id {id of the group object}
  */
 exports.searchById = (id) => {
    const promise = GroupModel.findById(id).populate('createdBy').populate('members').exec();
    return promise; 
 }

 /**
  *  Update a group with given values.
  *  @param group {group json for updated group}
  */
 exports.update = (group,userID) => {
    x = 0;
    console.log("in update service");
      let arr = new Array();
      return this.getMemberFromEmails(group.memberEmail).then((users) =>{  
      users.forEach( user => { 
         if(user === null) {
            console.log("user with email " + email + " does not exist in the database");
            throw new CustomBadRequestError("user with email " + email + " does not exist in the database");
         }
         else{
            console.log("user Email" + user.email);
            arr.push(user.id);
         }
      });
     }).then((ret) => {
         //console.log("members right now: " + newGroup.members);
         if(!arr.includes(userID)) {
            // instead of adding it manually throw an error stating user cannot remove them self
            
            // console.log("adding user")
            // arr.push(userID);
            x = 1;
         }
         try{
            group['members'] = arr;
         } catch (err) {
            console.log(err);
         }
         
         console.log("updating");
      
         let id = group._id;
         delete group['_id'];
         delete group['memberEmail'];
         delete group['createdBy'];
         console.log(group);
         if(x == 1) {
            return new CustomUnauthorizedError("user cannot remove them self from the group");
         } 
         const promise = GroupModel.findByIdAndUpdate(id,group,{
         new: true
      }).exec();   
         return promise;
   });
 }

 /** 
  * Delete a group by id 
  */
 exports.delete = (groupId) => {
     const promise = GroupModel.remove({_id : groupId}).exec();
     return promise;
 }

 /** 
   * Find all the groups which has given user
   * 
   *@param userId {users id}
   */
 exports.findAll = (userId) => {
      logger.info("find all groups for user ", userId);
      const promise = GroupModel.find({members:{"$in" :[userId]}}).populate('members').populate('createdBy').exec();
      return promise;
 }

 /** get a list of member id's based on an email list */
 exports.getMemberFromEmails = (emails) => {
    var members = new Array();
    var promises = [];
    emails.forEach( email => {
      promises.push(UserModel.findOne({ email: email }).exec());
    });
    return Promise.all(promises).then((users) => {
      returnPromise = new Promise(function (resolve, reject) {
         resolve(users);
     });
     return returnPromise;
   });  
 }


 /** 
  * Validate that a list of user ID's exist.
  * @param users  {list of user id's}
  */
 validateGroupUsers = (users) => {
      users.forEach(element => {
      console.log("for id: ",element);   
      UserModel.findOne({_id : element})
      .then(user =>{
         if(!user) {
            logger.info(element," user not found");
         }
      }).catch(err =>{
         logger.info("error finding user", err);
      });

 });
 return true;
}

/**
 * Custom Error for Bad Request
 * 
 * @param {} message 
 */
function CustomBadRequestError(message) {
   this.name = "CustomBadRequest";
   this.message = (message || "");
}
CustomBadRequestError.prototype = Error.prototype;

/**
 * Custom Error for Unauthorised Request
 * 
 * @param {} message 
 */
function CustomUnauthorizedError(message) {
   this.name = "CustomUnauthorizedError";
   this.message = (message || "");
}
CustomUnauthorizedError.prototype = Error.prototype;

