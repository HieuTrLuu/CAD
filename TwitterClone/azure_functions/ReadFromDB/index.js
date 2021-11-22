let brcypt = require('bcryptjs');
let jwt = require ('jsonwebtoken')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    // let req_body = req.data;
    // let email = req_body.email;
    // let plainPass = req_body.pass;
    // let hash = context.bindings.inputDocument .pass;
    // let result = bcrypt.compareSync(plainPass, hash); // true
    

    context.res = {
        body: context.bindings.inputDocument
    }
    // "sqlQuery": "SELECT * from ToDoList t where t.id = {departmentId}",
    // "sqlQuery": "SELECT * from ToDoList t where t.id='1'", if we want id as a variable then we have to use graphQL as this is a known problem in current DB => over fetching
    //TODO: catch error using javascript when parameter is not correct
};

