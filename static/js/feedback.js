$(document).ready(function(){
    $('#submit').on('click', function(e) {
        e.preventDefault();
        console.log("Entered sending process");
        // Get the form instance
        var $form = $('#testform');
        
        // Use Ajax to submit form data
        var url = "https://script.google.com/macros/s/AKfycbw2BhLpVcwKywt3l2dMCpyU6499k-g1lgHKJVv1mJNrnvcIvEc/exec";
        
        var jqxhr = $.get(url, $form.serialize(), function(data) {
            console.log("Success! Data: " + data.statusText);
            alert("Thank you!!!");
            setTimeout(()=>console.log("Closing the window..." + "\n" +"Good Bye"),3000);
            window.close();
        })
        .fail(function(data){
            console.warn("Error! Data: " + data.statusText);
            // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
            if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
                alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
                alert("Thank you!!!")           
            }
        });
    })
});