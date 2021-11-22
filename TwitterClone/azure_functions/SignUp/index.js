var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let plainPass = context.bindings.req.body.pass;
    let returnUsers = context.bindings.authDB;
    let returnUser;
    if (returnUsers.length > 1) {
        //User with the email already exist, choose another email
        context.res = {
            status: 400,
            body: "User with the email already exist, choose another email"
        };

    }else{
        returnUser = {
            "email": `${context.bindings.req.body.email}`,
            "userName": `${context.bindings.req.body.userName}`,
            "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
            "followers": [],
            "followings": [],
        }
        let hash = bcrypt.hashSync(plainPass, salt);
        returnAuth ={
            "email": `${context.bindings.req.body.email}`,
            "userName": `${context.bindings.req.body.userName}`,
            "pass": `${hash}`
        }
        context.bindings.authDBout = JSON.stringify(returnAuth);
        context.bindings.detailDBout = JSON.stringify(returnUser);

        context.res ={
            status: 200,
            body: `Successfully sign up under email ${context.bindings.req.body.email}`
        }
    }
};