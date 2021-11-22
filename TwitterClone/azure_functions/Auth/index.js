var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);

module.exports = async function (context, req) {
    let plainPass = context.bindings.req.body.pass;
    context.log('JavaScript HTTP trigger function processed a request.');

    //exist such user
    if (context.bindings.inputDocument.length > 0) {
        
        let fetchHash = context.bindings.inputDocument[0].pass;
        let isAuth = bcrypt.compareSync(plainPass, fetchHash);
        //pass word is correct
        if (isAuth) {
        
            let returnUsers = context.bindings.detailDB.filter(user => user.email == context.bindings.inputDocument[0].email);
            let returnUser;
            if (returnUsers.length > 0) {
                returnUser = returnUsers[0];
            } else {
                returnUser = {
                    "email": `${context.bindings.req.email}`,
                    "userName": `${context.bindings.req.userName}`,
                    "imgURL": "https://comp3207studentweb.blob.core.windows.net/img/default-user-icon-4.jpg",
                    "followers": [],
                    "followings": [],
                }
                // context.bindings.detailDBout = JSON.stringify(returnUser);
            }
            context.res = {
                status: 200,
                body: returnUser
            };
        }//pass word is correct
        else {
            context.res = {
                status: 400,
                body: "in correct details"
            };
        }
    }//does not exist such user
    else {
        context.res = {
            status: 400,
            body: "in correct details"
        };
    }
};