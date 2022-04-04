table = $('#tablephone');
getData();




/* Task 1  */




/* Setting up on click listeners for the column headers */
$('#th1').on('click',function (){
    sortTable(1);
})

$('#th2').on('click',function (){
    sortTable(2);
})

$('#th3').on('click',function (){
    sortTable(3);
})

$('#th4').on('click',function (){
    sortTable(4);
})

function sortTable(x){
    max = $('.phonetable tr').length -1; /* Gets the length of the table ( number of table rows)*/
    console.log(x);
    /*bubble sort*/

    for(j=0;j<max;j++) {
        tableRows = $("table tr td:nth-child("+x+")");
        if(x>1){
            tableRows.splice(-1);     /*removes the last element from the array since every table column except number one takes the part of the form to its left (because of td:nth-child)*/
        }
        console.log(tableRows);
        /* Gets all the inner Text from the td under the clicked column*/
        for(i=0;i<tableRows.length-1;i++){
            if(x==4){   /* if we are looking at screensize which are numbers we need to convert them to compare them*/
                if(parseFloat(tableRows[i].innerText) > parseFloat(tableRows[i+1].innerText) ){/* Compares the values of each element in the row*/
                    $('tr:nth-child('+(i+3)+')').after($('tr:nth-child('+(i+2)+')')); /*swaps the current row with the next*/

                }
            }else{
                if(tableRows[i].innerText.toLowerCase() > tableRows[i+1].innerText.toLowerCase() ){/* Compares the values of each element in the row*/
                    $('tr:nth-child('+(i+3)+')').after($('tr:nth-child('+(i+2)+')')); /*swaps the current row with the next*/

                }
            }

        }
    }
}




/* Task 2 */




/* Setting up the reset button and it's functionality */
$("#resetbutton").click(function(){
    $("#result").empty();
    /* Setting up ajax get method for reseting the database */
    $.ajax({
        url: "http://localhost:3000/Delete",
        method: "Delete",
        success:function (){
            $('tbody').children(":not(#formrow):not(#tablecontent)").remove();  /*clear table except the form and the headers*/
            getData();
        }
    })
})




/* Task 3 */




/* Setting up ajax get method*/
function getData(){
    $.ajax({
        url: "http://localhost:3000/RetrieveAll",
        method: "GET",
        dataType: 'json',
        success:function (data){
            storeData(data);  /*call function when successfuly get data*/

        },
        error:function (error){
        }
    });
}

function storeData(data){
    tableData = data
    console.log(tableData.rows[0].brand);

    for(i=0;i<data.rows.length;i++){  /*loop through data and make table*/
        var row = document.createElement('tr');
        $('#formrow').before(row);  /*puts data in between form and table headers*/
        td1 = $("<td></td>").html(tableData.rows[i].brand).appendTo(row);

        td2 = $("<td></td>").html(tableData.rows[i].model).appendTo(row);

        td3 = $("<td></td>").html(tableData.rows[i].os).appendTo(row);

        td4 = $("<td></td>").html(tableData.rows[i].screensize).appendTo(row);

        img=$("<img src='"+tableData.rows[i].image+"'>");
        td5 = $("<td></td>");
        img.appendTo(td5);
        td5.appendTo(row);

        td6 = $("<td></td>").html(tableData.rows[i].id).appendTo(row);

    }

}

/* Task 4 */

$('#button').on('click', function(clickEvent){  /*listener on click for submit button*/
    console.log("potat");
    clickEvent.preventDefault();  /*prevents redirect to page when submit*/
    var formData = {
        "brand":$('#brand').val(),
        "model":$('#model').val(),
        "os":$('#os').val(),
        "screensize":$('#screensize').val(),
        "image":$('#image').val()
    };     //create variable that is in form of json
    /*send data*/
    $.ajax({
        url: 'http://localhost:3000/Create',
        type: 'post',
        dataType:'json',
        contentType: 'application/json',
        success:function (){
            $('tbody').children(":not(#formrow):not(#tablecontent)").remove();  /*clear table except the form and the headers*/
            getData();
        },
        data: JSON.stringify(formData)


    });
})

/*Bonus Task UPDATE EVENT*/
$('#update').on('click', function(clickEvent){  /*listener on click for submit button*/
    clickEvent.preventDefault();  /*prevents redirect to page when submit*/
    var formData = {
        "brand":$('#brand').val(),
        "model":$('#model').val(),
        "os":$('#os').val(),
        "screensize":$('#screensize').val(),
        "image":$('#image').val(),
        "id":$('#ide').val()
    };  //create variable that is in form of json
    /*send data*/
    $.ajax({
        url: 'http://localhost:3000/Update',
        type: 'put',
        dataType:'json',
        contentType: 'application/json',
        success:function (){
            $('tbody').children(":not(#formrow):not(#tablecontent)").remove();  /*clear table except the form and the headers*/
            getData();
        },
        data: JSON.stringify(formData)


    });
})

/*Bonus task DELETE EVENT*/

$('#delete').on('click', function(clickEvent){  /*listener on click for submit button*/
    clickEvent.preventDefault();  /*prevents redirect to page when submit*/
    var formData = {
        "id":$('#ide').val()
    };   // create variable that is in the form of json
    /*send data*/
    $.ajax({
        url: 'http://localhost:3000/Delete',
        type: 'delete',
        dataType:'json',
        contentType: 'application/json',
        success:function (){
            $('tbody').children(":not(#formrow):not(#tablecontent)").remove();  /*clear table except the form and the headers*/
            getData();
        },
        data: JSON.stringify(formData)


    });
})

/* resize buttons */

let $fontIncrease = $("#plus");
$fontIncrease.click(function(event){

    $("*").css("font-size","x-large");
});
let $fontDecrease = $("#minus");
$fontDecrease.click(function(event){
    $("*").css("font-size","small");
});
let $fontReset = $("#resettext");
$fontReset.click(function(event){
    $("*").css("font-size","medium");
});


