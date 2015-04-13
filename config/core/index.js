module.exports = {
	"mode": "dev",
	"components": [
		{
			name: "Server",
			config: require("./Server")
		},
		{
			name: "API",
			config: {}
		},
		{
			name: "LessHandler",
			config: require("./LessHandler")
		},
		{
			name: "TemplateEngine",
			config: require("./TemplateEngine")
		}
	]
};