var re_encyr=/[^A-Za-z0-9_А-я]/
var re_en=/[^A-Za-z0-9_]/
var re_int=/[^0-9\-\+]/
var re_num=/[^0-9]/
var re_bstat=/[^0-9А-я]/
var re_pint=/[^0-9]/
var re_ppint=/[^0-9%]/
var re_float=/[^0-9\-\+\.]/
var re_pfloat=/[^0-9\.]/
var re_hex=/[^0-9A-Fa-f\#]/
var re_email=/[^A-Za-z0-9_\@\.\-]/
var re_url=/[^A-Za-z0-9_\:\~\%\#\&\=\+\?\.\/]/
var re_n_encyr=/[^A-Za-zА-я\x20\-]/
var re_n_en=/[^A-Za-z\x20\-]/
var re_phone=/[^0-9\x20\+\-\/\(\)]/
var re_addr=/[^A-Za-z0-9А-я\-\"\'\x20\.\,]/
var re_date=/[^0-9\-\.\/\\]/
var re_hour=/[^0-9\:\.]/

function trim(inString)
{
  var retVal = "";
  if (inString!="")
  {
    var start = 0;
    while ((start < inString.length) && (inString.charAt(start) == ' '))
    {
      ++start;
    }
    var end = inString.length;
    while ((end > 0) && (inString.charAt(end - 1) == ' '))
    {
      --end;
    }
    if (start>end) retVal='';
    else retVal = inString.substring(start, end);
  }
  return retVal;
}

function trimf(obj) { obj.value=trim(obj.value); }

function check_re(str, re){ var res=true; var r=str.search(re); if (r!=-1) res=false; return res; }
function is_encyr(str){ var res=true; res=check_re(str, re_encyr); return res; }
function is_en(str){ var res=true; res=check_re(str, re_en); return res; }
function is_int(str){ var res=true; res=check_re(str, re_int); return res; }
function is_num(str){ var res=true; res=check_re(str, re_num); return res; }
function is_bstat(str){ var res=true; res=check_re(str, re_bstat); return res; }
function is_pint(str){ var res=true; res=check_re(str, re_pint); return res; }
function is_float(str){ var res=true; res=check_re(str, re_float); return res; }
function is_pfloat(str){ var res=true; res=check_re(str, re_pfloat); return res; }
function is_hex(str){ var res=true; res=check_re(str, re_hex); return res; }
function is_email(str){ var res=true; res=check_re(str, re_email); return res; }
function is_url(str){ var res=true; res=check_re(str, re_url); return res; }
function is_n_encyr(str){ var res=true; res=check_re(str, re_n_encyr); return res; }
function is_n_en(str){ var res=true; res=check_re(str, re_n_en); return res; }
function is_phone(str){ var res=true; res=check_re(str, re_phone); return res; }
function is_addr(str){ var res=true; res=check_re(str, re_addr); return res; }
function is_date(str){ var res=true; res=check_re(str, re_date); return res; }
function is_hour(str){ var res=true; res=check_re(str, re_hour); return res; }

function is_not_empty(str){ var res=true; if (trim(str)=='') res=false; return res; }
function is_empty(str){ var res=true; if (trim(str)!='') res=false; return res; }

function reqt(o){trimf(o);return(o.value=='')?false:true;} function reqs(o){return(o.selectedIndex==0)?false:true;}
function reqs(o){return(o.selectedIndex==0)?false:true;}
function reqms(o){return(o.selectedIndex==-1)?false:true;}
function reqmc(o){var res=false; if(o.length>1)for(var i=0;i<o.length;i++)if(o[i].checked)res=true;return res;}
