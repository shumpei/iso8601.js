;
var iso8601 = (function() {
    function zeroPad(num, pad){
	if(!pad)
	    pad = 2;
	var str = num.toString();
	while(str.length < pad)
	    str = '0' + str;
	return str;
    }
    return {
	//Initially inspired by Paul Sowden <http://delete.me.uk/2005/03/iso8601.html>
	PATTERN:  /^(?:(\d\d\d\d)-(W(0[1-9]|[1-4]\d|5[0-2])|(0\d|1[0-2])(-(0\d|[1-2]\d|3[0-1])(T(0\d|1\d|2[0-4]):([0-5]\d)(:([0-5]\d)(\.(\d+))?)?(Z)?)?)?)|(0\d|1\d|2[0-4]):([0-5]\d)(:([0-5]\d)(\.(\d+))?)?)$/,
	
	validate: function(value, type){ //returns RegExp matches
	    var isValid = false;
	    var d = this.PATTERN.exec(value); //var d = string.match(new RegExp(regexp));
	    if(!d || !type)
		return d;
	    type = type.toLowerCase();
	    if(type == 'week') // a week date
		isValid = (d[2].toString().indexOf('W') === 0); //valid if W present
	    else if(type == 'time') // a time date
		isValid = !!d[15];
	    else if(type == 'month')
		isValid = !d[5];
	    else { //a date related value
		//Verify that the number of days in the month are valid
		if(d[6]){
		    var date = new Date(d[1], d[4]-1, d[6]);
		    if(date.getMonth() != d[4]-1)
			isValid = false;
		    else switch(type){
		    case 'date':
			isValid = (d[4] && !d[7]); //valid if day of month supplied and time field not present
			break;
		    case 'datetime':
			isValid = !!d[14]; //valid if Z present
			break;
		    case 'datetime-local':
			isValid = (d[7] && !d[14]); //valid if time present and Z not provided
			break;
		    }
		}
	    }
	    return isValid ? d : null;
	},
	parse: function(str, type) {
	    var d = this.validate(str, type);
	    if(!d)
		return null;
	    var date = new Date(0);
	    var _timePos = 8;
	    if(d[15]){ //Time
		if(type && type != 'time') // a time date
		    return null;
		_timePos = 15;
	    }
	    else {
		date.setUTCFullYear(d[1]);
		
		//ISO8601 Week
		if(d[3]){
		    if(type && type != 'week')
			return null;
		    date.setUTCDate(date.getUTCDate() + ((8 - date.getUTCDay()) % 7) + (d[3]-1)*7); //set week day and week
		    return date;
		}
		//Other date-related types
		else {
		    date.setUTCMonth(d[4] - 1); //Month must be supplied for WF2
		    if(d[6])
			date.setUTCDate(d[6]);
		}
	    }
	    //Set time-related fields
	    if(d[_timePos+0]) date.setUTCHours(d[_timePos+0]);
	    if(d[_timePos+1]) date.setUTCMinutes(d[_timePos+1]);
	    if(d[_timePos+2]) date.setUTCSeconds(d[_timePos+3]);
	    if(d[_timePos+4]) date.setUTCMilliseconds(Math.round(Number(d[_timePos+4]) * 1000));

	    //Set to local time if date given, hours present and no 'Z' provided
	    if(d[4] && d[_timePos+0] && !d[_timePos+6])
		date.setUTCMinutes(date.getUTCMinutes()+date.getTimezoneOffset());

	    return date;
	},
	format: function(date, type){
	    type = String(type).toLowerCase();
	    var ms = '';
	    if(date.getUTCMilliseconds())
		ms = '.' + zeroPad(date.getUTCMilliseconds(), 3).replace(/0+$/,'');
	    switch(type){
	    case 'date':
		return date.getUTCFullYear() + '-' + zeroPad(date.getUTCMonth()+1) + '-' + zeroPad(date.getUTCDate());
	    case 'datetime-local':
		return date.getFullYear() + '-' + zeroPad(date.getMonth()+1) + '-' + zeroPad(date.getDate()) + 
		    'T' + zeroPad(date.getHours()) + ':' + zeroPad(date.getMinutes()) + ':' + zeroPad(date.getMinutes()) + ms + 'Z';
	    case 'month':
		return date.getUTCFullYear() + '-' + zeroPad(date.getUTCMonth()+1);
	    case 'week':
		var week1 = this.parse(date.getUTCFullYear() + '-W01');
		return date.getUTCFullYear() + '-W' + zeroPad(((date.valueOf() - week1.valueOf()) / (7*24*60*60*1000)) + 1);
	    case 'time':
		return zeroPad(date.getUTCHours()) + ':' + zeroPad(date.getUTCMinutes()) + ':' + zeroPad(date.getUTCMinutes()) + ms;
	    case 'datetime':
	    default:
		return date.getUTCFullYear() + '-' + zeroPad(date.getUTCMonth()+1) + '-' + zeroPad(date.getUTCDate()) + 
		    'T' + zeroPad(date.getUTCHours()) + ':' + zeroPad(date.getUTCMinutes()) + ':' + zeroPad(date.getUTCMinutes()) + ms + 'Z';
	    }
	}
    };
})();
