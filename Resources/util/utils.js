var boUtil = {};
	
boUtil.str = {};
boUtil.date = {};
	
// rPad string
boUtil.str.rPad = function( input_string, length, padding_character ) {
	var s = input_string;
	if(padding_character == null){
		padding_character = " ";
	};
	while(s.length < length){
		s += padding_character; 
	};
	return s;
};

// returns new row 
boUtil.str.newRow = function(count){
	var s = "";
	if(count == null){
		count = 1;
	};
	for (var i=0; i < count; i++) {
	  s += "\n";
	};
	return s;
};
	
	
boUtil.date.getCurrentDate = function () {
		
	var currentTime = new Date();
	var month = currentTime.getMonth();
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
 
	return day + "." + month + "." + year;
 
};

