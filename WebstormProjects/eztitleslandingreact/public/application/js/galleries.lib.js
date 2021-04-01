/* Gallery+ Library */

var gallerySettings={
	'coverID':								'gallery-cover',  	///// cover
	'coverFade':							'fast',							///// cover

  'galleryOuterClass':			'',
  'galleryClass':						'gallery-wrapper',
	'imagesClass':						'gallery-image',
	'singleClass':						'single-image',
	'captionClass':						'gallery-caption',
	'pointerClass':						'gallery-pointer',
	'pointerItemClass':				'gallery-pointer-item',
	'galleryPrevClass':				'gallery-prev',
	'galleryNextClass':				'gallery-next',

	'galleryPrefix':					'image-gallery-',
	'imagePrefix':					  'image-gallery-image-',
	'captionPrefix':					'gallery-caption-',
	'pointerPrefix':					'gallery-pointer-',
	'pointerItemPrefix':			'gpi-',

	'showPointer':						true,
	'thumbFixedRatio':				4/3,
	'navigationOpacity':			0.1,
	'closeOnCoverClick':			false,		///// cover

	'galleryLoaderPrefix':		'image-gallery-loader-',
	'galleryLoader':					'/application/i/gallery-loader.gif',
	'galleryLoaderWidth':			16,
	'galleryLoaderHeight':		16,
	'gallerySingleWidth': 		320,

	'rotationFade':						'fast',
	'navigationFade':					'fast',
	'rotationDelay':					2500,
	'delayMultiplier':				2,
	
	'captionSeparator':				' | ',

	'expandedWidth':					0.95,    	// percentage of available width to use as expanded view width
	'expandedHeight':					0.95,			// percentage of available height to use as expanded view width
	'expandedMaxWidth':				1200,			// max width, if percentage is too big (in px)
	'expandedMaxHeight':	  	900,			// max height, if percentage is too big (in px)
	'expandedOuterID':	    	'gallery-expanded-outer',
	'expandedWrapperID':	  	'gallery-expanded-wrapper',
	'expandedLoaderID':	  		'gallery-expanded-loader',
	'expandedCaptionID':			'gallery-expanded-caption',
	'expandedImagePrefix':	  'gallery-expanded-image-',
	'expandedCloseControl':		'<i class="fa fa-close"></i>',
	'expandedCloseID':				'gallery-expanded-close',
};

var galleryVars={
	'windowWidth':						0,		// current visible width
	'windowHeight':						0,		// current visible height
	'scrollTop':							0,		// current scrollTop
	'scrollLeft':							0,		// current scrollLeft
	'currentImageWidth':			0,		// width of image, currently placed in expanded window
	'currentImageHeight':			0,		// height of image, currently placed in expanded window
	'expandedWidthAddon':			0,		// outer-inner width addon
	'expandedHeightAddon':		0,		// outer-inner height addon
	'expandedCaptionAddon':		0,		// caption line height addon
	'currentCaptionAddon':		0,		// caption height addon for currently expanded image
	'maxWindowWidth':					0,		// max possible outer width for the expanded window
	'maxWindowHeight':				0,		// max possible outer height for the expanded window
	'expandedWindowTop':			0,		// top coord of the opened window
	'expandedWindowLeft':			0,		// left coord of the opened window

	'expandedGallery':				''		// id of the currently expanded gallery
};

var galleryList={};

(function($){
    $.fn.disableSelection = function() {
        return this
                 .attr('unselectable', 'on')
                 .css('user-select', 'none')
                 .on('selectstart', false);
    };
})(jQuery);


function galleryPlusImage(src, gallery)
{ // Constructor of image object
	this.filename=src.replace(gallery.thumbDir, '');
	this.imageDir=gallery.imageDir;
	this.thumbDir=gallery.thumbDir;
	this.caption='';
	this.thumbWidth=0;
	this.thumbHeight=0;
	this.loaded=false;
	this.ratio=0;
	this.gallery=gallery;

	this.exLoaded=false;
	this.exSrc=gallery.imageDir+this.filename;
  // init
	this.image=new Image();
	var img=this;
	// thumb image onload handler
	this.image.onload=function()
	{
		img.thumbWidth=this.width;
		img.thumbHeight=this.height;
  	img.ratio=img.thumbWidth/img.thumbHeight;
		img.loaded=true;
		img.gallery.loaded++;
		if (img.gallery.loaded==img.gallery.count) img.gallery.showThumbs();
	};
	this.image.src=gallery.thumbDir+this.filename;
	// expanded image onload handler
}

function galleryPlus(element)
{ // Constructor of gallery object
	// init properties
	this.element=element;
	this.id='';
	this.index=0;
	this.caption=''; 
	this.thumbDir='';
	this.imageDir='';
	this.images=new Array();
	this.loaded=0;
	this.ratio=0;
	this.exCaption='';
	this.single=$(this.element).hasClass(gallerySettings['singleClass']);
	this.single=(this.single==undefined)?false:true;
	
	this.current=-1;
	this.expanded=-1;
	this.count=0;
	
	this.tickValue=0;
	this.tickStep=100;
	this.mouseOverPause=true;
	this.paused=false;

	// methods
	this.addImages=gpAddImages;
	this.showThumbs=gpShowThumbs;
	this.pointers=gpPointers;
	this.resize=gpResize;
	this.start=gpStart;
	this.prev=gpPrev;
	this.next=gpNext;
	this.show=gpShow;
	this.tick=gpTick;
	this.pause=gpPause;
	this.resume=gpResume;
	this.navigation=gpNavigation;
	this.expand=gpExpand;
	this.collapse=gpCollapse;
	this.exPrev=gpExPrev;
	this.exNext=gpExNext;
	this.exShow=gpExShow;
	this.exLoader=gpExLoader;
	this.exNavigation=gpExNavigation;
	this.exResize=gpExResize;
	this.init=gpInit;
	
	// do initialisation
	this.init();
}
  
function gpInit()
{ // initialises the gallery and adds images inside it
	var sWidth='100%';
	var parentAligner;
	this.id=$(this.element).attr('id');
	this.index=this.id.replace(gallerySettings['galleryPrefix'], '');
	$(this.element).prepend('<div id="'+gallerySettings['galleryLoaderPrefix']+this.index+'"><img src="'+gallerySettings['galleryLoader']+'"></div>');
	$(this.element).prepend('<div class="'+gallerySettings['galleryPrevClass']+'"></div><div class="'+gallerySettings['galleryNextClass']+'"></div>');
	$('#'+gallerySettings['galleryLoaderPrefix']+this.index).css({'height': gallerySettings['galleryLoaderHeight']+'px', 'text-align': 'center', 'display': 'block'});
	$(this.element).css({'height':gallerySettings['galleryLoaderHeight']+'px', 'display':'block', 'position':'relative', 'overflow':'hidden', 'cursor':'pointer'});
	
	if (!this.single)
	{
	  $(this.element).css({'width':'100%'});
	}
	else
	{
		parentAligner=$($(this.element).parent()[0]);
		if (parentAligner.hasClass('ig-left') || parentAligner.hasClass('ig-right')) sWidth=gallerySettings['gallerySingleWidth']+'px';
    $(this.element).css('width', sWidth);
	}

 	$('#'+this.id+' > .'+gallerySettings['galleryPrevClass']).css({'display':'block', 'opacity':gallerySettings['navigationOpacity']});
 	$('#'+this.id+' > .'+gallerySettings['galleryNextClass']).css({'display':'block', 'opacity':gallerySettings['navigationOpacity']});
	var caption=$(this.element).attr('caption');
	var thumbDir=$(this.element).attr('thumbDir');
	var imageDir=$(this.element).attr('imageDir');
	if (caption!=undefined) this.caption=caption;
	if (thumbDir!=undefined) this.thumbDir=thumbDir;
	if (imageDir!=undefined) this.imageDir=imageDir;
	if (!gallerySettings['showPointer']) $('#'+gallerySettings['pointerPrefix']+this.index).css('display', 'none');
	if (this.caption!='') $('#'+gallerySettings['captionPrefix']+this.index).html(this.caption); else $('#'+gallerySettings['captionPrefix']+this.index).css('display', 'none');
	this.addImages();
	galleryList[this.id]=this;
}

function gpAddImages()
{ // finds images and adds them
	this.count=$(this.element).children('.'+gallerySettings['imagesClass']).length;
	if (this.count==0)
	{
  	if (gallerySettings['galleryOuterClass']!='')
		  $(this.element).parent().css('display', 'none');
		else
		  $(this.element).css('display', 'none');
	}
	else
	{
		var gallery=this;
  	if (gallerySettings['galleryOuterClass']!='')
		  $(this.element).parent().css('display', 'block');
		else	
		  $(this.element).css('display', 'block');
		$(this.element).children('.'+gallerySettings['imagesClass']).each(function()
		{
			var idx=gallery.images.length;
			var src=$(this).attr('src');
			var id=gallerySettings['imagePrefix']+idx;
			var div='<div id="'+id+'" class="'+gallerySettings['imagesClass']+'"><img src="'+src+'"></div>';
			$(this).replaceWith(div);
			$('#'+id).css({'display':'none', 'position':'absolute', 'top':'0px', 'left':'0px', 'overflow':'hidden'});
			$('#'+id+' > IMG').css({'position':'absolute', 'top':'0px', 'left':'0px', 'width':'100%'});
			gallery.images[idx]=new galleryPlusImage(src, gallery);
		});
	}
}

function gpResize()
{ // on resize - resizes the galleries
	var wrapperWidth=$(this.element).innerWidth();
	var wrapperHeight, rX, rY, iW, iH, dX, dY, sR;
	wrapperHeight=parseInt(wrapperWidth*this.ratio, 10);
	$(this.element).css({'height':wrapperHeight, 'overflow':'hidden'});
	$('.'+gallerySettings['imagesClass']).css({'width':wrapperWidth+'px', 'height':wrapperHeight+'px'});
	for (var i in this.images)
	{
		iW=this.images[i].thumbWidth;
		iH=this.images[i].thumbHeight;
		rX=wrapperWidth/iW;
		if (rX!=1)
		{
     	iW=iW*rX;
	  	iH=iH*rX;
		}
		rY=wrapperHeight/iH;
		if (rY>1)
		{
	  	iW=iW*rY;
  		iH=iH*rY;
		}
		iW=parseInt(iW, 10);
		iH=parseInt(iH, 10);
		dX=parseInt((iW-wrapperWidth)/2, 10);
		dY=parseInt((iH-wrapperHeight)/2, 10);
		$('#'+gallerySettings['imagePrefix']+i+' > IMG').css({'width':iW+'px', 'height':iH+'px', 'top':-dY+'px', 'left':-dX+'px'});
	}
}

function gpShowThumbs()
{ // show thumbnailed gallery
	if (gallerySettings['thumbFixedRatio']==0 || this.single)
	{ 
		for (var i in this.images)
		{
			this.ratio+=this.images[i].ratio;
		}
		this.ratio=this.ratio/this.images.length;
	}
	else this.ratio=gallerySettings['thumbFixedRatio'];
  this.ratio=1/this.ratio;
	this.resize();
  $('#'+gallerySettings['galleryLoaderPrefix']+this.index).css('display', 'none');
	if (this.count>0)
	{
		this.pointers();
		this.start();
	}
}

function gpPointers()
{ // adds pointers if needed
	var pointers='';
	if (this.images.length>1) for(var i=0; i<this.images.length; i++)
	{
		pointers+='<div class="'+gallerySettings['pointerItemClass']+'" id="'+gallerySettings['pointerItemPrefix']+this.index+'-'+i+'">&nbsp;</div>';
	}
	$('#'+gallerySettings['pointerPrefix']+this.index).html(pointers);
}

function gpStart()
{ // start gallery images rotation
	this.next();
	this.tickValue=gallerySettings['rotationDelay'];
	this.tick();
}

function gpPrev()
{ // Show previous gallery image
	var i=this.current-1;
	if (i<0) i=this.count-1;
	this.show(i, 1);
}

function gpNext()
{ // Show next gallery image
	var i=this.current+1;
	if (i>=this.count) i=0;
	this.show(i, 1);
}

function gpShow(idx)
{ // Show specified gallery image (0=first)
	var prefix=gallerySettings['pointerItemPrefix']+this.index+'-';
	this.tickValue=(!arguments[1])?parseInt(gallerySettings['rotationDelay']*gallerySettings['delayMultiplier'], 10):this.tickValue=gallerySettings['rotationDelay'];
	if (this.current!=idx)
	{
		if (this.current>-1)
		{
  		$('#'+prefix+this.current).removeClass('selected');
	  	$('#'+gallerySettings['imagePrefix']+this.current).fadeOut(gallerySettings['rotationFade']);
		}
		this.current=idx;
		$('#'+prefix+this.current).addClass('selected');
		$('#'+gallerySettings['imagePrefix']+this.current).fadeIn(gallerySettings['rotationFade']);
	}
}

function gpTick()
{ // Do a tick
	if (!this.paused) this.tickValue=this.tickValue-this.tickStep;
	setTimeout('galleryList[\''+this.id+'\'].tick()', this.tickStep);
	if (this.tickValue<=0)
	{
		this.tickValue=gallerySettings['rotationDelay'];
		this.next();
	}
}

function gpPause()
{ // Pause the rotation
	this.paused=true;
}

function gpResume()
{ // Resume paused rotation
	if (galleryVars['expandedGallery']=='')
	{
  	this.paused=false;
	}
}

function gpNavigation(state)
{ // show/hide navigation
	if (this.count>1)
	{
		if (state)
		{
			$(this.element).children('.'+gallerySettings['galleryPrevClass']).fadeTo(gallerySettings['navigationFade'], 1);
			$(this.element).children('.'+gallerySettings['galleryNextClass']).fadeTo(gallerySettings['navigationFade'], 1);
		}
		else
		{
			$(this.element).children('.'+gallerySettings['galleryPrevClass']).fadeTo(gallerySettings['navigationFade'], gallerySettings['navigationOpacity']);
			$(this.element).children('.'+gallerySettings['galleryNextClass']).fadeTo(gallerySettings['navigationFade'], gallerySettings['navigationOpacity']);
		}
	}
	else
	{
  	$(this.element).children('.'+gallerySettings['galleryPrevClass']).css('display', 'none');
		$(this.element).children('.'+gallerySettings['galleryNextClass']).css('display', 'none');
	}
}

function gpExNavigation(state)
{ // show/hide navigation
	if (this.count>1)
	{
		if (state)
		{
			$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryPrevClass']).fadeTo(gallerySettings['navigationFade'], 1);
			$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryNextClass']).fadeTo(gallerySettings['navigationFade'], 1);
		}
		else
		{
			$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryPrevClass']).fadeTo(gallerySettings['navigationFade'], gallerySettings['navigationOpacity']);
			$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryNextClass']).fadeTo(gallerySettings['navigationFade'], gallerySettings['navigationOpacity']);
		}
	}
	else
	{
  	$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryPrevClass']).css('display', 'none');
		$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryNextClass']).css('display', 'none');
	}
}

function gpExpand()
{ // expands gallery, showing currently clicked image
	// get available screen width/height
	var imgdiv='';
	var now;
	galleryWindowSize();
	this.pause();
	galleryCover(true);
	galleryWindow(true);
	galleryVars['expandedGallery']=this.id;
	this.expanded=this.current;
	for (var i in this.images)
	{
  	now=new Date();
		imgdiv='<div id="'+gallerySettings['expandedImagePrefix']+i+'" style="display: none; z-index:'+(1+Number(i))+'; overflow: hidden;"><img src="'+this.images[i].exSrc+'?rand='+now.getMilliseconds()+'" border="0" width="100%" height="100%"></div>';
    $('#'+gallerySettings['expandedWrapperID']).append(imgdiv);
		imagesLoaded('#'+gallerySettings['expandedImagePrefix']+i, function(inst)
		{
			var idx=$(inst.elements[0]).attr('id');
    	idx=idx.replace(gallerySettings['expandedImagePrefix'], '');
			galleryList[galleryVars['expandedGallery']].images[idx].exLoaded=true;
			if (idx==galleryList[galleryVars['expandedGallery']].expanded) galleryList[galleryVars['expandedGallery']].exShow(idx);
		});
	}
	this.exShow(this.expanded);
}

function gpExResize()
{ // resizes expanded image window on browser window resize
	var expanded=(arguments.length>0)?arguments[0]:this.expanded;
	var ratio=this.images[expanded].ratio;
	var maxWidth=galleryVars['maxWindowWidth']-galleryVars['expandedWidthAddon'];
	var maxHeight=galleryVars['maxWindowHeight']-galleryVars['expandedHeightAddon'];
	maxHeight=maxHeight-galleryVars['currentCaptionAddon'];
	var imgWidth, imgHeight;
	imgWidth=maxWidth;
	imgHeight=imgWidth/this.images[expanded].ratio;
	if (imgHeight>maxHeight)
	{
		imgHeight=maxHeight;
		imgWidth=parseInt(imgHeight*this.images[expanded].ratio, 10);
	}
	galleryVars['currentImageWidth']=imgWidth;
	galleryVars['currentImageHeight']=imgHeight;
}

function gpExShow(idx)
{ // shows specified image expanded
	if (this.images[idx].exLoaded)
	{ // image is loaded, show it
		if (this.caption!='' || this.images[idx].caption!='')
		{
  		this.exCaption=this.caption;
			if (this.caption!='' && this.images[idx].caption!='') this.exCaption+=gallerySettings['captionSeparator'];
			this.exCaption+=this.images[idx].caption;
		}
  	galleryVars['currentCaptionAddon']=(this.exCaption!='')?galleryVars['expandedCaptionAddon']:0;
    this.exResize(idx);
		var expanded=idx;
		galleryVars['expandedWindowTop']=parseInt((galleryVars['windowHeight']-galleryVars['currentImageHeight']-galleryVars['expandedHeightAddon']-galleryVars['currentCaptionAddon'])/2, 10)+galleryVars['scrollTop'];
		galleryVars['expandedWindowLeft']=parseInt((galleryVars['windowWidth']-galleryVars['currentImageWidth']-galleryVars['expandedWidthAddon'])/2, 10)+galleryVars['scrollLeft'];
		
		galleryList[galleryVars['expandedGallery']].exLoader(false);
		if (galleryList[galleryVars['expandedGallery']].expanded!=-1)
			$('#'+gallerySettings['expandedImagePrefix']+galleryList[galleryVars['expandedGallery']].expanded).fadeOut(gallerySettings['coverFade']);

		$('#'+gallerySettings['expandedWrapperID']).animate({'width':galleryVars['currentImageWidth'], 'height':galleryVars['currentImageHeight']}, {'duration':gallerySettings['coverFade']});
		$('#'+gallerySettings['expandedOuterID']).animate({'width':galleryVars['currentImageWidth'], 'height':galleryVars['currentImageHeight']+galleryVars['currentCaptionAddon'], 'top':galleryVars['expandedWindowTop'], 'left':galleryVars['expandedWindowLeft']}, {'duration':gallerySettings['coverFade'], 'complete':function()
		{
//  		$('#'+gallerySettings['expandedWrapperID']).css({'width':galleryVars['currentImageWidth'], 'height':galleryVars['currentImageHeight'], 'display':'block'});
  		$('#'+gallerySettings['expandedWrapperID']).css({'display':'block'});
  		$('#'+gallerySettings['expandedCaptionID']).css('display', 'block');
    	$('#'+gallerySettings['expandedCaptionID']).html(galleryList[galleryVars['expandedGallery']].exCaption);
			$('#'+gallerySettings['expandedImagePrefix']+expanded).fadeIn(gallerySettings['coverFade']);
			galleryList[galleryVars['expandedGallery']].expanded=Number(expanded);
//			setTimeout(function(){galleryList[galleryVars['expandedGallery']].exNext()}, 2000);
      $('#'+gallerySettings['expandedCloseID']).css('display', 'block');
		}});
	}
	else
	{ // not loaded, show loader div
		this.exLoader(true);
	}
}

function gpExNext()
{ // show next image expanded
	var i=this.expanded+1;
	if (i>=this.count) i=0;
	this.exShow(i);
}

function gpExPrev()
{ // show previous image expanded
	var i=this.expanded-1;
	if (i<0) i=this.count-1;
	this.exShow(i);
}

function gpExLoader(state)
{ // show/hide expanded view loader layer depending on state value
	if (state)
	{
		$('#'+gallerySettings['expandedLoaderID']).css('display', 'block');
	}
	else
	{
		$('#'+gallerySettings['expandedLoaderID']).fadeOut(gallerySettings['coverFade']);
	}
}

function gpCollapse()
{ // collapses gallery (cancel expand)
  this.exCaption='';
	this.expanded=-1;
  galleryVars['currentCaptionAddon']=0;
	galleryVars['expandedGallery']='';
  $('#'+gallerySettings['expandedCloseID']).css('display', 'none');
  galleryWindow(false);
	galleryCover(false);
	this.resume();
}

function galleryCover(state)
{ // shows/hides cover layer depending on state argument
	if (state)
	{
		$('#'+gallerySettings['coverID']).css({'height':'100%', 'width':'100%', 'right':'0px', 'bottom':'0px'});
		$('#'+gallerySettings['coverID']).fadeTo(gallerySettings['coverFade'], 0.4);
	}
	else
	{
		$('#'+gallerySettings['coverID']).fadeOut(gallerySettings['coverFade']);
	}
}

function galleryPosition()
{
	galleryVars['expandedWindowTop']=parseInt((galleryVars['windowHeight']-galleryVars['currentImageHeight']-galleryVars['expandedHeightAddon']-galleryVars['currentCaptionAddon'])/2, 10)+galleryVars['scrollTop'];
	galleryVars['expandedWindowLeft']=parseInt((galleryVars['windowWidth']-galleryVars['currentImageWidth']-galleryVars['expandedWidthAddon'])/2, 10)+galleryVars['scrollLeft'];
	$('#'+gallerySettings['expandedOuterID']).css({'width':galleryVars['currentImageWidth'], 'height':galleryVars['currentImageHeight']+galleryVars['currentCaptionAddon'], 'top':galleryVars['expandedWindowTop'], 'left':galleryVars['expandedWindowLeft'], 'overflow':'hidden' });
	$('#'+gallerySettings['expandedWrapperID']).css({'width':galleryVars['currentImageWidth'], 'height':galleryVars['currentImageHeight']});
}

function galleryWindow(state)
{ // shows/hides expanded window depending on state argument
	if (state)
	{
    galleryPosition();
		$('#'+gallerySettings['expandedOuterID']).fadeIn(gallerySettings['coverFade']);
	}
	else
	{
		$('#'+gallerySettings['expandedOuterID']).fadeOut(gallerySettings['coverFade']);
  	galleryVars['currentImageWidth']=gallerySettings['galleryLoaderWidth'];
	  galleryVars['currentImageHeight']=gallerySettings['galleryLoaderHeight'];
		// destroy images inside the wrapper and recreate loader div
		$('#'+gallerySettings['expandedWrapperID']).empty();
    galleryExpandedWrapperContent(false);
  	$('#'+gallerySettings['expandedWrapperID']).css({'display':'none'});
  	$('#'+gallerySettings['expandedCaptionID']).css({'display':'none'});
	}
}

function galleryScrolls()
{ // get current scroll top/left position
	galleryVars['scrollLeft']=$(window).scrollLeft();
	galleryVars['scrollTop']=$(window).scrollTop();
	if (galleryVars['expandedGallery']!='')
	{
		galleryList[galleryVars['expandedGallery']].exResize();
		galleryPosition();
	}
}

function galleryWindowSize()
{ // get available window size, scroll positions
	galleryVars['windowWidth']=$(window).width();
	galleryVars['windowHeight']=$(window).height();
	galleryVars['maxWindowWidth']=parseInt(galleryVars['windowWidth']*gallerySettings['expandedWidth'], 10);
	if (galleryVars['maxWindowWidth']>gallerySettings['expandedMaxWidth']) galleryVars['maxWindowWidth']=gallerySettings['expandedMaxWidth'];
	galleryVars['maxWindowHeight']=parseInt(galleryVars['windowHeight']*gallerySettings['expandedHeight'], 10);
	if (galleryVars['maxWindowHeight']>gallerySettings['expandedMaxHeight']) galleryVars['maxWindowHeight']=gallerySettings['expandedMaxHeight'];
	galleryScrolls();
}

function galleryResize()
{ // resizes all galleries
  for(var g in galleryList) if (galleryList[g].loaded==galleryList[g].count) galleryList[g].resize();
	galleryWindowSize();
}

function galleryPause()
{ // pause all gallery
  for(var g in galleryList) galleryList[g].pause();
}

function galleryResume()
{ // resume all gallery
  for(var g in galleryList) galleryList[g].resume();
}


function galleryExpandedWrapperContent(visible)
{
	var disp=visible?'block':'none';
  $('#'+gallerySettings['expandedWrapperID']).append('<div id="'+gallerySettings['expandedLoaderID']+'" style="display:'+disp+'; position:absolute; overflow:hidden; width:100%; height:100%; z-index:999999; background-image:url(\''+gallerySettings['galleryLoader']+'\'); background-position:center center; background-repeat:no-repeat"></div>');
	$('#'+gallerySettings['expandedWrapperID']).append('<div class="'+gallerySettings['galleryPrevClass']+'" style="display:'+disp+'; cursor: pointer;"></div><div class="'+gallerySettings['galleryNextClass']+'" style="display:'+disp+'; cursor: pointer;"></div>');
	$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryPrevClass']).css('opacity', gallerySettings['navigationOpacity']);
	$('#'+gallerySettings['expandedWrapperID']).children('.'+gallerySettings['galleryNextClass']).css('opacity', gallerySettings['navigationOpacity']);
}

function galleryCreateElements()
{
  galleryVars['currentImageHeight']=gallerySettings['galleryLoaderHeight'];
  galleryVars['currentImageWidth']=gallerySettings['galleryLoaderWidth'];
	var closeCode=(gallerySettings['expandedCloseID']!='' && gallerySettings['expandedCloseControl']!='')?'<div id="'+gallerySettings['expandedCloseID']+'" style="display: none; z-index: 999999; cursor: pointer; ">'+gallerySettings['expandedCloseControl']+'</div>':'';
  // add cover layer and gallery window
  $('BODY').append('<div id="'+gallerySettings['coverID']+'" style="position:fixed; z-index:999998; top:0px; left:0px; width:100%; height:100%; display:none; background-color:#000000"></div>');
//	$('BODY').append('<div id="'+gallerySettings['expandedOuterID']+'" style="z-index:999999; display:block; position:absolute; top:-10000px; left:-10000px">'+closeCode+'<div id="'+gallerySettings['expandedWrapperID']+'" style="display:block; position:relative; overflow:hidden; width:'+galleryVars['currentImageWidth']+'px; height:'+galleryVars['currentImageHeight']+'px"><div id="'+gallerySettings['expandedLoaderID']+'" style="display:block; position:absolute; overflow:hidden; width:100%; height:100%; z-index:999999; background-image:url(\''+gallerySettings['galleryLoader']+'\'); background-position:center center; background-repeat:no-repeat"><img src="'+gallerySettings['galleryLoader']+'" width="'+gallerySettings['galleryLoaderWidth']+'" height="'+gallerySettings['galleryLoaderHeight']+'"></div></div><div id="'+gallerySettings['expandedCaptionID']+'" style="display:none; overflow:hidden">C</div></div>');
	$('BODY').append('<div id="'+gallerySettings['expandedOuterID']+'" style="z-index:999999; display:block; position:absolute; top:-10000px; left:-10000px">'+closeCode+'<div id="'+gallerySettings['expandedWrapperID']+'" style="display:block; position:relative; overflow:hidden; width:'+galleryVars['currentImageWidth']+'px; height:'+galleryVars['currentImageHeight']+'px"></div><div id="'+gallerySettings['expandedCaptionID']+'" style="display:none; overflow:hidden">C</div></div>');
	$('#'+gallerySettings['expandedWrapperID']).mouseenter(function()
	{
		if (galleryVars['expandedGallery']!='')
		{
			galleryList[galleryVars['expandedGallery']].exNavigation(true);
		}
	});
	$('#'+gallerySettings['expandedWrapperID']).mouseleave(function()
	{
		if (galleryVars['expandedGallery']!='')
		{
			galleryList[galleryVars['expandedGallery']].exNavigation(false);
		}
	});
	$('#'+gallerySettings['expandedWrapperID']).on('click', '.'+gallerySettings['galleryPrevClass'], function()
	{
		if (galleryVars['expandedGallery']!='')
		{
			galleryList[galleryVars['expandedGallery']].exPrev();
		}
	});
	$('#'+gallerySettings['expandedWrapperID']).on('click', '.'+gallerySettings['galleryNextClass'], function()
	{
		if (galleryVars['expandedGallery']!='')
		{
			galleryList[galleryVars['expandedGallery']].exNext();
		}
	});
  galleryExpandedWrapperContent(true);

}

function galleryCalculateVars()
{
	galleryVars['expandedWidthAddon']=$('#'+gallerySettings['expandedOuterID']).outerWidth(false)-galleryVars['currentImageWidth'];
	galleryVars['expandedHeightAddon']=$('#'+gallerySettings['expandedOuterID']).outerHeight(false)-galleryVars['currentImageHeight'];
	$('#'+gallerySettings['expandedCaptionID']).css({'display':'block'});
	galleryVars['expandedCaptionAddon']=$('#'+gallerySettings['expandedCaptionID']).outerHeight(true); //-galleryVars['expandedHeightAddon'];
	$('#'+gallerySettings['expandedLoaderID']).css({'display':'block', 'position':'absolute', 'overflow':'hidden', 'width':'100%', 'height':'100%', 'z-index':999999, 'background-image':"url('"+gallerySettings['galleryLoader']+"')", 'background-position':'center center', 'background-repeat':'no-repeat'});
	$('#'+gallerySettings['expandedCaptionID']).html('&nbsp');
	$('#'+gallerySettings['expandedCaptionID']).css({'display':'none'});
	$('#'+gallerySettings['expandedOuterID']).css({'display':'none'});
}

function galleryStartup()
{ // startup of the galleries
  galleryCreateElements();
	setTimeout(galleryCalculateVars, 100);

	// bind keys

  $('BODY').keyup(function(evt)
	{
		
		switch (evt.which)
		{
			case 27:			// ESC
										if (galleryVars['expandedGallery']!='')
										{
											galleryList[galleryVars['expandedGallery']].collapse();
										};
			case 37:			// left arrow
										if (galleryVars['expandedGallery']!='')
										{
											galleryList[galleryVars['expandedGallery']].exPrev();
										};
			case 39:			// right arrow
										if (galleryVars['expandedGallery']!='')
										{
											galleryList[galleryVars['expandedGallery']].exNext();
										};
		}
	}); 	

	// bind cover onclick
	if (gallerySettings['closeOnCoverClick'])
	{
		$('#'+gallerySettings['coverID']).click(function()
		{
			if (galleryVars['expandedGallery']!='')
			{
				galleryList[galleryVars['expandedGallery']].collapse();
			};
		});
	}
  // bind close click
  $('#'+gallerySettings['expandedCloseID']).click(function()
  {
		if (galleryVars['expandedGallery']!='')
		{
			galleryList[galleryVars['expandedGallery']].collapse();
		};
	});
	
  // find galleries
  $('.'+gallerySettings['galleryClass']).each(function()
	{
		// add a gallery
		new galleryPlus($(this));
    // bind mouseenter for pause
		$(this).mouseenter(function(evt)
		{
			var id=$(this).attr('id');
			galleryList[id].pause();
			galleryList[id].navigation(true);
		});
    // bind mouseleave for resume
		$(this).mouseleave(function(evt)
		{
			var id=$(this).attr('id');
			galleryList[id].resume();
			galleryList[id].navigation(false);
		});
		// bind click on prev navigation
		$('.'+gallerySettings['galleryClass']).on('click', '.'+gallerySettings['galleryPrevClass'], function()
		{
			var id=$(this).parent().attr('id');
			galleryList[id].prev();
		});
		// bind click on next navigation
		$('.'+gallerySettings['galleryClass']).on('click', '.'+gallerySettings['galleryNextClass'], function()
		{
			var id=$(this).parent().attr('id');
			galleryList[id].prev();
		});
		// bind click on image
		$('.'+gallerySettings['galleryClass']).click(function(evt)
		{
			var targetClass=$(evt.target).attr('class');
			if (targetClass!=gallerySettings['galleryPrevClass'] & targetClass!=gallerySettings['galleryNextClass'])
			{
  			var id=$(this).attr('id');
	  		galleryList[id].expand();
			}
		});
		// bind pointer click
		{
			$('BODY').on('click', '.'+gallerySettings['pointerItemClass'], function(){
				var id=$(this).attr('id');
				var parts=id.split('-');
				if (parts.length==3)
				{
					galleryList[gallerySettings['galleryPrefix']+parts[1]].show(parseInt(parts[2], 10), 1);
				}
			});
		}
	});

	$(window).resize(galleryResize);
	$(window).scroll(galleryScrolls);
	$(window).focus(galleryResume);
	$(window).blur(galleryPause);
	setTimeout(galleryResize, 100);
	setTimeout(galleryResize, 1000);
	$('.'+gallerySettings['galleryClass']).disableSelection();
	$('#'+gallerySettings['expandedOuterID']).disableSelection();
}

// Startup

$(document).ready(galleryStartup);
