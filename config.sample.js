/**
 * Add following fields to Server component based on the environment
 * The below are only examples. Each environment could be different.
 * 
 * Dev:
 	cache: 0,
 	proxyPort: 8080,
 	httpPort: 80,
 	httpsPort: 443,
 	appPath: "",
 	appVhosts: ["marooncanvas.local", "www.marooncanvas.local"],
 	ssl: {
 		"key": "ssl_cert/marooncanvas.local.key",
 		"cert": "ssl_cert/marooncanvas.local.crt"
 	},
 	proxy: true,
 	env: "development",
 *
 * Live
 	cache: 60000,
 	proxyPort: 8080,
 	httpPort: 80,
 	httpsPort: 443,
 	appPath: "",
 	appVhosts: ["marooncanvas.com", "www.marooncanvas.com"],
 	ssl: {},
 	proxy: true,
 	env: "production",
 * 
 */

module.exports = {
	seed: {
		components: {
			Server: {
				Router: {
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
				}
			},
			LessHandler: {
				src: "app",
				dest: "public"
			},
			TemplateEngine: {
				layouts: "/app/views/layouts",
				mixins: "/app/views/mixins",
				data: "/data/pages"
			}
		}
	},
	app: {}
};