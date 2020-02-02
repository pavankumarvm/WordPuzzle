var score_value=0;
var bonus=false;

function getUrlVars() {
	var vars = {};
	var URL=window.location.href;
	var parts = URL.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

function sendData(sec){
	var Data=getUrlVars();
	Data["Email"]=decodeURIComponent(Data["Email"]);
	Data["Time"]=sec;
	Data["Score"]=score_value;
	if(!bonus)
	Data["Bonus"]="NO";
	else
	Data["Bonus"]="YES";
	console.log(Data);

	$(".final").append("<form id='testform' role='form'><label for='team' id='lteam'>Team No. :<input type='text' name='Team' class='Data' id='team' readonly='readonly' value="+ Data["Team"]
	+"></label><input type='text' name='Name' class='Data' id='name' readonly='readonly' value="+ Data["Name"]
	+"></label><input type='text' name='Email' class='Data' id='email' readonly='readonly' value="+ Data["Email"]
	+"><label for='time' id='ltime'>Time taken(in secs) :<input type='text' name='Time' class='Data' id='time' readonly='readonly' value="+ Data["Time"]
	+"></label><label for='scored' id='lscore'>Your Score :<input type='text' name='Score' class='Data' id='scored' readonly='readonly' value="+ Data["Score"]
	+"></label><label for='bonus' id='lbonus'>Got Bonus :<input type='text' name='Bonus' class='Data' id='scored' readonly='readonly' value="+ Data["Bonus"]
	+"></label><button type='submit' class='Data' id='submit'>End Game</button></form>"
	);

	$('#submit').on('click', function(e) {
	e.preventDefault();

	// Get the form instance
	var $form = $('#testform');

	// Get the BootstrapValidator instance
	//var bv = $form.data('bootstrapValidator');

	// Use Ajax to submit form data
	var url = "https://script.google.com/macros/s/AKfycbz1keXBGyXd5ILdZQIm6amTpeMAfiz-eDB-XdtsfDCdvn4t6yGz/exec";
	var redirectUrl = 'feedback.html';
	// show the loading 
	//$('#postForm').prepend($('<span></span>').addClass('glyphicon glyphicon-refresh glyphicon-refresh-animate'));
	var jqxhr = $.get(url, $form.serialize(), function(data) {
		console.log("Success! Data: " + data.statusText);
		$(location).attr('href',redirectUrl);
	})
	.fail(function(data){
		console.warn("Error! Data: " + data.statusText);
		// HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
		if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
			//alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
			$(location).attr('href',redirectUrl);                
		}
	});
	})
}

//CLOCK

  // Set the date we're counting down to
var countDown = new Date().getTime();
  //console.log(countDown);
countDown+=((1000*60)*10+2000);		//1000*60 = 1 min.
// Update the count down every 1 second;
  var x = setInterval(function() {
    // Get today's date and time
    var now = new Date().getTime();

    // Find the duration between now and the count down date
    var duration = countDown - now;

    // Time calculations for hours, minutes and seconds
    var hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((duration % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("hour").innerHTML =hours; 
    document.getElementById("minute").innerHTML = minutes;  
    document.getElementById("second").innerHTML =seconds;  
    if (duration <= 0) {      
          clearInterval(x); 
          document.getElementById("hour").innerHTML ='0'; 
          document.getElementById("minute").innerHTML ='0' ;  
          document.getElementById("second").innerHTML = '0';
		  timeup()
		  sendData(600);
          $(".result").append("<br><span id='mintime'>Time required: 10 minutes.</span>");
    } 
},750);

function timeup() {
	$(".final").append("<div class='container'></div>");
	$(".container").append("<div class='balloon' id='one'></div><div class='balloon' id='two'></div><div class='congrats'><img src='static/images/clock.gif' class='img-clock'></div><div class='balloon' id='three'></div><div class='balloon' id='four'></div>");
	$(".container").append("<h1 style='margin-left:315px'>Time UP! Nice Try</h1>");
	//$(".balloon").append("<img src='static/images/logo.png' class='logo'>");
}

//PUZZLE LOGIC

const x_factor=20;		//for no. of rows and columns
const z_factor=16;		//for size of each cell
var allwords = ["INHERITANCE","POLYMORPHISM","ENCAPSULATION","ABSTRACTION","VIRTUAL","OBJECT","CLASS",
				"FUNCTION","NAMESPACE","TEMPLATE","VARIABLE","TYPENAME","TYPEDEF","IMPORT","INCLUDE",
				"STRUCT","RETURN","OPERATOR","DOUBLE","EXPLICIT","CONSTANT","ARRAY","STACK","QUEUE",
				"GRAPH","VECTOR","BREAK","CONTINUE","SWITCH","DEFAULT","SIZEOF","STATIC","UNION",
				"VOLATILE","THROW","CATCH","DELETE","FRIEND","INLINE","WHILE","FINALLY","GLOBAL",
				"RANGE","ASSERT","EXCEPT","ABSTRACT","EXTENDS","NATIVE","PUBLIC","PRIVATE",
				"PROTECTED","INTERFACE","SUPER","IMPLEMENTS","ENSURE","MODULE","PACKAGE",
				"YIELD","RAISE","LAMBDA","IDENTIFIER","LITERAL","FLOAT","PRINT","INPUT","TUPLE",
				"DICTIONARY","DATATYPE","UPDATE","STRING","REPLACE","SPLIT","STRIP","LIST","METHOD",
				"FLOOR","RANDOM","DATAMEMBER","INSTANCE","CONSTRUCTOR","EXCEPTION","DESTRUCTOR",
				"IMPLICIT","BINDING","IOSTREAM","VECTOR","QUEUE","DQUEUE","FSTREAM","MUTABLE","EXPORT",
				"EXTERN","REGISTER","POINTER","ITERATOR","MULTISET","MULTIMAP","REMOVE","GETLINE","RUNTIME",
				"COMPILER","DYNAMIC"];
var words_list=["CODINGHUB"];

const size=x_factor*x_factor;
const y_factor=2*z_factor*x_factor;
const x1=x_factor-1;
const x2=x_factor+1;
var pos = [];
var click = { "startPos": "", "endPos": ""};
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
			   "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var words=[];
var no_of_rows=x_factor;
var no_of_columns=x_factor;
var grayed= [],start= 0,wordnum= 0,cell= [],startletter= [],stopletter= [],notintable= [];

// Prepare the wordsearch with random letters and word layout
$(document).ready(function() {
	//Disable refreshing by F5 and finding by Ctrl+F and inspection by ctrl+shift+I/C
	$(document).on("keydown", disablekeys);
	// grab the size of the grid.  I used this method in case I need to 
	// scale this word search in the future
	 //($(".left").css("width").slice(0, 3) - 20) / 2 ;
	$(".left").append("<div class='gameboard' style='width:" + (y_factor) + ";height:" + (y_factor) + ";'></div>");
	$(".gameboard").append("<div class='letters'></div>");
	$(".letters").append("<canvas id='a' width='" + y_factor + "' height='" + y_factor + "'></canvas>");
	$(".letters").append("<canvas id='c' width='" + y_factor + "' height='" + y_factor + "'></canvas>");
	drawboard();
})

var drawboard=function(){
	// put random letters on the board
	choosewords();
	//words_list=words_list.sort(sortByLengthDesc);
	for (var i = 0; i < size; i++) {
		$(".letters").append("<span class='" + (i + 1) + "'>" + 
							getRandomLetter() + "</span>");
							//' ' +"</span>");
	}
	// insert the words onto the board
	for(var i=0;i<words_list.length;i++){
		placeword(words_list[i]);
	}

	for (var i = 0; i <words.length; i++) {
		words[i].end = words[i].start;
		displayWord(words[i]);
		// save the start and end of each word for word checking later
		pos[i] = { "start": words[i].start, "end": words[i].end };
		if(i!=0)
			$(".words").append("<span class='" + (i) + "'>" +  words[i].word + "</span>");
		else
		$(".words").append("<span class='0' style='font-size:1.3em;color:red;'> Guess word?</span>");
	}
	$("#menu").on("mouseup", function() {
		$(this).css( {"display": "none"})
		$(".main").slideDown("slow", function() {
		})
	});
}

function sortByLengthDesc(a, b) {
	if (a.length > b.length)
	  return -1;
	if (a.length < b.length)
	  return 1;
	return 0;
}


function getRandomLetter() {
	return letters[Math.floor(Math.random() * letters.length)];
}

function choosewords(){

	for(let i=0;i<x_factor;i++){
		let x=Math.floor(Math.random()*(allwords.length));
		let w=allwords[x];
		words_list.push(w);
		const index=allwords.indexOf(w);
		if(index>-1){
			allwords.splice(index,1);
		}
	}
	console.log(words_list);
}

function placeword(theword)
{
	// Number of attempts that will be made to place a word before an error
	var attemptnum = 200;
	
	var wordlength = theword.length;
	// Attempt to find proper place for word
	var stopper = 0;
	var autostop = 0;
	var star=0;
	var dir='E';
	while (stopper == 0 && autostop < attemptnum) {
		// Get starting cell and direction
		var cellx = (Math.floor(Math.random() * no_of_rows)) + 1;
		var celly = (Math.floor(Math.random() * no_of_columns)) + 1;
		var cellxy = ((celly - 1) * no_of_rows) + cellx;
		startletter[wordnum] = cellxy;
		var direction = Math.floor(Math.random()*8);
		
		// If horizontal forward
		if (direction === 0) {
		// If word fits
		var fits = cellx + wordlength - 1;
		if (fits <=  no_of_rows) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place++;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='E';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place++;
				i++;
			}
			stopper = 1;
			}
			
		}
		}
		
		// If horizontal backward
		else if (direction === 1) {
		// If word fits
		var fits = cellx - wordlength + 1;
		if (fits > 0) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place--;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='W';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place--;
				i++;
			}
			stopper = 1;
			}
		}
		}
		
		
		// If vertical forward
		else if (direction === 2) {
		var fits = celly + wordlength - 1;
		if (fits <=  no_of_columns) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = place +  no_of_rows;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			// Place letters in cells
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='S';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = place +  no_of_rows;
				i++;
			}
			stopper = 1;
			}
		}
		
		}
		
		
		// If vertical backward
		else if (direction === 3) {
		var fits = celly - wordlength + 1;
		if (fits > 0) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = place -  no_of_rows;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='N';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = place -  no_of_rows;
				i++;
			}
			stopper = 1;
			}
		}
		
		}
		
		
		
		// If diagonal NE
		else if (direction === 4) {
		var fitsx = cellx + wordlength - 1;
		var fitsy = celly - wordlength + 1;
		if (fitsx <=  no_of_rows && fitsy > 0) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = (place -  no_of_rows) + 1;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='NE';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = (place -  no_of_rows) + 1;
				i++;
			}
			stopper = 1;
			}
		}
		}
		
		
		
		// If diagonal SW
		else if (direction === 5) {
		var fitsx = cellx - wordlength + 1;
		var fitsy = celly + wordlength - 1;
		if (fitsy <=  no_of_columns && fitsx > 0) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = (place +  no_of_rows) - 1;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='SW';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = (place +  no_of_rows) - 1;
				i++;
			}
			stopper = 1;
			}
		}
		}
		
		
		
		// If diagonal SE
		else if (direction === 6) {
		var fitsx = cellx + wordlength - 1;
		var fitsy = celly + wordlength - 1;
		if (fitsy <=  no_of_columns && fitsx <=  no_of_rows) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = (place +  no_of_rows) + 1;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='SE';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = (place +  no_of_rows) + 1;
				i++;
			}
			stopper = 1;
			}
		}
		}
		
		
		
		// If diagonal NW
		else if (direction === 7) {
		var fitsx = cellx - wordlength + 1;
		var fitsy = celly - wordlength + 1;
		if (fitsy > 0 && fitsx > 0) {
			
			// Collision test
			var coltest = 0;
			var i = 1;
			var place = cellxy;
			while (i <= wordlength) {
			if ( cell[place] &&  cell[place] != theword.charAt(i - 1))
				coltest = 1;
			place = (place -  no_of_rows) - 1;
			i++;
			}
			
			// Place letters in cells if nothing is colliding
			if (!coltest) {
			var i = 1;
			var place = cellxy;
			star=cellxy;
			dir='NW';
			while (i <= wordlength) {
				cell[place] = theword.charAt(i - 1);
				stopletter[ wordnum] = place;
				if (! grayed[ wordnum])
					grayed[ wordnum] = place;
				else
					grayed[ wordnum] =  grayed[ wordnum] + ',' + place;
				place = (place -  no_of_rows) - 1;
				i++;
			}
			stopper = 1;
			}
		}
		}
		autostop++;
	} // End stopper loop
	// If word could not be placed
	if (autostop == attemptnum) {
		notintable.push(theword);
	}
	else{
		words.push({"word":theword,"direction":dir,"start":star});
	}
	wordnum++;
}
	
function displayWord(w) {
	for (var j = 0; j < w.word.length; j++){
		if (w.direction == "N") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end -=x_factor;		//change this to n;
		}
		if (w.direction == "NE") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end -= x1;	//change this to n-1
		}
		if (w.direction == "E") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end += 1;		//don't change
		}
		if (w.direction == "SE") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end += x2;	//change this to n+1
		}
		if (w.direction == "S") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end += x_factor;		//change this to n;
		}
		if (w.direction == "SW") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end += x1;		//change this to n-1;
		}
		if (w.direction == "W") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end -= 1;			//don't change
		}
		if (w.direction == "NW") {
			$(".letters").find("." + w.end).text(w.word[j]);
			if (j + 1 != w.word.length) w.end -= x2;		//change this to n+1
		}
	}
}


// start of x & y, end of x & y.  
var sX, sY, eX, eY, canvas, ctx, height, width, diff;
var r = 10;
var n = Math.sqrt((r * r) / 2);
var strokeColor = "blue";
var isMouseDown = false;
var mouseMoved = false;

$(document).ready(function() {
	$("#c").on("mousedown mouseup mousemove mouseleave", function(e) {
		e.preventDefault();
		//console.log(e);
		if (e.type == "mousedown") {
			setCanvas("c");			
			isMouseDown = true;
      
      // Used for Firefox
			sX = e.offsetX || e.clientX - $(e.target).offset().left;
			sY = e.offsetY || e.clientY - $(e.target).offset().top;
			// adjust the center of the arc 
			sX -= (sX % z_factor);
			sY -= (sY % z_factor);
			if (!(sX % (z_factor*2))) sX += z_factor;
			if (!(sY % (z_factor*2))) sY += z_factor;

			setPos(sX, sY, "start");
			draw(e.type);
		} 
		else if (e.type == "mousemove") {
			if (isMouseDown) {
				mouseMoved = true;
				eX = e.offsetX || e.clientX - $(e.target).offset().left;
				eY = e.offsetY || e.clientY - $(e.target).offset().top;
				draw(e.type);
			}
		} 
		else if (e.type == "mouseup") {
			isMouseDown = false;
			ctx.clearRect(0, 0, width, height);
			if (mouseMoved) {
				mouseMoved = false;

				eX -= eX % z_factor;
				eY -= eY % z_factor;
				if (!(eX % (z_factor*2))) eX += z_factor;
				if (!(eY % (z_factor*2))) eY += z_factor;

				// draw the last line and clear the canvas to check and see if its the 
				// correct word
				draw(e.type);
				ctx.clearRect(0, 0, width, height);
				// if a correct word has been highlighted change the canvas to 
				// the permanent one and redraw the arcs and lines.  Then scratch the 
				// word on the right.
				if (checkWord()) {
					setCanvas("a");
					draw(e.type);
					scratchWord();
					// Check if the game is over
					if(isEndOfGame()) {
						//alert("Good JOB!");
						congratulate();
						clearInterval(x);
						var min=parseInt(document.getElementById("minute").innerHTML);
						var sec=parseInt(document.getElementById("second").innerHTML);
						/*console.log(min);
						console.log(sec);*/
						sec = 600 - (min*60 + sec);
						sendData(sec)
						//console.log(sec);
						min = Math.floor(sec / 60);
						//console.log(min);
						sec = sec % 60;
						$(".result").append("<br><span id='mintime'>Time required :  "+ min +" minutes "+ sec +" seconds</span>");
					}
				}
			}
		} 
		else if (e.type == "mouseleave") {
			isMouseDown = false;
			draw(e.type);
		}
	});
})

function congratulate() {
	$(".final").append("<div class='container'></div>");
	$(".container").append("<div class='balloon' id='one'></div><div class='balloon' id='two'></div><div class='congrats'><img src='static/images/trophy.png' class='img-trophy'></div><div class='balloon' id='three'></div><div class='balloon' id='four'></div>");
	$(".container").append("<h1 style='margin-left:220px;'>CONGRATULATIONS!!</h1>");
	//$(".balloon").append("<img src='static/images/logo.png' class='logo'>");
}

// This function is called when lines need to be drawn on the game
function draw(f) {
	// used to draw an arc.  takes in two numbers that represent the beginning
	// and end of the arc
	function drawArc(xArc, yArc, num1, num2) {
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(xArc, yArc, r, num1 * Math.PI, num2 * Math.PI);
		ctx.strokeStyle = strokeColor;
		ctx.stroke();
	}

	// used to draw the two lines around letters
	function drawLines(mX1, mY1, lX1, lY1, mX2, mY2, lX2, lY2) {
		ctx.beginPath();
		ctx.moveTo(mX1, mY1);
		ctx.lineTo(lX1, lY1);
		ctx.moveTo(mX2, mY2);
		ctx.lineTo(lX2, lY2);
		ctx.stroke();
	}
	// Check and see what event occured and create the action that belongs to that 
	// event.
	if (f == "mousedown"){
		ctx.clearRect(0, 0, width, height);
		drawArc(sX, sY, 0, 2);
	}
	else if (f == "mousemove" || f == "mouseup") {
		/* 
		This is to show the rise over run I used to get the limits for 
		all eight directions.  This tells the conditionals when to activiate
		the lines and in which direction.
		rise = (sY - eY) * Math.sqrt(6);
		run = sX - eX;
		 */	  
		limit = ((sY - eY) * Math.sqrt(6)) / (sX - eX);
		// UP
		if ((limit > 6 || limit < -6) && eY < sY) {
			// clear the canvas
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			drawArc(sX, sY, 0, 1); // draw bottom arc
			drawArc(sX, eY, 1, 2); // draw top arc

			// draw the two lines that connect the bottom and the top arcs
			drawLines(sX + r, sY, sX + r, eY, sX - r, sY, sX -r, eY);	

			// if the player is selecting this as the last letter set its position 
			// for wordcheck
			if (f == "mouseup") setPos(sX, eY, "end");	
		}
		// DOWN
		if ((limit < -6 || limit > 6) && eY > sY) {
			// clear the canvas
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			drawArc(sX, sY, 1, 2); 
			drawArc(sX, eY, 0, 1); 
			drawLines(sX + r, sY, sX + r, eY, sX - r, sY, sX -r, eY);
			if (f == "mouseup") setPos(sX, eY, "end");		
		}				
		// LEFT
		if ((limit < 1 && limit > -1) && eX < sX) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			drawArc(sX, sY, 1.5, 0.5);
			drawArc(eX, sY, 0.5, 1.5);
			drawLines(sX, sY - r, eX, sY -r, sX, sY + r, eX, sY + r);
			if (f == "mouseup") setPos(eX, sY, "end");
		}	
		// RIGHT
		if ((limit < 1 && limit > -1) && eX > sX) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			drawArc(sX, sY, 0.5, 1.5);
			drawArc(eX, sY, 1.5, 0.5);
			drawLines(sX, sY - r, eX, sY -r, sX, sY + r, eX, sY + r);
			if (f == "mouseup") setPos(eX, sY, "end");
		}
		/* 
		This is for the NW diagonal lines it requires a special number 
		n that is the adjacent lengths of a 45-45-90 triangle needed to draw these
		lines.  It also creates a diff for the difference between the 
		start and the end of the arcs 
		*/
		// NW
		if ((limit > 1 && limit < 6) && (eX < sX && eY < sY)) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			diff = sX - eX;
			drawArc(sX, sY, 1.75, 0.75);
			drawArc(sX - diff, sY - diff, 0.75, 1.75);
			drawLines(sX + n, sY - n, sX + n - diff, sY - n - diff, 
					  sX - n, sY + n, sX - n - diff, sY + n - diff);
			if (f == "mouseup") setPos(sX - diff, sY - diff, "end");
		} 

		// NE
		if ((limit < -1 && limit > -6) && (eX > sX && eY < sY)) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			diff = sX - eX;
			drawArc(sX, sY, 0.25, 1.25);
			drawArc(sX - diff, sY + diff, 1.25, 0.25);
			drawLines(sX + n, sY + n, sX + n - diff, sY + n + diff, 
					  sX - n, sY - n, sX - n - diff, sY - n + diff);
			if (f == "mouseup") setPos(sX - diff, sY + diff, "end");
		} 
		// SW
		if ((limit < -1 && limit > -6) && (eX < sX && eY > sY)) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			diff = sX - eX;
			drawArc(sX, sY, 1.25, 0.25);
			drawArc(sX - diff, sY + diff, 0.25, 1.25);
			drawLines(sX + n, sY + n, sX + n - diff, sY + n + diff, 
					  sX - n, sY - n, sX - n - diff, sY - n + diff);
			if (f == "mouseup") setPos(sX - diff, sY + diff, "end");
		} 
		// SE
		if ((limit > 1 && limit < 6) && (eX > sX && eY > sY)) {
			if (f == "mousemove") ctx.clearRect(0, 0, width, height);
			diff = sX - eX;
			drawArc(sX, sY, 0.75, 1.75);
			drawArc(sX - diff, sY - diff, 1.75, 0.75);
			drawLines(sX + n, sY - n, sX + n - diff, sY - n - diff, 
					  sX - n, sY + n, sX - n - diff, sY + n - diff);
			if (f == "mouseup") setPos(sX - diff, sY - diff, "end");
		} 
	}
	else if (f == "mouseleave") {
		setCanvas("c");
		ctx.clearRect(0,0,width,height);
	}
}


// change the canvas between the bottom and top layer
function setCanvas(id) {
	canvas = document.getElementById(id);
	ctx = canvas.getContext("2d");
	width = canvas.width;
	height = canvas.height;
}


// set the offsets to numbers that match the class names of each letter
function setPos(x, y, loc) {
	tX = Math.floor(x /(z_factor*2)) + 1;
	tY = Math.floor(y /(z_factor*2)) + 1;
	if (loc == "start") click.startPos = (tY - 1) * x_factor + tX;
	else click.endPos = (tY - 1) * x_factor + tX;
}


// verify if the word chosen is the correct one. If a player decides
// to highlight a word starting from last letter to first this function
// will also support that ability
function checkWord() {
	// clears the pos array so that a player cannot highlight the same word twice
	function clearPos(p) {
		p.start = p.end = 0;
		return true;
	}
	// user highlights from first letter to last
	if (pos.some(function(o) { return o.start === click.startPos &&
							   o.end === click.endPos && clearPos(o); })) {
		return true;
	}
	// if user highlights from last letter to first
	else if (pos.some(function(o) { return o.start === click.endPos &&
									o.end === click.startPos && clearPos(o); })) {
		return true;
	}
	else return false;
}

// scratch the word on the right out when the word is found on the left
function scratchWord() {
	for (var i = 0; i < words.length; i++) {
		if ((click.startPos === words[i].start && click.endPos === words[i].end) ||
			(click.startPos === words[i].end && click.endPos === words[i].start)) {
			// little hack here
			$(".words").find("." + i).addClass("strike");
			if(i!=0)
				score_value++;
			else
				{
					alert("Nice work CHAMPION !!!" + "\n" + "Word Guessed correctly." + "\n" +"5 bonus points awarded.");
					bonus=true;
					$(".result").append("<span id='bonus' style='font-size:65px;color:red;margin-left:3px;'>+5</span>");
				}
			var score=document.getElementById("score");
			score.innerHTML=score_value;
		}
	}
	// check if the game is over
}

function disablekeys(e) { 
	if (((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82)
		||	((e.ctrlKey || e.metaKey) && e.keyCode === 70)
		||	(e.shiftKey) ||((e.which || e.keyCode)==123))
	 return false;
};

function isEndOfGame()
{
	var end=false;
	if(score_value==x_factor || pos.every(function(o) { return o.start === 0 && o.end === 0; }))
	end=true;
	return end; 
}