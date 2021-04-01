
// AJAX/JSON advanced functionality library

///
/// Requires jQuery
///

  // AJAX setup
  var ajaxSetupData={
    'cache':      'false',
    'dataType':   'json',
    'timeout':    15000,
    'success':    ajaxRequestSuccess,
    'error':      ajaxRequestError
  }

  // AJAX-related functions

  function initAjaxLib()
  { // startup initialisation
    $.ajaxSetup(ajaxSetupData);
  }

  function ajaxRequestSuccess(data, status, jqXHR)
  { // AJAX handler for successful requests
    var result;
    var received=(data)?data.length:0;
    var err=false;
    ajaxHideCover();
    if (!data) return false;
    if (received>0 && status=='success')
    {
      if ($.isArray(data))
      {      
        for (result=0; result<received; result++)
        {
          if ($.isArray(data[result]))
          {
            switch (data[result][0])
            {
              case 'E':
                          $('#'+data[result][1]).html(data[result][2]);
                          break;
              case 'V':
              case 'O':
                          window[data[result][1]]=data[result][2];
                          break;
              case 'P':
                          for (var p in data[result][2])
                          {
                            window[data[result][1]][p]=data[result][2][p];
                          }
                          break;
              case 'H':
                          window[data[result][1]](data[result][2]);
                          break;
              case 'F':
                          break;
              default:    err=true;          
            }
          }
          else err=true;
          if (!err)
          {
            if (data[result][3]!='') window[data[result][3]]();
          }
        }
      }
      else err=true;
    }
    else err=true;
  }
  
  function ajaxRequestError(jqXHR, status, error)
  { // AJAX handler for non-successful requests
    ajaxHideCover();
    logVar(error);
  }

  function ajaxProcessRequest(url, data)
  { // Sends process request to a server with passed parameters
    ajaxShowCover();
    $.ajax({
      'url':  url,
      'data': data
    });
  }

  function ajaxShowCover()
  { // Shows cover DIV and animated image on AJAX request
//    if (ajaxShowCoverFunc!="undefined") window[ajaxShowCoverFunc]();
  }

  function ajaxHideCover()
  { // Hides cover DIV and animated image after completing the AJAX request
//    if (ajaxHideCoverFunc!="undefined") window[ajaxHideCoverFunc]();
  }

  // Misc functions

  function logVar(variable)
  {
    if (!document.all) console.log(variable);
    else alert(variable);
  }
  
  // Startup

  $(document).ready(initAjaxLib);