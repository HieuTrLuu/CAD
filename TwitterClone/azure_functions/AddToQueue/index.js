module.exports = function(context) {
    context.bindings.myQueueItem = [{mess:'mess1'},{mess:'mess2'}];
    context.done();
    context.res={
        body:`writen to queue: ${context.bindings.myQueueItem}`
    }
};