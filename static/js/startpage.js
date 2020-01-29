var winFeature ='location=no,toolbar=no,menubar=no,titlebar=no,scrollbars=yes,fullscreen=yes';

var startGame=function(){
    document.getElementById('Start').disabled='disabled';
    window.open('main.html','_blank',winFeature);
}