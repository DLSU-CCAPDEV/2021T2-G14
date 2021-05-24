// Updates the scheduler based on what the user checks/unchecks
function changeSchedule(checkboxElem) {
	// console.log(checkboxElem);
	// Searching for ID in element
	var id = "L1" + checkboxElem.substring(1);
	console.log(id);
	var label = document.getElementById(id).innerHTML;
	var timeFrame = label.substring(label.length - 11, label.length);
	var low = parseInt(timeFrame.substring(0, 2));
	var high = parseInt(timeFrame.substring(6, 8));
	// console.log(label);
	if (timeFrame.substring(9, 11) == "00")
		high = high - 1;
	// Finding days
	var label_cnt = 8;
	var dates = [];
	do {
		var date_label = label.substring(label_cnt, label_cnt + 1);
		if (date_label != ' ')
			dates.push(date_label);
		label_cnt = label_cnt + 1;
	} while (date_label != ' ');
	var subjectName = label.substring(0, 7);
	// console.log(dates);
	// Filling up the schedule
	if (document.getElementById(checkboxElem).checked) {
		for (var i = low; i <= high; i++){
			for (var j = 0; j < dates.length; j++){
				var gridID = dates[j] + i;
				// console.log("add: " + gridID);
				var name = document.getElementById(gridID);
				name.innerHTML = name.innerHTML + " " + subjectName;
			}
		}
	}
	else {
		for (var i = low; i <= high; i++){
			for (var j = 0; j < dates.length; j++){
				var gridID = dates[j] + i;
				// console.log("remove: " + gridID);
				var name = document.getElementById(gridID);
				name.innerHTML = name.innerHTML.replace(subjectName, "");
			}
		}
	}
}

function addToClassList(){
	var addList = document.getElementsByName("add");
	console.log(addList);
	var checked = [];
	for (var i = 0; i < addList.length; i++)
		if (document.getElementById(addList[i].id).checked) 
        	checked.push(addList[i].id);
	console.log(checked);

	for (var i = 0; i < checked.length; i++){
		// Creating elements for the new classes
		var button = document.createElement('input')
		button.className = "form-check-input";
		button.type = "checkbox";
		button.id = 'M' + checked[i].substring(1, checked[i].length);
		button.name = 'include';
		button.addEventListener("change", callAdd, false);
		// Adding Checkboxes to Class List
		var classLabel = document.createElement('label')
		classLabel.className = 'form-check-label';
		classLabel.id = 'L1' + checked[i].substring(1, checked[i].length);
		var labelID = 'L2' + checked[i].substring(1, checked[i].length);
		console.log(labelID);
		classLabel.innerHTML = document.getElementById(labelID).innerHTML;
		// Assigning New Classes to Class List
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var li = document.createElement("li");
		var classList = document.getElementById("classList");
		div1.className = 'container p-0';	
		div2.className = 'form-check';
		li.className = 'list-group-item';
		li.id = 'LI1' + checked[i].substring(1, checked[i].length);
		classList.appendChild(li);
		li.appendChild(div2);
		div2.appendChild(div1);
		div1.appendChild(button);
		div1.appendChild(classLabel);
		// Adding classes to Delete
		var button = document.createElement('input')
		button.className = "form-check-input";
		button.type = "checkbox";
		button.name = 'delete';
		button.id = 'D' + checked[i].substring(1, checked[i].length);
		console.log(checked[i].substring(1, checked[i].length));
		console.log(button.id);
		// Adding Checkboxes to Class List
		var classLabel = document.createElement('label')
		classLabel.className = 'form-check-label';
		classLabel.id = 'L3' + checked[i].substring(1, checked[i].length);
		var labelID = 'L2' + checked[i].substring(1, checked[i].length);
		var newInnerHTML = document.getElementById(labelID).innerHTML;
		classLabel.innerHTML =  newInnerHTML;
		// Assigning New Classes to Class List
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var li = document.createElement("li");
		var classList = document.getElementById("delClassList");
		div1.className = 'container p-0';	
		div2.className = 'form-check';
		li.className = 'list-group-item';
		li.id = 'LI3' + checked[i].substring(1, checked[i].length);
		classList.appendChild(li);
		li.appendChild(div2);
		div2.appendChild(div1);
		div1.appendChild(button);
		div1.appendChild(classLabel);
		// Removing added classes from the Add List
		console.log(checked);
		console.log('LI2' + checked[i].substring(1, checked[i].length));
		var toRemove = document.getElementById('LI2' + checked[i].substring(1, checked[i].length)).remove();
	}
}

function cancelAdd(){
	var addList = document.getElementsByName("add");
	console.log(addList);
	var checked = [];
	for (var i = 0; i < addList.length; i++)
		if (document.getElementById(addList[i].id).checked) {
			var addListId = addList[i].id;
        	$("#"+addListId).prop('checked', false);
		}
}

function callAdd(){
	changeSchedule(this.id);
}

function deleteFromClassList(){
	var deleteList = document.getElementsByName("delete");
	console.log(deleteList);
	var checked = [];
	for (var i = 0; i < deleteList.length; i++)
		if (document.getElementById(deleteList[i].id).checked) 
        	checked.push(deleteList[i].id);
	console.log(checked);

	for (var i = 0; i < checked.length; i++){
		// Creating elements for the new classes
		var button = document.createElement('input')
		button.className = "form-check-input";
		button.type = "checkbox";
		button.id = 'A' + checked[i].substring(1, checked[i].length);
		button.name = 'add';
		// button.addEventListener("change", callAdd, false);
		// Adding Checkboxes to Add Class List
		var classLabel = document.createElement('label');
		classLabel.className = 'form-check-label';
		classLabel.id = 'L2' + checked[i].substring(1, checked[i].length);
		var labelID = 'L3' + checked[i].substring(1, checked[i].length);
		var newInnerHTML = document.getElementById(labelID).innerHTML;
		classLabel.innerHTML =  newInnerHTML;
		// Assigning New Classes to Class List
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var li = document.createElement("li");
		var classList = document.getElementById("addClassList");
		div1.className = 'container p-0';	
		div2.className = 'form-check';
		li.className = 'list-group-item';
		li.id = 'LI2' + checked[i].substring(1, checked[i].length);
		classList.appendChild(li);
		li.appendChild(div2);
		div2.appendChild(div1);
		div1.appendChild(button);
		div1.appendChild(classLabel);
		// Removing from Schedule
		var label = document.getElementById('L1' + checked[i].substring(1, checked[i].length)).innerHTML;
		var timeFrame = label.substring(label.length - 11, label.length);
		var low = parseInt(timeFrame.substring(0, 2));
		var high = parseInt(timeFrame.substring(6, 8));
		console.log(label);
		if (timeFrame.substring(9, 11) == "00")
			high = high - 1;
		// Finding days
		var label_cnt = 8;
		var dates = [];
		do {
			var date_label = label.substring(label_cnt, label_cnt + 1);
			if (date_label != ' ')
				dates.push(date_label);
			label_cnt = label_cnt + 1;
		} while (date_label != ' ');
		var subjectName = label.substring(0, 7);
		console.log(dates);
		for (var j = low; j <= high; j++){
			for (var k = 0; k < dates.length; k++){
				var gridID = dates[k] + j;
				console.log("remove: " + gridID);
				var name = document.getElementById(gridID);
				name.innerHTML = name.innerHTML.replace(subjectName, "");
			}
		}
		// Removing added classes from the Add List
		console.log('LI1' + checked[i].substring(1, checked[i].lengasdth));
		var toRemove = document.getElementById('LI1' + checked[i].substring(1, checked[i].length)).remove();
		var toRemove = document.getElementById('LI3' + checked[i].substring(1, checked[i].length)).remove();
	}
}

function cancelDelete(){
	var deleteList = document.getElementsByName("delete");
	// console.log(deleteList);
	var checked = [];
	for (var i = 0; i < deleteList.length; i++)
		if (document.getElementById(deleteList[i].id).checked) {
			var deleteId = deleteList[i].id;
        	$("#"+deleteId).prop('checked', false);
		}
}

function saveCanvas(){
	ToastyDownload();
    html2canvas(document.querySelector("#capture"),{scrollY: -window.scrollY}).then(canvas => {
      	var a = document.createElement('a');
      	a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        a.download = oldScheduleName + '.jpg';
        a.click();
      }
    );
}

$(document).ready(() => {
	var oldScheduleName = $("#scheduleName").val();

	var includeList = document.getElementsByName("include");
	console.log(includeList);
	var checked = [];
	for (var i = 0; i < includeList.length; i++)
		if (document.getElementById(includeList[i].id).checked) 
        	checked.push(includeList[i].id);
    console.log(checked);
    console.log(checked.length);
    for (var k = 0; k < checked.length; k++ ){
	    var id = "L1" + checked[k].substring(1);
		console.log(id);
		var label = document.getElementById(id).innerHTML;
		var timeFrame = label.substring(label.length - 11, label.length);
		var low = parseInt(timeFrame.substring(0, 2));
		var high = parseInt(timeFrame.substring(6, 8));
		if (timeFrame.substring(9, 11) == "00")
			high = high - 1;
		// Finding days
		var label_cnt = 8;
		var dates = [];
		do {
			var date_label = label.substring(label_cnt, label_cnt + 1);
			if (date_label != ' ')
				dates.push(date_label);
			label_cnt = label_cnt + 1;
		} while (date_label != ' ');
		var subjectName = label.substring(0, 7);
		// console.log(dates);
		// Filling up the schedule
		if (document.getElementById(checked[k]).checked) {
			for (var i = low; i <= high; i++){
				for (var j = 0; j < dates.length; j++){
					var gridID = dates[j] + i;
					// console.log("add: " + gridID);
					var name = document.getElementById(gridID);
					name.innerHTML = name.innerHTML + " " + subjectName;
				}
			}
		}
		else {
			for (var i = low; i <= high; i++){
				for (var j = 0; j < dates.length; j++){
					var gridID = dates[j] + i;
					// console.log("remove: " + gridID);
					var name = document.getElementById(gridID);
					name.innerHTML = name.innerHTML.replace(subjectName, "");
				}
			}
		}
    }

	// Timepicker 
	$('#startTime').timepicker({
	    timeFormat: 'HH:mm',
	    interval: 15,
	    minTime: '7:00',
	    maxTime: '22:00',
	    defaultTime: '12',
	    startTime: '7:00',
	    steps: 5,
	    use24hours: true,
	    dynamic: false,
	    dropdown: true,
	    scrollbar: true,
	    show2400: true
	});
	$('#endTime').timepicker({
	    timeFormat: 'HH:mm',
	    interval: 15,
	    minTime: '7:00',
	    maxTime: '22:00',
	    defaultTime: '12',
	    startTime: '7:00',
	    steps: 5,
	    use24hours: true,
	    dynamic: false,
	    dropdown: true,
	    scrollbar: true,
	    show2400: true
	});
	// Disable clicking outside modal
    $("#addClass").modal({
        backdrop: 'static',
        keyboard: false,
        show: true // added property here
    });
    $("#deleteClass").modal({
        backdrop: 'static',
        keyboard: false,
        show: true // added property here
    });
    $("#createClass").modal({
        backdrop: 'static',
        keyboard: false,
        show: true // added property here
    });
});

$('#scheduleName').blur(() => {
	if ($("#scheduleName").val().length > 0) {
		var newScheduleName = $("#scheduleName").val();
		var currentUser = $("#currentUser").html();
		console.log("Old: " + oldScheduleName);
		console.log("New: " + newScheduleName);
		if (newScheduleName != oldScheduleName){
			$.get("/getScheduleName", { scheduleName: newScheduleName,
			 username: currentUser},(result) => {
				if(result.schedName == newScheduleName) {
					console.log("Schedule name unavailable");
	                $('#scheduleName').css('background-color', 'red');
	                $('#saveSchedule').prop('disabled', true);
	                $('#errorClassName').text('Shedule name not available');
	            }
	            else {
	            	console.log("Schedule name available");
	                $.get("/updateScheduleName", { newScheduleName: newScheduleName,
			 		username: currentUser, oldScheduleName: oldScheduleName},(result) => {
			 			if (result){
			 				if (darkSwitch.checked)
					 			$('#scheduleName').css('background-color', '#1a1a1b');
					 		else 
					 			$('#scheduleName').css('background-color', '#fff');
		                	$('#saveSchedule').prop('disabled', false);
		                	oldScheduleName = $("#scheduleName").val();
		                	console.log("Just updated oldScheduleName to " + oldScheduleName);
		                	$('#errorClassName').text('');
			 			}
			 		});
	            }
	        });
		}
    }
    else if ($("#scheduleName").val().length == 0){
    	$('#scheduleName').css('background-color', 'red');
		$('#saveSchedule').prop('disabled', true);
    }
});


var classIdCnt = 1000 + $("#classCnt").val();;
// Checks and creates a custom class
$('#creatingClass').click(function () {
	var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var newScheduleName = $("#classCodeValue").val();
	var checked = "";
	for (var i = 0; i < days.length; i++)
		if (document.getElementById(days[i]).checked){
			if (days[i] == "Thursday")   
	        	checked = checked + "H";
	        else checked = checked + days[i].substring(0,1)
		}
	var startTime = $('#startTime').val();
    var endTime = $('#endTime').val();
    var startTimeH = $('#startTime').val().substring(0,2);
    var endTimeH = $('#endTime').val().substring(0,2);
    var startTimeM = $('#startTime').val().substring(3,5);
    var endTimeM = $('#endTime').val().substring(3,5);

    var fullName = "";
    $('#errorNewClass').text('');
    if (newScheduleName.length == 7 && checked.length > 0 && 
    	(endTimeH > startTimeH || endTimeH == startTimeH && endTimeM > startTimeM)){
		fullName = newScheduleName + " " + checked + " " + startTime + "-" + endTime;
		var button = document.createElement('input')
		button.className = "form-check-input";
		button.type = "checkbox";
		button.id = 'M' + classIdCnt;
		button.name = 'include';
		button.addEventListener("change", callAdd, false);
		// Adding Checkboxes to Class List
		var classLabel = document.createElement('label')
		classLabel.className = 'form-check-label';
		classLabel.id = 'L1' + classIdCnt;
		var labelID = 'L2' + classIdCnt;
		console.log(labelID);
		classLabel.innerHTML = fullName;
		// Assigning New Classes to Class List
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var li = document.createElement("li");
		var classList = document.getElementById("classList");
		div1.className = 'container p-0';	
		div2.className = 'form-check';
		li.className = 'list-group-item';
		li.id = 'LI1' + classIdCnt;
		classList.appendChild(li);
		li.appendChild(div2);
		div2.appendChild(div1);
		div1.appendChild(button);
		div1.appendChild(classLabel);
		// Adding classes to Delete
		var button = document.createElement('input')
		button.className = "form-check-input";
		button.type = "checkbox";
		button.name = 'delete';
		button.id = 'D' + classIdCnt;
		// Adding Checkboxes to Class List
		var classLabel = document.createElement('label')
		classLabel.className = 'form-check-label';
		classLabel.id = 'L3' + classIdCnt;
		var labelID = 'L2' + classIdCnt;
		classLabel.innerHTML =  fullName;
		// Assigning New Classes to Class List
		var div1 = document.createElement("div");
		var div2 = document.createElement("div");
		var li = document.createElement("li");
		var classList = document.getElementById("delClassList");
		div1.className = 'container p-0';	
		div2.className = 'form-check';
		li.className = 'list-group-item';
		li.id = 'LI3' + classIdCnt;
		classList.appendChild(li);
		li.appendChild(div2);
		div2.appendChild(div1);
		div1.appendChild(button);
		div1.appendChild(classLabel);
		$('#classCodeValue').val('');
		for (var i = 0; i < days.length; i++)
			if (document.getElementById(days[i]).checked){
				$("#"+days[i]).prop('checked', false);
			}
		$('#startTime').val('12:00');
	    $('#endTime').val('12:00');
	    classIdCnt = classIdCnt + 1;
	    $("#createClass").modal('hide');
    }
    else $('#errorNewClass').text(' One or more conditions was not met');
});
// Resets all fields in create modal
$('#cancelCreate').click(function () {
	$('#classCodeValue').val('');
	var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	for (var i = 0; i < days.length; i++)
		if (document.getElementById(days[i]).checked){
			$("#" + days[i]).prop('checked', false);
		}
	$('#startTime').val('12:00');
    $('#endTime').val('12:00');
    $('#errorNewClass').text('');
});

$('#saveSchedule').click(function () {
	var schedId = $("#schedId").html();
	var includeList = document.getElementsByName("include");
	console.log(includeList);
	var addList = document.getElementsByName("add");
	console.log(addList);
	var schedule = {};
	var classes = [];
	var classCnt = 0;
	schedule.schedId = schedId;
	for (var i = 0; i < includeList.length; i++){
		var classDetails = {};
		classDetails.category = "include";
		classDetails.classId = includeList[i].id.substring(1,5);
		classDetails.className = document.getElementById("L1" + 
		includeList[i].id.substring(1)).innerHTML;
		if (document.getElementById(includeList[i].id).checked)
			classDetails.checked = "checked";
		else classDetails.checked = "";
		classes.push(classDetails);
		classCnt += 1;
	}
	console.log("HELP");
	for (var j = 0; j < addList.length; j++, i++){
		var classDetails = {};
		classDetails.category = "add";
		classDetails.classId = addList[j].id.substring(1,5);
		classDetails.className = document.getElementById("L2" + 
		addList[j].id.substring(1)).innerHTML;
		if (document.getElementById(addList[j].id).checked)
			classDetails.checked = "checked";
		else classDetails.checked = "";
		classes.push(classDetails);
		classCnt += 1;
	}
	schedule.classes = classes;
	schedule.classCnt = classCnt;
	console.log(schedule);
	$.get("/saveSchedule", { schedule: schedule }, (result) => {
		if (result){
			ToastySave();
			console.log("Success saving into database");
		}
		else console.log("Failed saving into database")

    });
});

var option = {
	animation : true,
	delay : 10000
};

function ToastyDownload()
{
  var toastHTMLElement = document.getElementById( 'EpicToastDownload' );
  var toastElement = new bootstrap.Toast( toastHTMLElement, option );
  toastElement.show( );
}

function ToastySave()
{
  var toastHTMLElement = document.getElementById( 'EpicToastSave' );
  var toastElement = new bootstrap.Toast( toastHTMLElement, option );
  toastElement.show( );
}

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = 'It looks like you have been editing something. '
                            + 'If you leave before saving, your changes will be lost.';

    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage; //Gecko + Webkit, Safari, Chrome etc.
});