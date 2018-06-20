export function elapsedTime(date_start, date_end) {
        
    var diff = (date_end.getTime() - date_start.getTime())/1000;
    diff = Math.abs(Math.floor(diff));
    
    var years = Math.floor(diff/(365*24*60*60));
    var leftSec = diff - years * 365*24*60*60;
    
    var month = Math.floor(leftSec/((365/12)*24*60*60));
    leftSec = leftSec - month * (365/12)*24*60*60;    
    
    var days = Math.floor(leftSec/(24*60*60));
    leftSec = leftSec - days * 24*60*60;
    
    var hrs = Math.floor(leftSec/(60*60));
    leftSec = leftSec - hrs * 60*60;
    
    var min = Math.floor(leftSec/(60));
    leftSec = leftSec - min * 60;
    
    return days + " days " + hrs.toLocaleString(undefined, {minimumIntegerDigits: 2}) + ":" + min.toLocaleString(undefined, {minimumIntegerDigits: 2})  + ":" + leftSec.toLocaleString(undefined, {minimumIntegerDigits: 2}) ;
        
}