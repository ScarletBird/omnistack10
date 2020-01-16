const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringArray = require('../utils/parseStringArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        //console.log(request.body);
        const {github_username, techs, latitude, longitude} = request.body;
        
        let dev = await Dev.findOne({ github_username });

        if (!dev){
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
        
            // Valor padrão do nome é o login
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });
        }

        return response.json(dev);
    },

    async update(){},

    async destroy(){}
}