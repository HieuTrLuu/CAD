module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(`context.bindings.inputDocument !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ${context.bindings.inputDocument}`)
    context.res = {
        body: context.bindings.inputDocument
    }
}