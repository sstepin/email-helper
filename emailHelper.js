
//Global Variables
var obj;
var dict = {};

//Get and Process Data from MySQL.
$(document).ready(function () 
{
	$('#selAll').prop('checked', false);

	$.ajax(
		{
			type: 'GET',
			url: 'emailHelper.php',
			datatype: "json",
			async: true,
			success: function (data) 
			{
				processData(data);
			}
		});
});

//Process Data from MySQL.  [Called by $(document).ready(function().]
function processData(data) 
{
	//Create JSON object & sort.
	obj = JSON.parse(data);
	obj = obj.sort();

	//Create dictionary for username/email lookup.
	for (var i = 0; i < obj.length; i++) 
	{
		dict[obj[i].username] = obj[i].email;
	}
	
	createCheckBoxes();
}


//####### 1. update checkbox row HTML dynamic generation

//Create checkboxes dynamically for each contact retrieved. [Called by processData() function.]
function createCheckBoxes() 
{
	for (var i = 0; i < obj.length; i++)
	{
	
		var html = '<tr class="contact-row" id=' + obj[i].username +'>' +
						'<td>' +
							'<input type="checkbox" class="ckbx" name="contact" value="1">' +
							'<span class = "first-last-name">' + obj[i].first_name + " " + obj[i].last_name + '</span>' +
							'<span class = "username">(' + obj[i].username + ')</span>' +
						'</td>' + 
						'<td>' +
							obj[i].theatre_group +
						'</td>' +
						'<td>' +
							obj[i].role +
						'</td>' +
					'</tr>' +
					'<br>'
		$('#tableContacts').append(html);	

	}
}

//####### 2. update namebox HTML dynamic generation

//Select all is clicked (checked/unchecked).
$(document).on('click', '#selAll', function ()
{
	'use strict';
	var sAll = $('#selAll');
	var checkboxes = $("input[name='contact']");

	$('.nameBox').remove();

	//When select all is checked/unchecked, check/uncheck all checkboxes.
	for (var i = 0; i < checkboxes.length; i++) 
	{
		checkboxes[i].checked = sAll.prop('checked');
		
		//var nameBoxId = $(checkboxes[i]).siblings('.username').text();
		var nameBoxId = $('.contact-row').id;

		if(sAll.prop('checked') == true)
		{
			$('.toMailFlex').append('<div class="nameBox"><span id =' + nameBoxId + '>' + $(checkboxes[i]).siblings('.first-last-name').text() + ' (' + $(checkboxes[i]).siblings('.username').text() + ')</span></div>');
		}
	}
});

//If all other checkboxes are checked/unchecked, check/uncheck select all checkbox.
$(document).on('click', '#contactContainer', function ()
{
	var sAll = $('#selAll');
	var checkboxes = document.getElementsByName('contact');
	var ckBoxesChecked = $("input[name='contact']:checked");

	if (checkboxes.length == ckBoxesChecked.length) //Are all checkboxes checked?
	{
		sAll.prop('checked',true); 
	}
	else
	{
		sAll.prop('checked',false);
	}
});

//###### 3. new code based on new html to handle scenario (2) from notebook

//If checkbox clicked, add name to "toMailFlex".
$(document).on('click', '.ckbx', function addNameBox()
{
	var nameBoxId = $(this).siblings('.username').text();

	if (this.checked) 
	{
		$('.toMailFlex').append('<div class="nameBox"+><span id =' + nameBoxId + '>' + $(this).siblings('.first-last-name').text() + ' (' + $(this).siblings('.username').text() + ')</span></div>');
	}
	else 
	{
		$('#' + nameBoxId).parent(".nameBox").remove();
	}
});


//###### 4. new code based on new html to handle scenario (3) from notebook


//If nameBox clicked, highlight/unhighlight as required.
$(document).on('click','.nameBox', function()
{
	if($(this).hasClass('selectClass') == false)
	{
		//Unhighlight all nameBoxes.
		$('.selectClass').removeClass('selectClass');
		
		//Highlight selected nameBox.
		$( this ).addClass( "selectClass" );
	}
	else
	{
		//Unhighlight selected nameBox.
		$(this).removeClass('selectClass');
	}
});


//If delete or backspace, then delete selected nameBox & uncheck related checkbox.
$(document).on('keydown', function(e)
{
	if((e.keyCode==46) || (e.keyCode==8))
	{	
		//TODO: make sure backspace doesnt go back in page history

		//TODO: Uncheck corresponding checkbox.

		//Delete selected nameBox.
		$('.selectClass').remove();

	}
});

//When compose button is clicked, Open default email & populate "To" field.
$(document).on('click', '#compose', function ()
{
	var email = "";
	var ckbxes = $('input[name="contact"');

	for (var i = 0; i < obj.length; i++)
	{
		if (ckbxes[i].checked == true)
		{
			email = email + obj[i].email + "; ";			
		}
	}
	

	if (email == "")
	{
		alert("no contacts selected");
	}
	else 
	{
		window.location.href = "mailto:" + email + "?subject=BBAT Update";
		//var there = "mailto:" + email + "?subject=BBAT Update"
		//$("#mailto-destination").attr("href", there).click();

	}
});