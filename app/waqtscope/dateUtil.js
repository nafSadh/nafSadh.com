/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function isLeapYear(year){
    if(year%4>0) return false;
    if(year%100==0 && year%400!=0 ) return false;
    else return true;
}
function DateUtil(method) {
    var
    dayOfMonths = {
        1 : 31,
        2 : 28,
        3 : 31,
        4 : 30,
        5 : 31,
        6 : 30,
        7 : 31,
        8 : 31,
        9 : 30,
        10 : 31,
        11 : 30,
        12 : 31
    };
    MonthName = [
        ['Jan','January','জানু'],
        ['Feb','February','জানু'],
        ['Mar','March','জানু'],
        ['Apr','April','জানু'],
        ['May','May','জানু'],
        ['Jun','June','জানু'],
        ['Jul','July','জানু'],
        ['Aug','August','জানু'],
        ['Sep','Setember','জানু'],
        ['Oct','October','জানু'],
        ['Nov','November','জানু'],
        ['Dec','December','জানু']
    ]
    // PUBLIC FUNCTIONS
    return {
        nameOfMonth: function(month, type){
            var monthI = month-1;
            type = type || 0;
            return MonthName[monthI][type];
        },//nameOfMonth
        validateDate: function(date){
            if(date[0]==0 || date[1]<=0 || date[2]<=0) return false;
            var dayConstraint = dayOfMonths;
            if(isLeapYear(date[0]) == true) dayConstraint[2] =29;
            if( date[1] > 12 ) return false;//if month is out of range
            if( date[2] <= dayConstraint[date[1]]) return true;
            return false;
        },//validate date
        
        dateOfNextday: function(date){
            if(this.validateDate(date) == false) return false;
            var dayConstraint = dayOfMonths;
            dayConstraint[2] = (isLeapYear(date[0]) == true) ? 29 : 28 ;
            var nextDate = [date[0],date[1],date[2]];
           
            if( date[2] < dayConstraint[date[1]]) nextDate[2]=date[2]+1;
           
            if( date[2] == dayConstraint[date[1]]) {
                nextDate[2]=1;
                nextDate[1]=(date[1]%12)+1;
                if(date[1]==12)nextDate[0]=date[0]+1;
            }
            return nextDate;
        },//dateOfNextday
        
        dateOfPrevday: function(date){
            if(this.validateDate(date) == false) return false;
            var dayConstraint = dayOfMonths;
            dayConstraint[2] = (isLeapYear(date[0]) == true) ? 29 : 28 ;
            var prevDate = [date[0],date[1],date[2]];
           
            if( date[2] > 1) prevDate[2]=date[2]-1;
           
            if( date[2] == 1) {
                prevDate[1]=date[1]-1;//m
                if(prevDate[1]==0){
                    prevDate[0]=date[0]-1;//y
                    prevDate[1] = 12;
                }
                prevDate[2]=dayConstraint[prevDate[1]];
            }
            return prevDate;
        }//dateOfNextday

    }
}

var dateUtil = new DateUtil();