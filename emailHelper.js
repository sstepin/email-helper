
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

//Create checkboxes dynamically for each contact retrieved. [Called by processData() function.]
function createCheckBoxes() 
{
	for (var i = 0; i < obj.length; i++)
	{
	
		var rowHtml = '<tr class="contact-row" id=' + obj[i].username +'>' +
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
		$('#tableContacts').append(rowHtml);	

	}
}


//Select all is clicked (checked/unchecked).
$(document).on('click', '#selAll', function ()
{
	'use strict';
	var sAll = $('#selAll');
	var rows = $(".contact-row");

	$('.nameBox').remove();
	//When select all is checked/unchecked, check/uncheck all checkboxes.
	for (var i = 0; i < rows.length; i++) 
	{
		$(rows[i]).children().children(".ckbx").prop('checked', sAll.prop('checked'));
		
		if(sAll.prop('checked') == true)
		{
			createNameBoxHtml(rows[i]);
		}
	}
});

function createNameBoxHtml(checkedRow)
{
	var nameBoxId = checkedRow.id;
	var nameBoxHtml =	'<div class="nameBox" id=' + nameBoxId + '>' +
							'<span>' +
								$(checkedRow).children().children(".first-last-name").text() + ' ' + $(checkedRow).children().children(".username").text() +
							'</span>' +
						'</div>';

	 $('.toMailFlex').append(nameBoxHtml);	
}



//If checkbox clicked, add name to "toMailFlex".
$(document).on('click', '.contact-row', function()
{
	if ($(this).children().children(".ckbx").prop("checked") == false) 
	{
		$(this).children().children(".ckbx").prop("checked", true);
		createNameBoxHtml(this);
	}
	else 
	{
		$(this).children().children(".ckbx").prop("checked", false);
		$('.nameBox#' + this.id).remove();
	}
});

$(document).on('click', '.ckbx', function(event)
{
	$(this).parent().parent(".contact-row").click();
});


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

//If delete or backspace, then delete selected nameBox & uncheck related checkbox.
$(document).on('keydown', function(event)
{
	if((event.keyCode==46) || (event.keyCode==8))
	{	
		//make sure backspace doesnt go back in page history
		if(event.keyCode == 8) {
			event.preventDefault();
		}

		//Uncheck corresponding checkbox.
		var selectedNameboxId = $('.selectClass').prop("id");
		$(".contact-row#"+ selectedNameboxId).children().children(".ckbx").prop("checked", false);

		//Delete selected nameBox.
		$('.selectClass').remove();

	}
});

//TODO: make sure email client opens from every browser
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