// Modal Windows Interface Library
// jQuery is required


// Variables

var mwModalWindowManager;

// Classes

function modalWindowsManager()
{ // Modal Windows Manager
  var properties=(arguments.length>0)?arguments[0]:[]; 
  
  // properties
  this.windowStack=new Array();
  this.windowIndex=0;
  this.zGround=10000;
  this.container='modal-popup-container';
  this.mask='modal-popup-mask';
  this.windowPrefix='modal-popup-';
  this.buttonClass='mw-button';
  this.buttonContainerHeight=32;
  this.buttonUseLabels=false;
  this.maskContentHandler='';
  this.maskOpacity=0.5;
  this.maskFill='#000000';
  this.windowHandler='';
  
  // set passed properties
  for (var p in properties) this[p]=properties[p];

  // methods
  this.init=mwmInit;
  this.openMask=mwmOpenMask;
  this.closeMask=mwmCloseMask;
  this.openWindow=mwmOpenWindow;
  this.closeWindow=mwmCloseWindow;
  this.setDimensions=mwmSetDimensions;
  this.escCloseWindow=mwmEscCloseWindow;
  
  // 'fixed' properties
  this.defaultTop=''; 
  this.defaultLeft='';
  this.defaultWidth='';
  this.defaultHeight='';
  this.maskWidth=0;
  this.maskHeight=0;
  this.windowWidth=0;
  this.windowHeigth=0;
  this.maskVisible=false;
  
  // startup
  this.init();

  // methods (functions)
  
  function mwmInit()
  { // Modal Windows Manager initialisation
    // adding popup container and related classes
    $('BODY').append('<div id="'+this.container+'"></div>');
    $('#'+this.container).append('<div id="'+this.mask+'"></div>');
    $('#'+this.mask).css({'display': 'none', 'position': 'absolute', 'top': 0, 'left': 0});
    if (this.maskContentHandler!='' && window[this.maskContentHandler])
    { // call mask content handler if any
      $('#'+this.mask).html(window[this.maskContentHandler](this.mask));
    }
    else
    { // otherwise just fill mask with black
      $('#'+this.mask).css('background-color', this.maskFill);
    }
    // prepare click handler functionality for buttons
    $(document).on('click', '.'+this.buttonClass, '', function()
    {
      var win=$(this).attr('window');
      var index=$(this).attr('index');
      var button=mwModalWindowManager.windowStack[win].buttonList[index];
      if (button!=undefined)
      {
        button.click();
      }
    });
    
  }
  
  function mwmSetDimensions()
  { // Sets dimensions of mask and window widths/heights
    var dw=$(document).width();
    var ww=$(window).width();
    this.maskHeight=Math.max($(document).height(), $(window).height());
    this.maskWidth=(dw-ww>17)?Math.max(ww, dw):ww;
    this.windowWidth=$(window).width();
    this.windowHeight=$(window).height();
  }
  
  function mwmOpenMask()
  { // Opens mask
    if (!this.maskVisible)
    {
      this.setDimensions();
      $('#'+this.mask).css({'width': this.maskWidth, 'height': this.maskHeight, 'z-index': this.zGround+(this.windowIndex*10)+1, 'display': 'block', 'opacity':0});
      $('#'+this.mask).fadeTo('fast', this.maskOpacity);
      this.maskVisible=true;
    }
  }
  
  function mwmCloseMask()
  { // Closes mask
    if (this.maskVisible)
    {
      var m=this;
      $('#'+this.mask).fadeTo('fast', 0, function(){$('#'+m.mask).css('display', 'none')});
      this.maskVisible=false;
    }
  }
  
  function mwmOpenWindow()
  { // Opens modal window
    properties=(arguments.length>0)?arguments[0]:[]; 
    properties['windowsManager']=this;
    if (!properties.hasOwnProperty('top')) properties['top']=this.defaultTop; else if (properties['top']!='') properties['top']=parseInt(properties['top'], 10); 
    if (!properties.hasOwnProperty('left')) properties['left']=this.defaultLeft; else if (properties['left']!='') properties['left']=parseInt(properties['left'], 10);
    if (!properties.hasOwnProperty('width')) properties['width']=this.defaultWidth; else properties['width']=parseInt(properties['width'], 10);
    if (!properties.hasOwnProperty('height')) properties['height']=this.defaultHeight; else properties['height']=parseInt(properties['height'], 10);
    if (!properties.hasOwnProperty('windowHandler')) properties['windowHandler']=this.windowHandler;
    properties['name']=this.windowPrefix+this.windowIndex;
    properties['zIndex']=this.zGround+((this.windowIndex+1)*10);
    if (!this.maskVisible) this.openMask();
    $('#'+this.mask).css({'z-index': this.zGround+(this.windowIndex*10)+1});
    properties['index']=this.windowIndex;
    this.windowStack[this.windowIndex]=new modalWindow(properties);
    this.windowStack[this.windowIndex].open();
    this.windowIndex++;
  }
  
  function mwmCloseWindow()
  { // Closes modal window
    if (this.windowIndex>0)
    {
      // close top window and move/close mask if needed
      this.windowIndex--;
      this.windowStack[this.windowIndex].close();
      this.windowStack.pop();
      $('#'+this.mask).css({'z-index': this.zGround+((this.windowIndex-1)*10)+1});
      if (this.windowIndex==0) this.closeMask();
    }
  }

  function mwmEscCloseWindow()
  { // Tries to close window if it is set to close on ESC press
    if (this.windowIndex>0 && this.windowStack[this.windowIndex-1]['escClose']==true) this.closeWindow();
  }
  
}

function modalWindowButton()
{ // Modal Window Button class
  var properties=(arguments.length>0)?arguments[0]:[];
  
  this.caption='';
  this.class='';
  this.data={};
  this.clickHandler='';
  this.windowIndex='';
  this.index='';
  
  // set passed properties
  for (var p in properties) this[p]=properties[p];

  // methods
  this.output=mwbOutput;
  this.click=mwbClick;
  
  // methods (functions)
  function mwbOutput()
  { // prepares button output
    var cls=mwModalWindowManager.buttonClass+((this.class!='')?' '+this.class:'');
    var cap=mwModalWindowManager.buttonUseLabels?appLabel(this.caption):this.caption;
    var output='<input type="button" class="'+cls+'" value="'+cap+'" window="'+this.windowIndex+'" index="'+this.index+'">';
    return output;
  }
  
  function mwbClick()
  { // calls handler on click (if any)
    if (this.clickHandler!='' && window[this.clickHandler]!=undefined)
    {
//      console.log('Button "'+this.caption+'" clicked! Data:'+this.data);
      window[this.clickHandler](this.data);
    }
  }
  
}

function modalWindow()
{ // Modal Window class
  var properties=(arguments.length>0)?arguments[0]:[]; 
  
  // properties
  this.name='';
  this.index=-1;
  this.visible=false;
  this.top='';
  this.left='';
  this.width='';
  this.height='';
  this.class='modal-window';
  this.captionClass='mw-caption';
  this.containerClass='mw-content';
  this.buttonBlockClass='mw-btnblock';
  this.handler='';
  this.caption='';
  this.content='';
  this.container='';
  this.contentHandler=''; 
  this.windowHandler='';
  this.windowsManager='';
  this.bgColor='#FFFFFF';
  this.onOpen='';
  this.onClose='';
  this.escClose=true;
  this.buttons=[];
  this.buttonSeparator='&nbsp;';
  this.buttonContent='';

  // set passed properties
  for (var p in properties) this[p]=properties[p];

  // set some properties
  if (this.container=='') this.container=this.name;
  this.buttonList=[];
  
  // methods
  this.open=mwOpen;
  this.close=mwClose;
  this.setPosition=mwSetPosition;
  this.addButton=mwAddButton;
  
  // methods (functions)
  function mwOpen()
  { // Opens a window
    if (this.windowsManager!='')
    {
      this.buttonContent='';
      var b;
      if (this.buttons.length>0)
      { // there are buttons
        for(b in this.buttons) this.addButton(this.buttons[b]);
      }
      if (this.buttonList.length>0)
      { // there are buttons
        for (b in this.buttonList)
        {
          if (this.buttonContent!='') this.buttonContent+=this.buttonSeparator;
          this.buttonContent+=this.buttonList[b].output();
        }
        this.buttonContent=this.buttonSeparator+this.buttonContent+this.buttonSeparator;
      }
      if (window[this.onOpen]) window[this.onOpen](this);
      if (window[this.contentHandler]!='' && window[this.contentHandler]) this.content=window[this.contentHandler](this.content);
      if (this.windowHandler!='' && window[this.windowHandler])
      {
        window[this.windowHandler](this);
      }
      else
      {
        var props={
          'position':         'absolute',
          'display':          'block',
          'z-index':          this.zIndex,
          'background-color': this.bgColor,    
          'width':            (this.width!='' && this.width!=undefined && !isNaN(this.width))?this.width:'auto',
          'height':           (this.height!='' && this.height!=undefined && !isNaN(this.height))?this.height:'auto'
        };
        $('#'+this.windowsManager.container).append('<div id="'+this.name+'" class="'+this.class+'"><div id="'+this.name+'-caption'+'" class="'+this.captionClass+'">'+this.caption+'</div><div id="'+this.name+'-container'+'" class="'+this.containerClass+'">'+this.content+'</div><div class="'+this.buttonBlockClass+'" id="'+this.name+'-buttons'+'"><nobr>'+this.buttonContent+'</nobr></div></div>');
        $('#'+this.name).css(props);
        if (this.height=='' || this.height==undefined || isNaN(this.height))
          $('#'+this.name+'-buttons').css({'height':this.windowsManager.buttonContainerHeight, 'text-align':'center','display': 'block', 'z-index':1000});
        else
          $('#'+this.name+'-buttons').css({'position': 'absolute', 'left':0, 'bottom':0, 'right':0, 'height':this.windowsManager.buttonContainerHeight, 'text-align':'center','display': 'block', 'z-index':1000});
      }
      this.setPosition();
    }
  }
  
  function mwClose()
  { // Closes the window
    if (this.windowsManager!='')
    {
      if (window[this.onClose]) window[this.onClose](this);
      $('#'+this.name).remove();
    }  
  }
  
  function mwSetPosition()
  { // Sets window position
    var top=this.top;
    var left=this.left;
    var height=(this.height=='' || this.height==undefined || isNaN(this.height))?$('#'+this.name).outerHeight():this.height;
    var width=(this.width=='' || this.width==undefined || isNaN(this.width))?$('#'+this.name).outerWidth():this.width;
    if (this.top=='')
    { // calculate the position and center window vertically
      var sTop=$(window).scrollTop();
      top=Math.ceil(this.windowsManager.windowHeight/2)-Math.ceil(height/2);
      top+=sTop;
      if (top<sTop) top=sTop;
    }
    if (this.left=='')
    { // calculate the position and center window horizontally
      var sLeft=$(window).scrollLeft();
      left=Math.ceil(this.windowsManager.windowWidth/2)-Math.ceil(width/2);
      left+=sLeft;
      if (left<sLeft) left=sLeft;
    }
    $('#'+this.name).css({'top':top, 'left':left});
  }
  
  function mwAddButton(properties)
  { // adds a button to the modal window
    if (properties['caption']!=undefined)
    {
      properties['index']=this.buttonList.length;
      properties['windowIndex']=this.index;
      this.buttonList[this.buttonList.length]=new modalWindowButton(properties);
    }  
  }
  
}

// Functions 

function initModalWindowsManager()
{ // Creates manager 
  mwModalWindowManager=new modalWindowsManager();
  $(document).keydown(function(event)
  {
    if (event.keyCode==27) mwModalWindowManager.escCloseWindow();
  });
  $(window).scroll(setModalWindowsManagerScrollResize);
  $(window).resize(setModalWindowsManagerScrollResize);
}

function setModalWindowsManagerScrollResize()
{ // Handler of resize and scroll events 
  // recalculate dimensions and set mask properties if needed
  if (mwModalWindowManager.maskVisible) $('#'+mwModalWindowManager.mask).css('display', 'none');
  mwModalWindowManager.setDimensions();
  if (mwModalWindowManager.maskVisible) $('#'+mwModalWindowManager.mask).css({'width': mwModalWindowManager.maskWidth, 'height': mwModalWindowManager.maskHeight, 'display': 'block'});
  // recalculate windows positions
  for (var w in mwModalWindowManager.windowStack) mwModalWindowManager.windowStack[w].setPosition();
}

function openModalWin(win)
{ // Shortcut; opens modal window
  if (mwModalWindowManager==undefined) initModalWindowsManager();
  mwModalWindowManager.openWindow(win);
}

function closeModalWin()
{ // Shortcut; closes top modal window
  if (mwModalWindowManager!=undefined) mwModalWindowManager.closeWindow();
}
