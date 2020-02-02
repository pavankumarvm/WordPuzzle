var startGame=function(){
    document.getElementById('Start').disabled='disabled';
};

var allmails=["master@gmail.com","hacker@gmail.com","coder@gmail.com"]


function validate(){
    //console.log("Validating the email");
    var mail=document.getElementById("email");
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail.value)){
        if(allmails.every(function(o){return o!=mail.value}))
        {
            alert("You are not registered with us.If registered and can't play,then" + "\n" + "Contact the Administrator.");
            mail.value="";
            mail.focus();
        }
        else{
            var a=allmails.indexOf(mail.value);
            console.log("Your Team no is:"+(a+1));
            var team=document.getElementById("team");
            team.value=a+1;
        }
    }
    else{
        //console.log("Emaii ID is Invalid");
        mail.focus();
    }
}
