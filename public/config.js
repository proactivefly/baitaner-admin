const domain="";//您的域名//独立部署需要填写Go服务api接口域名(部署在Go目录下可以留空)
const localhost="http://localhost:8108";//访问本地的域名和端口，如果您改变Go服务端口，请自行修改
window.globalConfig = {
	Root_url:`${domain}/admin`,//Api服务器域名
	Root_url_dev:`${localhost}/admin`,//Api服务器域名-开发环境
    Upload_url:`${domain}/common`,//Api服务器域名
	Upload_url_dev:`${localhost}/common`,//Api服务器域名-开发环境
	AppTitle:"Golang Admin",
    AppVersion:"1.1.0",
    Company:"golang集团",
    Address:"中国·北京",
    Team:"中国Golang技术团队",
    loginTitle:"登录Golang管理后台",
    loginSubTitle:"admin为后台总管理",
    Copyright:"golang官方团队提供技术支持",
};