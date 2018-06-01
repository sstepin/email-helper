
//Global Variables
var obj;
var dict = {};

//Get and Process Data from MySQL.
$(document).ready(function () 
{
	$('#selAll').prop('checked', false);
	$('.filter').prop('checked',true);

	//TODO: replace deprecated selectAllMatch code
	//var config = { attributes: true, childList: true };
	//var observer = new MutationObserver(selectAllMatch);
	//observer.observe($('.contact-row'), config);

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
	
	createCheckBoxRows();
}

//Create checkbox rows dynamically for each contact retrieved. [Called by processData() function.]
function createCheckBoxRows() 
{
	for (var i = 0; i < obj.length; i++)
	{
	
		var rowHtml = '<tr class="contact-row ' + obj[i].theatre_group + ' ' + obj[i].role + '" id=' + obj[i].username +'>' +
						'<td>' +
							'<input type="checkbox" class="ckbx" name="contact" value="1">' +
							'<span class = "first-last-name">' + obj[i].first_name + " " + obj[i].last_name + '</span>' +
							'<span class = "username"> (' + obj[i].username + ')</span>' +
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
	var rows = $(".contact-row:visible");

	//Clear nameboxes.
	$('.nameBox').remove();

	//TODO: When select all is checked/unchecked, check/uncheck all UNHIDDEN checkboxes.
	for (var i = 0; i < rows.length; i++) 
	{
		$(rows[i]).children().children(".ckbx").prop('checked', sAll.prop('checked'));
		
		if(sAll.prop('checked') == true)
		{
			createNameBoxHtml(rows[i]);
		}
	}
});

//Create namebox for checked row.
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
		checkRow(this);
	}
	else 
	{
		uncheckRow(this);
	}
});

//Check row when clicked.
function checkRow(row)
{
	$(row).children().children(".ckbx").prop("checked", true);
	createNameBoxHtml(row);
}

//Uncheck row and delete nameBox when clicked.
function uncheckRow(row)
{
	$(row).children().children(".ckbx").prop("checked", false);
	$('.nameBox#' + row.id).remove();
}

//Click row when checkbox is clicked.
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

//If all other checkboxes are checked/unchecked, check/uncheck selectAll checkbox.
function selectAllMatch()
{
	var sAll = $('#selAll');

	var visibleCheckboxes = $("input[name='contact']:visible");

	var visibleCheckboxesChecked = $("input[name='contact']:checked:visible");

	console.log("total: " + visibleCheckboxes.length + " checked: " + visibleCheckboxesChecked.length);

	if (visibleCheckboxes.length == visibleCheckboxesChecked.length) //Are all checkboxes checked?
	{
		sAll.prop('checked',true); 
	}
	else
	{
		sAll.prop('checked',false);
	}
};

//If row clicked or modified, re-evaluate selectAll.
$(document).on('click DOMSubtreeModified', '.contact-row', selectAllMatch);

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

		selectAllMatch();

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

//Filter according to theater/role selected.
$(document).on('click','.filter',function()
{
	//Show all rows.
	$('.contact-row').show();

	//Create array with unchecked filter values.
	var uncheckedFilters = $('.filter:not(:checked)');

	//For each of unchecked filters, grab the theatre/role it represents.
	for(i=0; i<uncheckedFilters.length; i++)
	{
		//Assign filters to a variable.
		var rowClassToFilter = uncheckedFilters[i].name;
		//Assign rows of class to an array.
		var rowsInClass = $('.' + rowClassToFilter);
		
		for(j=0; j<rowsInClass.length ;j++)
		{
			//Uncheck row (which also deletes namebox).
			uncheckRow(rowsInClass[j]);
		}

		//$('#selAll').prop('checked', false);
	
		//Hide row(s) in class.
		$('.' + rowClassToFilter).hide();
	}

	

});

