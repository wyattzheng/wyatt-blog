const DotenvPlugin = require('dotenv-webpack');

module.exports = {
    webpack:{
        plugins:[
            new DotenvPlugin()
        ]
    }
}