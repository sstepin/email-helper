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
                console.log(data);
				processData(data);
			}
        });
});

/*test*/
function popup() 
{
    'use strict';
    alert("Hello World");
}

function processData(userData)
{	
	/*$("input[name='contact']").text(value="hw");*/
	/*$("input:checkbox").text("hw");*/
	

	
}

$(document).on('click','#selAll', function() 
{
	'use strict';

	/*	alert("The paragraph was clicked.");*/

    var sAll = document.getElementById('selAll');
	
	/*	alert(sAll);*/
    
	var checkboxes = document.getElementsByName('contact');
    for (var i=0; i<checkboxes.length;i++) 
	{
        checkboxes[i].checked = sAll.checked;
	}
	

});


/*});*/


$(document).on('click','#contactContainer',function()
{
	
	var sAll = document.getElementById('selAll');
	var checkboxes = document.getElementsByName('contact');
	var ckBoxesChecked=$("input[name='contact']:checked");
	/*alert(checkboxes.length + " , " + ckBoxesChecked.length);*/
	if(checkboxes.length == ckBoxesChecked.length)
	{
		sAll.checked = true;
	}
	else
	{
		sAll.checked = false;
	}
	
});

