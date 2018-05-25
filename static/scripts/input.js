// console.log("test");
let p1,p2,p3,p4
let data, settings;

function getInputData(){return data}
function getInputSettings(){
    phases();
    settings=[p1, p2,p3,p4];
    return settings}

window.onload = function() {

    var fileInput = document.getElementById('file-input');
    // var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener("change", function(e) {
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                // fileDisplayArea.innerText = reader.result;
                // console.log(reader.result);
                data=reader.result;
            }

            // reader.readAsText(file);
            reader.readAsBinaryString(file) 
        } else {
            // fileDisplayArea.innerText = "File not supported!";
        }
    });}

    btn=document.querySelector(".button");
btn.addEventListener("click",()=>{console.log("Tu wstawić funkcję liczącą")});



// {
//     "active": true,
//     "function": "gauss",
//     "t_start": 10,
//     "t_stop": 20,
//     "q": 500
//   },


function phases(){
    let cb=document.querySelectorAll(".cb");
    let cb1=true;
    let cb2=cb[0].checked;
    let cb3=cb[1].checked;
    let cb4=cb[1].checked;

    // let cb=document.querySelectorAll(".cb");
    let methods=document.querySelectorAll("select");


    let inputs=document.querySelectorAll(".input");

p1={
    "active": cb1,
    "function": methods[0].value,
    "t_start": parseInt(inputs[0].value),
    "t_stop": parseInt(inputs[1].value),
    "q": parseInt(inputs[2].value),
}
p2={
    "active": cb2,
    "function": methods[1].value,
    "t_start": parseInt(inputs[3].value),
    "t_stop": parseInt(inputs[4].value),
    "q": parseInt(inputs[5].value),
}
p3={
    "active": cb3,
    "function": methods[2].value,
    "t_start": parseInt(inputs[6].value),
    "t_stop": parseInt(inputs[7].value),
    "q": parseInt(inputs[8].value),
}
p4={
    "active": cb4,
    "function": methods[3].value,
    "t_start": parseInt(inputs[9].value),
    "t_stop": parseInt(inputs[10].value),
    "q": parseInt(inputs[11].value),
}
// console.log(p1);
}