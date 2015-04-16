var Seed = require("Seed"),
	configFile = require("/config"),
	core, api, lessHandler, server, templateEngine;

this.config.seed.components.server.Router = {
	staticRoutes: {
		"/": "/public/pages",
		"/styles": [ "/public/styles", "/app/styles" ],
		"/assets": "/data/assets",
		"/app/assets": "/app/assets"
	},
	errors: {
		"e404": "not-found.html",
		"e500": "server-error.html"
	}
};

core = new Seed({
	appRoot: __dirname
});

server = new Seed.Server(this.config.seed.components.server);

api = new Seed.API();

lessHandler = new Seed.LessHandler({
	src: "app",
	dest: "public"
});

templateEngine = new Seed.TemplateEngine({
	layouts: "/app/views/layouts",
	mixins: "/app/views/mixins",
	data: "/data/pages"
});

core.run();