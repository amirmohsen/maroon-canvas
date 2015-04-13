module.exports = {
	"cache": 0,
	"proxyPort": 8080,
	"httpPort": 80,
	"httpsPort": 443,
	"appPath": "",
	"appVhosts": ["marooncanvas.local", "www.marooncanvas.local"],
	"ssl": {
		"key": "ssl_cert/marooncanvas.local.key",
		"cert": "ssl_cert/marooncanvas.local.crt"
	},
	"proxy": true,
	"Router": require("./Router")
};