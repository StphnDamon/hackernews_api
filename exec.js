var exec = require('child_process').exec;
var util = require('util');

var ecosystemEnv;

switch (process.env.ENVIRONMENT) {
    case 'PRODUCTION':
        ecosystemEnv = 'prod';
        break;
    case 'PREPRODUCTION':
        ecosystemEnv = 'preprod';
        break;
    default:
        ecosystemEnv = 'dev';
        if (process.env.APIDEV !== undefined) {
            ecosystemEnv += '-' + process.env.APIDEV;
        }
        break;
}

var child = exec('pm2-docker start ./conf/ecosystem-' + ecosystemEnv + '.json', function (error, stdout, stderr) {
    util.print('stdout: ' + stdout);
    util.print('stderr: ' + stderr);

    if (error) {
        console.error('exec error: ', error);
    }
});
