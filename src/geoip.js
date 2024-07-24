/*
  MultiSite Latency Tool

  Copyright (C) 2024 Snake Konginchrist

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const axios = require('axios');
const dns = require('dns');
require('dotenv').config();

async function getIP(domain) {
    return new Promise((resolve, reject) => {
        dns.resolve(domain, 'A', (err, addresses) => {
            if (err) {
                reject(err);
            } else {
                resolve(addresses[0]);
            }
        });
    });
}

const IP2LOCATION_API_KEY = process.env.IP2LOCATION_API_KEY; // 请替换为你的IP2Location.io API密钥
console.log(`IP2Location.io API Key: ${IP2LOCATION_API_KEY}`)

// 从URL获取IP地址并进行地理定位
async function getGeoLocation(url) {
    try {
        // 提取纯域名
        const domain = url.replace(/^(?:https?:\/\/)?/i, "").split('/')[0];
        console.log(`Extracted domain: ${domain}`);

        // 请求 DNS 解析
        // const ipResponse = await axios.get(`https://dns.google/resolve?name=${url}`);
        // console.log(`DNS response for ${domain}:`, ipResponse.data);

        // 检查 DNS 响应
        // if (ipResponse.data.Status !== 0 || !ipResponse.data.Answer || ipResponse.data.Answer.length === 0) {
        //     throw new Error('No valid IP address found in DNS response');
        // }
        //
        // const ip = ipResponse.data.Answer[0].data;

        const ip = await getIP(domain);
        console.log(`Resolved IP for ${domain}: ${ip}`);

        const locationResponse = await axios.get(`https://api.ip2location.io/?key=${IP2LOCATION_API_KEY}&ip=${ip}`);
        const location = `${locationResponse.data.city_name}, 
        ${locationResponse.data.region_name}, 
        ${locationResponse.data.country_name}`;

        return {
            ip,
            location
        };
    } catch (error) {
        console.error(`Error retrieving IP or geographic information: ${error}`);
        return {
            ip: 'unknown',
            location: 'unknown'
        };
    }
}

module.exports = getGeoLocation;