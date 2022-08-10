import axios from "axios";

export const $discordAxios = axios.create({
	baseURL:"https://discord.com/api/v10",
	withCredentials:true
});

$discordAxios.interceptors.request.use((reqConf) =>{
	reqConf.headers.authorization = process.env.DISCORD_BOT_TOKEN;
	return reqConf;
},  (reqConf) => reqConf)


export const $discordAxiosUnAuth = axios.create({
	baseURL:"https://discord.com/api/v10",
	withCredentials:true
});