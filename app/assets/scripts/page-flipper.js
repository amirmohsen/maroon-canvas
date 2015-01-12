function PageFlipper(){

	var $canvases = null;

	init();

	function init(){
		$(document).ready(function(){

			var context = null;

			$canvases = $("canvas.page-flipper").each(function(index, canvas){
				
				if (canvas.getContext)
					context = canvas.getContext('2d');
				else
					return;

				context.fillStyle = "rgba(144,58,58,0.5)";
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(120,0);
				context.bezierCurveTo(118,10,116,15,115,20);
				context.bezierCurveTo(90,60,50,85,20,115);
				context.bezierCurveTo(15,116,10,118,0,120);
				context.lineTo(0,0);
				context.fill();

				context.fillStyle = "rgb(218,147,144)";
				context.beginPath();
				context.moveTo(115,20);
				context.bezierCurveTo(90,60,50,85,20,115);
				context.bezierCurveTo(50,70,55,25,15,25);
				context.bezierCurveTo(75,15,90,10,115,20);
				context.fill();
			});

			if(context)
				return;
		});
	}
}

new PageFlipper();