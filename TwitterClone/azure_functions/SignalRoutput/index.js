module.exports = async function (context, documents) {
    context.log('JavaScript HTTP trigger function processed a request.');

    /**
     * Where does this bit go ?
     */
    context.bindings.signalRMessages = [{
        "target": "newMessage",
        "arguments": [ documents[0].id ]
    }];
};

// module.exports = async function (context, documents) {
//     if (!!documents && documents.length > 0) {
//         context.log('Document Id: ', documents[0].id);
//     }
// }
