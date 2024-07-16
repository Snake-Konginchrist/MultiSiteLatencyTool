const axios = require('axios');

const IP2LOCATION_API_KEY = '8C6C2D493EC26F1B961CB24B0D3D9CDF'; // 请替换为你的IP2Location.io API密钥

// 从URL获取IP地址并进行地理定位
async function getGeoLocation(url) {
    try {
        const ipResponse = await axios.get(`https://dns.google/resolve?name=${url}`);
        const ip = ipResponse.data.Answer[0].data;

        const locationResponse = await axios.get(`https://api.ip2location.io/?key=${IP2LOCATION_API_KEY}&ip=${ip}`);
        const location = `${locationResponse.data.city_name}, 
        ${locationResponse.data.region_name}, 
        ${locationResponse.data.country_name}`;

        return {
            ip,
            location
        };
    } catch (error) {
        console.error(`获取IP或地理位置信息时出错: ${error}`);
        return {
            ip: '未知',
            location: '未知'
        };
    }
}

module.exports = getGeoLocation;