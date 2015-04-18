try {
	require("seed");

	var config = require("./config"),
		core, api, lessHandler, server, templateEngine;

	var core = new Seed({ appRoot: __dirname });

	server = new Seed.Server(config.seed.components.Server);

	api = new Seed.API();

	lessHandler = new Seed.LessHandler(config.seed.components.LessHandler);

	templateEngine = new Seed.TemplateEngine(config.seed.components.TemplateEngine);

	core.run();
}
catch(e) {
	dumpError(e);
}