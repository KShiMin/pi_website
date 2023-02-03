// script to auto pull changes from github using webhook

const { exec } = require('child_process');

pull = function () {

    exec('git pull --ff-only', (err, stdout, stderr) => {
        if (err) {
            console.error(`error: ${err.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}

module.exports.pull = pull;