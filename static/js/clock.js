  // Set the date we're counting down to
  var countDown = new Date().getTime();
  //console.log(countDown);
  countDown+=((1000*60)*10 +3000);
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
          alert("TIME UP. Nice Try!!!");
          $(".result").append("<span id='time'>Time required: 10 minutes.</span>");
    } 
},750);
