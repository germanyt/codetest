
module.exports = function(){
    console.log( process.env.NODE_ENV );

    var env = process.env.NODE_ENV;

    return ['production', 'staging'].indexOf(env) > -1;
}
