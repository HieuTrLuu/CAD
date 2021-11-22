var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var _ = require('lodash');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    let AddIfNotExist= (array, elt)=>{
        context.log(array);
        context.log(elt);
        context.log(`wtf !!!!: ${array.filter(e=> e==elt)}`)
        array.filter(e=> e==elt).length==0 ? array.push(elt) : null;
    }
    

    //TODO: test update relations
    /**
     * Convention 
     * user: user who makes the change
     * user2: user who get update by the change made by user
     */

    try{
    let body = req.body;
    let email = body.email;
    let pass = body.pass;
    let isCreateUser = body.isCreateUser;

    let isExistUser;
    let userList = context.bindings.userDB;
    let userList2 = context.bindings.user2DB;

    userList.length >0 ? isExistUser=true : isExistUser=false;

    if(isCreateUser && !isExistUser){
        context.bindings.outputDocument = JSON.stringify({
            email:`${email}`,
            pass: `${pass}`,
            followers: [],
            followings: [],
            post: [],
        })

        context.res = {
            body: `congratulations you have sign up with 3207 SNS`
        }
    }if(!isCreateUser && isExistUser){

        let userEmail = body.email;
        let user2Email = body.userEmail2Follow;
        let status = body.status;

        let user = userList.filter(user => user.email == userEmail)[0];
        let user2 = userList2.filter(user => user.email == user2Email)[0];

        /**
         * Update followings list in user
         * Update followers list in user2
         */
        if(status){
            // let followingSet = new Set(user.followings);
            // user.followings.push(user2.id);
            // user2.followers.push(user.id);
            AddIfNotExist(user.followings, user2.id);
            AddIfNotExist(user2.followers, user.id);
        }else{
            user.followings = _.without(user.followings, user2.id);
            user2.followers = _.without(user2.followers, user.id);
        }         
        
        context.bindings.outputDocument = JSON.stringify(
            // ...context.bindings.userDB,
            // include update data here for user
            user
        )

        context.bindings.myQueueItem = [user2]
        
        context.res = {
            // body: `follow relationship has been update`
            body: `create following relation = ${status}` 
        }
    }

    

    }catch{
        context.res = {
            status: 500,
            body: `Internal server error`
        }    
    };



    context.done();

};

// The function uses a queue input binding for a queue that receives JSON in the followings format: