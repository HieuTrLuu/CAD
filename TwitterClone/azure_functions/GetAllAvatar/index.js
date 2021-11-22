module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    let avatarList = context.bindings.inputDocument.map(e=>{
      return {
          userName: e.userName,
          id: e.id,
          imgURL: e.imgURL
      }
    })
    context.res = {
        state:200,
        body: avatarList
    }
};