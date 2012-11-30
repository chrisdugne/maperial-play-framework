// ----------------------------//
//	 Utils
// ----------------------------//

function getScript(src) {
   document.write('<' + 'script src="' + src + '"' + ' type="text/javascript"><' + '/script>');
}

/*
 * zeroPad(5, 2) 	--> "05"
   zeroPad(1234, 2) --> "1234"
 */
function zeroPad(num, places) 
{
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}

/*
 * now as YYYY-MM-DD
 */
function dateTime()
{
    var now = new Date();
    return now.getFullYear() + "-" 
    	 + zeroPad(now.getMonth()+1, 2) + "-" 
    	 + zeroPad(now.getDate(), 2);
}

/*
 * helpers for html encoding and decoding
 */
function htmlEncode(value){
	  return $('<div/>').text(value).html();
}

function htmlDecode(value){
	  return $('<div/>').html(value).text();
}


/*
 */
function rgb2hex(rgb)
{
	rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

	if(rgb == null)
		return "#ffffff";
	
	return "#" +
	("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	("0" + parseInt(rgb[3],10).toString(16)).slice(-2);
}