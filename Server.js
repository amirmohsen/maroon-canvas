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
				"path",
				"change-case",
				"socket.io",
				"http",
				"https",
				"multer",
				"child_process",
				"compression"
			]
		});
		global.$ = Jquery(Jsdom.jsdom().parentWindow);
		// global.Schema = Mongoose.Schema;
		// global.Model = function(name, schema){
		// 	return Mongoose.model(name, schema);
		// };
		importer({
			dirs: [
				__ROOT + "/app"
			],
		});
	}

	function databaseConnected(){
		// console.log("Connected to database...");

		httpServer.listen(8080);

		// Compress all responses above 1KB (default value)
		app.use(Compression());

		// Static content caches for 1 minute
		staticApp.use(ServeStatic('public', {maxAge: 60000}));

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

		// app.use(function(req, res, next){
		// 	if(req.query.build==="") // Security risk -- fix it later with a proper key
		// 	{
		// 		var templateEngine = ChildProcess.spawn("node", ["Tree"]);

		// 		templateEngine.stdout.on('data', function(data){
		// 			console.log(data.toString());
		// 		});

		// 		templateEngine.stderr.on('data', function (data){
		// 		  	console.log(data.toString());
		// 		});

		// 		templateEngine.on('close', function(code){
		// 			console.log("Tree template engine exited with code " + code);
		// 		});
		// 	}
		// 	next();
		// });

		app.use(Vhost('marooncanvas.local', staticApp));

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
	console.log(error);
}