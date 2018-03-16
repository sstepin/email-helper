var obj;

/*Get & Process Contact Info from Mysql.*/
$(document).ready(function()
{
    $.ajax(
        {
            type: 'GET',
            url: 'emailHelper.php',
            datatype: "json",
            async: true,
            /*			data:{Theater:"EMEAR"},*/
			success: function(data) 
			{
				obj = JSON.parse(data);
				console.log(JSON.parse(data));
				
				processData();
			}
        });
});


/*Create checkboxes dynamically for each contact retrieved.*/
function processData()
{	for(i=0; i<obj.length; i++)
	{
		$('#contactContainer').append('<input type="checkbox" class="ckbx" name="contact" value="1"><span>' + obj[i].first_name + " " + obj[i].last_name + '</span><br>');
	}
	
}

/*When compose button is clicked, Open default email & populate "To" field.*/
$(document).on('click', '#compose', function()
{
	alert("reaching compose.")
	var email = obj.email;
	window.open("mailto:" + email);
})


/*When select all is checked/unchecked, check/uncheck all other checkboxes.*/
$(document).on('click','#selAll', function() 
{
	'use strict';

    var sAll = document.getElementById('selAll');
    
	var checkboxes = document.getElementsByName('contact');
    for (var i=0; i<checkboxes.length;i++) 
	{
        checkboxes[i].checked = sAll.checked;
	}
});

/*If all other checkboxes are checked/unchecked, check/uncheck select all checkbox.*/
$(document).on('click','#contactContainer',function()
{
	var sAll = document.getElementById('selAll');
	var checkboxes = document.getElementsByName('contact');
	var ckBoxesChecked=$("input[name='contact']:checked");
	if(checkboxes.length == ckBoxesChecked.length) /*Are all checkboxes checked?*/
	{
		sAll.checked = true; /*Check select all checkbox*/
	}
	else
	{
		sAll.checked = false; /*Uncheck select all checkbox*/
	}
});

