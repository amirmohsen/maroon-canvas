var FS = require("fs-extra"),
	Path = require("path");
	jQuery = require("jquery"),
	jsDom = require("jsdom").jsdom,
	serializeDocument = require("jsdom").serializeDocument,
	Beautify = require('js-beautify');

function Tree () {
	
	var self = this,
		publicDir = Path.join(__dirname, "/public"),
		contentsDir = Path.join(__dirname, "/data/contents"),
		templatesDir = Path.join(__dirname, "/templates"),
		document = jsDom( 
			read(templatesDir + "/default-template.html"),
			{
				features: {
					FetchExternalResources: false,
					ProcessExternalResources: false
				}
			}),
		window = document.parentWindow,
		$ = jQuery(window);

	init();
	detectChanges(contentsDir);

	function init(){
		// This must be replaced with a smarter way of cleaning old files
		var oldContents = FS.readdirSync(publicDir);
		oldContents.forEach(function(oldContent){
			FS.removeSync(Path.join(publicDir, oldContent));
		});
	}

	function read(path){
		return FS.readFileSync(path, { encoding: "utf-8" });
	}

	function write(readPath, content){
		var writePath = publicDir + readPath.replace(contentsDir, "");
		FS.mkdirsSync(Path.dirname(writePath));
		FS.writeFileSync(writePath, content, { encoding: "utf-8" });
	}

	function detectChanges(dir){
		var contents = FS.readdirSync(dir);
		contents.forEach(function(content){
			var path = Path.join(dir,content);
			var stats = FS.statSync(path);
			if(stats.isDirectory())
				detectChanges(path);
			else if(stats.isFile() &&
					Path.extname(path) === ".html"){
				grabContent(path);
			}
		});
	}

	function grabContent(path){
		var $content = $( read(path) );
		$("div.content-wrapper").html( $content.html() );
		write(path, Beautify.html( serializeDocument(document) ));
		$("div.content-wrapper").html("");
	}
}

new Tree();