// Modal Window Models + Buttons

  // Variables
  var modalWindowModels={};
  var modalWindowButtons={};
  
  // Functions
  
  function popupAlert(msg)
  {
    openModalWin(modalWindowModels['alert'].modify({'content':msg}));
  }

  function popupError(msg)
  {
    openModalWin(modalWindowModels['error'].modify({'content':msg}));
  }

  function popupConfirm(msg, obj)
  {
    var data={};
    if ($.type(obj)==="object" && obj.href)
    {
      data['href']=obj.href;
    }
    else if ($.type(obj)==="string" && document.forms[obj])
    {
      data['form']=obj;
    }
    openModalWin(modalWindowModels['confirm'].modify({'content':msg,'buttons':[ modalWindowButtons['OK_CONF'].modify({'data':data}),  modalWindowButtons['CANCEL_CONF'] ]}));
    return false;
  }

  function confirmOKClickHandler(data)
  {
    closeModalWin();
    if (data.href && data.href!='') document.location=data.href;
    if (data.form && data.form!='' && document.forms[data.form]) document.forms[data.form].submit();
  }

  function confirmCancelClickHandler()
  {
    closeModalWin();
  }

  // Classes

  function propertyList(properties)
  { //dummy object with 'modify' method
    
    // set initial properties
    for(var p in properties) this[p]=properties[p];
    
    // methods
    this.modify=plModify;
    
    // methods (functions)
    function plModify(modified)
    { // add/modify properties
      for(var m in modified) this[m]=modified[m];
      return this;
    }
  }
  
  // Buttons
  
  modalWindowButtons['OK_CONF']=new propertyList({
    'caption':        'OK',
    'class':          'mw-button-green',
    'clickHandler':   'confirmOKClickHandler'
  });

  modalWindowButtons['CANCEL_CONF']=new propertyList({
    'caption':        'Cancel',
    'class':          'mw-button-red',
    'clickHandler':   'confirmCancelClickHandler'
  });
  
  modalWindowButtons['OK']=new propertyList({
    'caption':        'OK',
    'clickHandler':   'closeModalWin'
  });

  modalWindowButtons['CANCEL']=new propertyList({
    'caption':        'Cancel',
    'clickHandler':   'closeModalWin'
  });
  
  modalWindowButtons['CLOSE']=new propertyList({
    'caption':        'Close',
    'clickHandler':   'closeModalWin'
  });
  
  modalWindowButtons['CLOSE_RED']=new propertyList({
    'caption':        'Close',
    'class':          'mw-button-red',
    'clickHandler':   'closeModalWin'
  });
  
  // Modal Window Models

  // 'alert'
  modalWindowModels['alert']=new propertyList({
    'caption':'Warning',
    'buttons':[
      modalWindowButtons['CLOSE'],
    ]  
  });
  
  // 'alert'
  modalWindowModels['error']=new propertyList({
    'caption':'Error',
    'captionClass':'mw-caption-error',
    'buttons':[
      modalWindowButtons['CLOSE_RED'],
    ]  
  });
  
  // 'confirm'
  modalWindowModels['confirm']=new propertyList({
    'caption':'Please confirm?',
/*    
    'buttons':[
      modalWindowButtons['OK_CONF'],
      modalWindowButtons['CANCEL_CONF']
    ]
*/    
  });
  
  