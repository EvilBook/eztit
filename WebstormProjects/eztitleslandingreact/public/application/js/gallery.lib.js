/* Image Gallery Library */

// --- variables

  var galleryWrapperClass='ig-wrapper';
  var galleriesPaused=false;
  var galleriesHooked=false;
  var imageGalleries=new Array();
  var imageGalleriesIndex='';
  var imageGalleriesDelay=2500;
  var popupWindowBorder=20;
  var popupWindowFooter=20;
  var popupCoverOpened=false;
  var popupWindowOpened=false;
  var imageGalleryOpened='';
  
// --- imageGallery class

  function imageGallery(properties)
  { // Constructor
    // init properties
    this.varName='';
    this.caption='';
    this.thumbDir='';
    this.imageDir='';
    this.images=new Array();
    this.current=0;
    this.expanded=0;
    this.count=0;
    this.delay=imageGalleriesDelay;
    this.delayMultiplier=2;
    this.tickValue=0;
    this.tickStep=100;
    this.mouseOverPause=true;
    this.paused=false;
    this.image=null;
    // set properties
    for (var p in properties) this[p]=properties[p];
    // methods
    this.add=imageGalleryAdd;
    this.prev=imageGalleryPrev;
    this.next=imageGalleryNext;
    this.show=imageGalleryShow;
    this.start=imageGalleryStart;
    this.tick=imageGalleryTick;
    this.pause=imageGalleryPause;
    this.resume=imageGalleryResume;
    this.navigation=imageGalleryNavigation;
    this.load=imageGalleryLoadImage;
    this.preload=imageGalleryPreloadImage;
    this.expand=imageGalleryExpand;
    this.init=imageGalleryInit;
    // 'private' methods :)
    
    // do initialisation
    this.init();
  }
  
  function imageGalleryAdd(img)
  { // Adds image to the gallery
    var srcFile=$.trim($(img).attr('src'));
    var caption=$.trim($(img).attr('alt'));
    var name='';
    if (srcFile!='')
    { // find image name
      var slash=srcFile.lastIndexOf('/');
      if (slash==-1) name=srcFile;
      else name=srcFile.substr(slash+1);
    }
    if (name!='')
    { // filename exists, add to image list
      this.images[this.count]={'filename':name, 'caption':caption};
      this.count++;
    }
  }
  
  function imageGalleryPrev()
  { // Show previous gallery image
    var i=this.current-1;
    if (i<0) i=this.count-1;
    this.show(i, 1);
  }

  function imageGalleryNext()
  { // Show next gallery image
    var i=this.current+1;
    if (i>=this.count) i=0;
    this.show(i, 1);
  }

  function imageGalleryShow(idx)
  { // Show specified gallery image (0=first)
    this.tickValue=(!arguments[1])?parseInt(this.delay*this.delayMultiplier, 10):this.tickValue=this.delay;
    if (this.current!=idx)
    {
      $('#'+this.varName+'-'+this.current).fadeOut();
      this.current=idx;
      $('#'+this.varName+'-'+this.current).fadeIn();
    }
  }
  
  function imageGalleryStart()
  { // Start gallery rotation
    this.tickValue=this.delay;
    this.tick();
  }

  function imageGalleryTick()
  { // Do a tick
    if (!this.paused && !galleriesPaused) this.tickValue=this.tickValue-this.tickStep;
    setTimeout('imageGalleries[\''+this.varName+'\'].tick()', this.tickStep);
    if (this.tickValue<=0)
    {
      this.tickValue=this.delay;
      this.next();
    }
  }
  
  function imageGalleryPause()
  { // Pause the rotation
    this.paused=true;
  }

  function imageGalleryResume()
  { // Resume paused rotation
    this.paused=false;
  }

  function imageGalleryNavigation()
  { // Prepares HTML code for the navigation inside the gallery
    var nav='';
    if (this.count>1)
    {
      var prev=this.expanded-1;
      var next=this.expanded+1;
      if (prev<0) prev=this.count-1;
      if (next>=this.count) next=0;
      nav+='<a class="ig-prev" href="javascript:imageGalleries[\''+this.varName+'\'].load('+prev+')" onFocus="blur()"></a>';
      nav+='<div class="ig-counter"><b>'+(this.expanded+1)+'&nbsp;/&nbsp;'+this.count+'</b></div>';
      nav+='<a class="ig-next" href="javascript:imageGalleries[\''+this.varName+'\'].load('+next+')" onFocus="blur()"></a>';
    }  
    var caption=((this.caption)?'<b>'+this.caption+'</b>':'');
    var imageCaption=((this.images[this.expanded].caption)?this.images[this.expanded].caption:'');
    if (caption=='' && imageCaption!='') imageCaption='<b>'+imageCaption+'</b>';
    caption=caption+((caption!='' && imageCaption!='')?'&nbsp;|&nbsp;':'')+imageCaption;
    if (caption!='') nav+='<div class="ig-caption"'+((nav=='')?'':' style="margin-left: 20px;"')+'>'+caption+'</div>';
    nav+='<a class="ig-close" href="javascript:galleryPopupClose()" onFocus="blur()"></a>';
    $('#ig-display-navigation').html(nav);
    return nav;
  }

  function imageGalleryPreloadImage(idx)
  { // preloads specific image
    if (idx>=0 && idx<this.count)
    {
      var img=new Image();
      img.src=this.imageDir+this.images[idx].filename;
    }  
  }

  function imageGalleryLoadImage(idx)
  { // loads specific image
    var gallery=this;
    if (idx>=0 && idx<this.count)
    {
      $('#ig-display-navigation').hide();
      this.expanded=idx;
      var img=new Image();
      $(img).bind('load', function (e)
      {
        $('#gallery-loader').hide();
        galleryPopupOpen(gallery.varName);
        gallery.image=e.currentTarget;
        // get new dimensions/coordinates for image display layer based on dimensions of loaded image
        var properties=popupWindowDisplaySize(gallery.image.width, gallery.image.height);
        // inject HTML of a new image
        popupWindowInject('#ig-display-inside', '<img src="'+gallery.image.src+'" width="'+gallery.image.width+'" height="'+gallery.image.height+'" border="0">');
        // animate image display layer to new dimensions/coordinates and fade in new image
        popupImageAnimateTo(properties);
        gallery.navigation();
      });
      // load new image
      img.src=this.imageDir+this.images[idx].filename;
    }
  }

  function imageGalleryExpand()
  { // Expands specified gallery image (0=first)
    // create image object and bind load handler to it
    var sTop=document.body.scrollTop;
    var sLeft=document.body.scrollLeft;
    $('#gallery-loader').css({'top':sTop, 'left':sLeft});
    $('#gallery-loader').show();
    this.load(this.current);
    if (this.count>1)
    {
      var prev=this.expanded-1;
      var next=this.expanded+1;
      if (prev<0) prev=this.count-1;
      if (next>=this.count) next=0;
      this.preload(prev);
      this.preload(next);
    }  
  }

  function imageGalleryInit()
  { // Init the gallery object
    var gallery=this;
    $('.'+gallery.selector).each(function(){
      gallery.add($(this))
    });
    this.start();
  }

// --- galleries related functions

  function pauseGalleries()
  { // Pause galleries image rotating
    galleriesPaused=true;
  }
  
  function resumeGalleries()
  { // Pesume galleries image rotating
    galleriesPaused=false;
  }
  
  function galleryPopupOpen(gallery)
  { // Opens popups if not opened
    if (!popupCoverOpened)
    {
      imageGalleryOpened=gallery;
      // pause galleries rotation
      pauseGalleries();
      // show cover layer
      popupCoverDisplay(true);
      // set small initial image display layer size
      popupWindowDisplaySize(100, 100-popupWindowFooter, '#ig-display');
      // show image display layer
      popupImageDisplay(true);
    }
  }
  
  function galleryPopupClose()
  { // Closes popups if opened
    if (popupCoverOpened)
    {
      imageGalleryOpened='';
      // hide image display layer
      popupImageDisplay(false);
      // hide cover layer
      popupCoverDisplay(false);
      // resume galleries rotation
      resumeGalleries();
    }
  }
  
  function popupImageDisplay(state)
  { // show/hide image display layer
    if (state)
    {
      $('#ig-display').show();
      $('#ig-display').fadeIn('fast');
    }
    else
    {
      $('#ig-display-navigation').hide();
      $('#ig-display').hide();
      popupWindowInject('#ig-display-inside', '');
    } 
  }

  function popupImageAnimateTo(properties)
  { // animates image display to new properties
    $('#ig-display').animate(properties, 'fast', '', function(){
        $('#ig-display-inside').fadeIn('fast');
        $('#ig-display-navigation').show();
      });
  }

  function popupImageResizeAdjust()
  { // adjust popup position in case of resize event
    if (popupCoverOpened && imageGalleryOpened!='' && imageGalleries[imageGalleryOpened] && imageGalleries[imageGalleryOpened].image)
    {
      var properties=popupWindowDisplaySize(imageGalleries[imageGalleryOpened].image.width, imageGalleries[imageGalleryOpened].image.height)
      popupImageAnimateTo(properties);
    }
  }

// --- popup window related functions

  function popupWindowOpen()
  { // opens a popup window with an initial size
    if (!popupCoverOpened)
    {
      popupCoverDisplay(true);
      popupWindowDisplay(true);
      popupWindowDisplaySize(100, 100-popupWindowFooter, '#popup-display');
    }
  }
  
  function popupWindowClose()
  { // closes a popup window
    if (popupCoverOpened)
    {
      popupCoverDisplay(false);
      popupWindowDisplay(false);
    }
  }

  function popupLoadContent(code)
  { // loads a content in a popup window
    // open the popup window
    var caption=(arguments.length>1)?arguments[1]:'';
    popupWindowOpen();
    // place content in a far-away container in order to test its dimensions
    $('#popup-far-away').html(code);
    // hide popup navigation
    $('#popup-display-navigation').hide();
    // prepare new navigation
    var nav='<a class="ig-close" href="javascript:popupWindowClose()" onFocus="blur()"></a>';
    if (caption!='') nav='<div class="ig-caption"><b>'+caption+'</b></div>'+nav;
    nav='<div id="ig-display-navigation">'+nav+'</div>';
    $('#popup-display-navigation').html(nav);
    // get far-away container dimensions
    var content=popupGetContentDimensions();
    // get new dimensions/coordinates for popup display layer based on dimensions of loaded content
    var properties=popupWindowDisplaySize(content.width, content.height);
    // inject HTML of a new image
    popupWindowInject('#popup-display-inside', code);
    // animate popup display layer to new dimensions/coordinates and fade in new content
    popupWindowAnimateTo(properties);
  }

  function popupGetContentDimensions()
  { // get dimensions ot a content stored in a 'temp' container in order to set dimensions of a popup window
    var dims=new Object();
    dims.width=$('#popup-far-away').innerWidth();
    dims.height=$('#popup-far-away').innerHeight();
    return dims;
  }

  function popupWindowInject(divname, code)
  { // change HTML code for popup window
    $(divname).fadeOut('fast', function(){
      $(divname).html(code);
    });  
  }

  function popupWindowDisplay(state)
  { // show/hide popup window
    if (state)
    {
      $('#popup-display').show();
      $('#popup-display').fadeIn('fast');
      popupWindowOpened=true;
    }
    else
    {
      $('#popup-display').hide();
      popupWindowOpened=false;
      popupWindowInject('#popup-display-inside', '');
    } 
  }

  function popupWindowDisplaySize(width, height)
  { // set or return dimensions and coordinates for popup window layer based on specified dimensions
    var setTo=(arguments.length==3 && arguments[2])?arguments[2]:'';
    var sWidth=$(window).width();
    var sHeight=$(window).height();
    var sTop=document.body.scrollTop;
    var sLeft=document.body.scrollLeft;
    var dWidth=width+(2*popupWindowBorder);
    var dHeight=height+(2*popupWindowBorder)+popupWindowFooter;
    var dTop=Math.round((sHeight/2)-(dHeight/2)+sTop);
    var dLeft=Math.round((sWidth/2)-(dWidth/2)+sLeft);
    if (dTop<0) dTop=0;
    if (dLeft<0) dLeft=0;
    var properties={'width': dWidth, 'height': dHeight, 'top': dTop, 'left': dLeft};
    if (setTo!='')
      $(setTo).css(properties);
    else
      return properties;
  }

  function popupWindowAnimateTo(properties)
  { // animates popup window to new properties
    $('#popup-display').animate(properties, 'fast', function(){
        $('#popup-display-inside').fadeIn('fast');
        $('#popup-display-navigation').show();
      });
  }

  function popupWindowResizeAdjust()
  { // adjust popup position in case of resize event
    if (popupCoverOpened && popupWindowOpened)
    {
      var popupW=$('#popup-display-inside').innerWidth();
      var popupH=$('#popup-display-inside').innerHeight();
      var properties=popupWindowDisplaySize(popupW, popupH)
      popupWindowAnimateTo(properties);
    }
  }


// --- cover layer related functions

  function popupCoverResize()
  { // resizes cover div as necessary
    // handle IE resize bug with two-phase resize
    if (arguments.length==0)
    { // first phase
      $('#popup-cover-layer').css('width', $(window).width());
      setTimeout('popupCoverResize(true)', 10);
    }
    else
    { // second phase
      $('#popup-cover-layer').css('width', document.body.scrollWidth);
      $('#popup-cover-layer').css('height', $(document).height());
    }
  }

  function popupCoverDisplay(state)
  { // show/hide cover div
    popupCoverResize();
    if (state)
    {
      $('#popup-cover-layer').fadeTo('fast', 0.7);
      popupCoverOpened=true;
    }
    else
    {
      popupCoverOpened=false;
      $('#popup-cover-layer').hide();
    }
  }
  
// --- startup function

  function gallerystartup()
  { // Galleries startup
    // cycle galleries
    $('.'+galleryWrapperClass).each(function()
    {
      imageGalleriesIndex=$(this).attr('id');
      var thumbDir=$(this).attr('thumbdir');
      var imageDir=$(this).attr('imagedir');
      var caption=$(this).attr('caption');
      // attach onClick handler to the wrapper div
      $(this).click(function(evt)
      {
        var gallery=$(evt.currentTarget).attr('id');
        imageGalleries[gallery].expand();
      });
      // create gallery object
      imageGalleries[imageGalleriesIndex]=new imageGallery({'varName':imageGalleriesIndex, 'caption':caption, 'thumbDir':thumbDir, 'imageDir':imageDir});
      if (imageGalleries[imageGalleriesIndex].mouseOverPause)
      { // add pause/resume handlers if there is such setting
        $(this).mouseenter(function(evt)
        {
          var gallery=$(evt.currentTarget).attr('id');
          imageGalleries[gallery].pause();
          var pH=$(evt.currentTarget).height();
          $(evt.currentTarget).children('.ig-pause').css('height', pH);
          $(evt.currentTarget).children('.ig-pause').fadeIn('fast');
        });
        $(this).mouseleave(function(evt)
        {
          var gallery=$(evt.currentTarget).attr('id');
          imageGalleries[gallery].resume();
          $(evt.currentTarget).children('.ig-pause').fadeOut('fast');
        });
      }
      $(this).children('div .ig-box').each(function()
      { // find images and add them to the gallery object
        $(this).attr('id', imageGalleriesIndex+'-'+imageGalleries[imageGalleriesIndex].count);
        $(this).children('img').each(function()
        {
          imageGalleries[imageGalleriesIndex].add($(this));
        });
      });
      // add 'pause' div (with icon) if there is more than 1 image
//      if (imageGalleries[imageGalleriesIndex].mouseOverPause && imageGalleries[imageGalleriesIndex].count>1) $(this).append('<div class="ig-pause"></div>');
      if (imageGalleries[imageGalleriesIndex].mouseOverPause) $(this).append('<div class="ig-pause"></div>');
    });
    if (imageGalleriesIndex!='')
    { // there is at least one gallery, hook pause/resume
      $(window).blur(pauseGalleries);
      $(window).focus(resumeGalleries);
    }
    // add cover, image display and popup display layers
    $('BODY').append('<div id="popup-cover-layer"></div>');
    $('BODY').append('<div id="ig-display"><div id="ig-display-navigation"></div><div id="ig-display-inside"></div></div>');
    $('BODY').append('<div id="popup-display"><div id="popup-display-navigation"></div><div id="popup-display-inside"></div></div><div id="popup-far-away"></div>');
    $('BODY').append('<div id="gallery-loader"></div>');
    // set CSS for cover, image display and popup display layers
    $('#popup-cover-layer').css({'position':'absolute', 'z-index':999998, 'top':'0px', 'left':'0px', 'width':'100%', 'height':'100%', 'display':'none', 'background-color':'#000000'});
    $('#ig-display').css({'position':'absolute', 'z-index':'999999', 'top':'0px', 'left':'0px', 'width':'100px', 'height':'100px', 'background-color':'#FFFFFF', 'border-radius':popupWindowBorder+'px', '-moz-border-radius':popupWindowBorder+'px', 'display':'none'});
    $('#ig-display-inside').css({'display':'none', 'margin':popupWindowBorder+'px', 'margin-top':'0px'});
    $('#ig-display-navigation').css({'display':'none', 'margin':Math.floor(popupWindowFooter/2)+'px '+popupWindowBorder+'px', 'height':popupWindowFooter+'px'});
    $('#popup-display').css({'position':'absolute', 'z-index':'999999', 'top':'0px', 'left':'0px', 'width':'100px', 'height':'100px', 'background-color':'#FFFFFF', 'border-radius':popupWindowBorder+'px', '-moz-border-radius':popupWindowBorder+'px', 'display':'none'});
    $('#popup-display-inside').css({'display':'none', 'margin': popupWindowBorder+'px', 'margin-top':'0px'});
    $('#popup-display-navigation').css({'display':'none', 'margin':Math.floor(popupWindowFooter/2)+'px '+popupWindowBorder+'px', 'height':popupWindowFooter+'px'});
    $('#popup-far-away').css({'display':'block', 'position':'absolute', 'top':-5000, 'left':-5000});
    $('#gallery-loader').css({'display':'none', 'position':'absolute', 'top':0, 'left':0, 'width':'100%', 'height':'100%', 'background':'transparent url("./application/i/ajax_loader.gif") no-repeat center center'}); 
    // bind resize handler
    $(window).resize(function()
    {
      popupCoverResize();
      popupImageResizeAdjust();
      popupWindowResizeAdjust();
    });
    // bind Esc key handler
    $(document).keydown(function(e){
      if (imageGalleryOpened && imageGalleries[imageGalleryOpened].count>1)
      {
        var last=imageGalleries[imageGalleryOpened].count-1;
        var prev=imageGalleries[imageGalleryOpened].expanded-1;
        var next=imageGalleries[imageGalleryOpened].expanded+1;
        if (prev<0) prev=last;
        if (next>=imageGalleries[imageGalleryOpened].count) next=0;
        if (e.keyCode==37) imageGalleries[imageGalleryOpened].load(prev);
        else if (e.keyCode==39) imageGalleries[imageGalleryOpened].load(next);
        else if (e.keyCode==36 && imageGalleries[imageGalleryOpened].expanded!=0) imageGalleries[imageGalleryOpened].load(0);
        else if (e.keyCode==35 && imageGalleries[imageGalleryOpened].expanded!=last) imageGalleries[imageGalleryOpened].load(last);
      }
      if (e.keyCode==27)
      {
        if (imageGalleryOpened!='') galleryPopupClose();
        if (popupWindowOpened) popupWindowClose();
      }
    });
  }

// --- startup

  $(document).ready(gallerystartup);

