let p1, p2, p3, p4
let data, settings;
let file

function getInputData() {
    return data
}

function getInputSettings() {
    phases();
    settings = [p1, p2, p3, p4];
    return settings
}

window.onload = function () {

    var fileInput = document.getElementById('file-input');
    // var fileDisplayArea = document.getElementById('fileDisplayArea');

    fileInput.addEventListener("change", function (e) {
        file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function (e) {
                // fileDisplayArea.innerText = reader.result;
                // console.log(reader.result);
                data = reader.result;
            }

            // reader.readAsText(file);
            reader.readAsBinaryString(file)
        } else {
            // fileDisplayArea.innerText = "File not supported!";
        }
    });
}
/*
btn = document.querySelector(".button");
btn.addEventListener("click", () => {
    validate();

});

const modal = document.getElementById("bulma_modal");

const modal_button = document.getElementById("modal_button");
modal_button.addEventListener("click", () => {
    modal.classList.remove("is-active")
})
*/

function validate() {
    let error = "";
    if (file == undefined)
        error += "Nie wybrano pliku z danymi! \n"
    s_arr = getInputSettings();
    for (let i = 0; i < s_arr.length; i++) {
        if (s_arr[i].t_start > s_arr[i].t_stop)
            error += "Nieprawidłowe temperatury dla " + (i + 1) + " przemiany! \n";
    }

    if (error !== "") {
        //const modal_text = document.querySelector(".modal-card-body p");
        //modal_text.innerText = error;

        //modal.classList.add("is-active");
		alert(error);
    } else {
        var result = calculateEvent();
        printChart(result);
    }
}


function phases() {
    let cb = document.querySelectorAll(".cb");
    let cb1 = true;
    let cb2 = cb[0].checked;
    let cb3 = cb[1].checked;
    let cb4 = cb[1].checked;

    // let cb=document.querySelectorAll(".cb");
    let methods = document.querySelectorAll("select");


    let inputs = document.querySelectorAll(".input");

    p1 = {
        "active": cb1,
        "function": methods[0].value,
        "t_start": parseInt(inputs[0].value),
        "t_stop": parseInt(inputs[1].value),
        "q": parseInt(inputs[2].value),
    }
    p2 = {
        "active": cb2,
        "function": methods[1].value,
        "t_start": parseInt(inputs[3].value),
        "t_stop": parseInt(inputs[4].value),
        "q": parseInt(inputs[5].value),
    }
    p3 = {
        "active": cb3,
        "function": methods[2].value,
        "t_start": parseInt(inputs[6].value),
        "t_stop": parseInt(inputs[7].value),
        "q": parseInt(inputs[8].value),
    }
    p4 = {
        "active": cb4,
        "function": methods[3].value,
        "t_start": parseInt(inputs[9].value),
        "t_stop": parseInt(inputs[10].value),
        "q": parseInt(inputs[11].value),
    }

}
