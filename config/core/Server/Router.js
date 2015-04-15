module.exports = {
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