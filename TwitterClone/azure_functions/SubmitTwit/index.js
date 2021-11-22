module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    context.res = {
        body: `DB Write OK ` + JSON.stringify(req.body)
    }
    let body = Object.assign({},req.body);
    let userId = body.id;
    delete body.id;
    body.userId = userId

    context.bindings.outputDocument = JSON.stringify(body);
    context.done();
};