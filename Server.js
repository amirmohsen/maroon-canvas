function Server(){

	var globalUtilities = {
		
		__ROOT: __dirname,

		isEmptyObject: function(obj) {
		  return !Object.keys(obj).length;
		},

		importer: function(list){
			var FS = require("fs"),
				Path = require("path"),
				ChangeCase = require("change-case");

			if(list.dirs){
				list.dirs.forEach(function loadFileModules(dir){
					var contents = FS.readdirSync(dir);
					contents.forEach(function(content){
						var path = Path.join(dir,content);
						var stats = FS.statSync(path);
						if(stats.isDirectory())
							loadFileModules(path);
						else if(stats.isFile() &&
								Path.extname(path) === ".js"){
							var moduleName = Path.basename(path,".js");
							global[moduleName] = require(path);
						}
					});
				});
			}

			if(list.packages){
				list.packages.forEach(function(pack){
					var moduleName = ChangeCase.pascalCase(pack);
					global[moduleName] = require(pack);
				});
			}
		}
	},
	app, staticApp, db, httpServer;

	init();

	this.start = function(){		
		app = Express();
		httpServer = Http.Server(app);
		// global.io = SocketIo(httpServer);
		staticApp = Express();
		// Mongoose.connect('mongodb://localhost/vision-clay');
		// db = Mongoose.connection;
		// db.on('error', console.error.bind(console, 'connection error:'));
		// db.once('open', databaseConnected);
		databaseConnected();
	};

	function init(){
		globalizeUtils();
		globalizeModules();
		loadConfig();
	}

	function globalizeUtils(){
		for(var util in globalUtilities){
			global[util] = globalUtilities[util];
		}
	}

	function globalizeModules(){
		importer({
			packages: [
				"express",
				"serve-static",
				"vhost",
				"body-parser",
				"mongoose",
				"node-uuid",
				"jquery",
				"jsdom",
				"fs",
				"url",
				"path",
				"change-case",
				"socket.io",
				"http",
				"https",
				"multer",
				"child_process",
				"compression",
				"less-middleware"
			]
		});
		global.$ = Jquery(Jsdom.jsdom().parentWindow);
		// global.Schema = Mongoose.Schema;
		// global.Model = function(name, schema){
		// 	return Mongoose.model(name, schema);
		// };
		// importer({
		// 	dirs: [
		// 		__ROOT + "/app"
		// 	]
		// });
	}

	function loadConfig(){
		global.Config = JSON.parse(
			Fs.readFileSync(__ROOT + "/config.json", { encoding: "utf-8" })
		);
	}

	function databaseConnected(){
		// console.log("Connected to database...");

		httpServer.listen(Config.port);

		// Compress all responses above 1KB (default value)
		app.use(Compression());

		// Less compilation
		app.use(
			LessMiddleware( 
				Path.join(__ROOT, "app"), 
				{
					dest: Path.join(__ROOT, "public")
				}
			)
		);

		var staticOpts = {maxAge: Config.cache};

		staticApp.use("/",ServeStatic('public/pages', staticOpts));
		staticApp.use("/assets/",ServeStatic('public/assets', staticOpts));
		staticApp.use("/app/assets/",ServeStatic('app/assets', staticOpts));
		
		app.use(BodyParser.json());
		app.use(BodyParser.urlencoded({
	  		extended: true
		}));
		app.use(Multer({
			dest: './temp/',
			includeEmptyFields: true,
			onFileUploadStart: function (file) {
			  // console.log(file.fieldname + ' is starting ...');
			},
			onFileUploadData: function (file, data) {
			  // console.log(data.length + ' of ' + file.fieldname + ' arrived');
			},
			onFileUploadComplete: function (file) {
			  // console.log(file.fieldname + ' uploaded to  ' + file.path);
			}
		}));

		app.use(function(req, res, next){
			if(Config.mode==="dev" && req.query.build!==undefined){
				var templateEngine = ChildProcess.spawn("node", 
										["app/engine/PageGen.js", 
										Url.parse(req.url).pathname]);

				templateEngine.stdout.on('data', function(data){
					console.log(data.toString());
				});

				templateEngine.stderr.on('data', function (data){
				  	console.log(data.toString());
				});

				templateEngine.on('close', function(code){
					console.log("Tree template engine exited with code " + code);
					next();
				});
			}
			else
				next();	
		});

		app.use(Vhost(Config.appVhost, staticApp));

		app.use("/_api", function(req, res, next){
			var type = req.url.split("/")[1];

			if(type==="blog"){
				var feedURL = req.url.replace("/blog","");
				Http.get("http://blog.marooncanvas.com" + feedURL, function (http_res) {
				    var data = "";

				    http_res.on("data", function (chunk) {
				        data += chunk;
				    });

				    http_res.on("end", function () {
				        res.status(200).send(data);
				    });
				});
			}
			else
				res.status(404).send("API doesn't exist");
		});

		app.use(function(req, res, next){
		  	res.status(404).send("Sorry can't find that!");
		});

		app.use(function(err, req, res, next){
			console.error(err.stack);
			res.status(500).send('Something broke!');
		});

		console.log("Listening ...");

		// io.on('connection', function (socket) {
		// 	socket.emit('hello', "hello bitch!" );
		// 	socket.on('hi back', function (data) {
		// 		console.log(data);
		// 	});
		// });
	}
}

console.log("Starting up server ...");

try {
	var server = new Server();
	server.start();
}
catch(error){
	dumpError(error);
}

function dumpError(err) {
	if (typeof err === 'object') {
		if (err.message) {
			console.error('\nMessage: ' + err.message)
		}
		if (err.stack) {
			console.error('\nStacktrace:')
			console.error('====================')
			console.error(err.stack);
		}
	} else {
		console.error('dumpError :: argument is not an object');
	}
}