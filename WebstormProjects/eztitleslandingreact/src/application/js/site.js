// EZTitles main JS file

  var homeBannersDelay=7000;
  var homeBannersOver=false;
  var homeBannersTimeout=-1;
  var homeBannersReady=false;

  less = {
    env: "development",
    async: false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false,
    rootpath: ":/localhost/"
  };
  
  (function($)
  {
    $.fn.disableSelection = function()
    {
      return this
      .attr('unselectable', 'on')
      .css('user-select', 'none')
      .css('-moz-user-select', 'none')
      .css('-khtml-user-select', 'none')
      .css('-webkit-user-select', 'none')
      .on('selectstart', false)
      .on('contextmenu', false)
      .on('keydown', false)
      .on('mousedown', false);
    };
  })(jQuery);
  
  function setWH()
  {
    var txt=$(window).width()+'px / '+$(window).height()+'px';
    $('#disp').html(txt);
    if ($('.le-mobile').css('display')=='none')
    {
      $('.le-column.edition').css('display', 'block');
    }
    else
    {
      editionsChange();
    }
  }
  
  function setSmallMenu()
  {
    var topMenu=$('#header-top .top-menu').html();
    var bottomMenu=$('#header-bottom .bottom-menu').html();
    $('#small-menu .top-menu').html(topMenu);
    $('#small-menu .bottom-menu').html(bottomMenu);
    $('.menu-300').click(function(){$('#small-menu').toggle()})
  }
  
  function selectHomeBanner(idx, selected)
  { // select/display home banner
    if (homeBannersTimeout!=-1) clearTimeout(homeBannersTimeout);
    $('#home-banner-'+selected).fadeOut('slow');
    $('#home-banner-'+idx).fadeIn('slow');
    $('#home-banner').attr('show', idx);
    $('#hb-nav-'+selected).removeClass('selected');
    $('#hb-nav-'+idx).addClass('selected');
    homeBannersTimeout=setTimeout(nextHomeBanner, homeBannersDelay);
  }
  
  function nextHomeBanner()
  { // displays next home banner
    var show=Number($('#home-banner').attr('show'));
    var count=Number($('#home-banner').attr('count'));
    var next=(show<count-1)?show+1:0;
    if (next!=show) selectHomeBanner(next, show);
  }
  
  function prevHomeBanner()
  { // displays prev home banner
    var show=Number($('#home-banner').attr('show'));
    var count=Number($('#home-banner').attr('count'));
    var prev=(show==0)?count-1:show-1;
    if (prev!=show) selectHomeBanner(prev, show);
  }
  
  function stopHomeBannersRotation()
  { // stops banner rotation (on blur or mouseover)
    if (homeBannersReady && homeBannersTimeout!=-1)
    {
      clearTimeout(homeBannersTimeout);
    }
  }
  
  function startHomeBannersRotation()
  { // stops banner rotation (on blur or mouseover)
    if (homeBannersReady && !homeBannersOver)
    {
      homeBannersTimeout=setTimeout(nextHomeBanner, homeBannersDelay);
    }
  }
  
  function setHomeBanners()
  { // enumerates home banners, displays first one and put banner nav links
    var home=$('#home-banner');
    if (home.length!=0)
    {
      var banners=[];
      var navigation='';
      var count=$('#home-banner .hb-container').length;
      $('#home-banner').attr('count', count);
      home=home[0];
      $('#home-banner .hb-container').each(function()
      {
        var idx=$(this).attr('idx');
        navigation+='<div id="hb-nav-'+idx+'" idx="'+idx+'">&nbsp;</div>';
      });
      $('#home-banner-nav').append(navigation);
      $('#home-banner-nav DIV').click(function()
      {
        var idx=$(this).attr('idx');
        var selected=$('#home-banner').attr('show');
        if (selected!=idx) selectHomeBanner(idx, selected);
      });
      $('#home-banner').mouseenter(function()
      {
        homeBannersOver=true;
        stopHomeBannersRotation();
        $('.hbnav').fadeIn('slow');
      });
      $('#home-banner').mouseleave(function()
      {
        homeBannersOver=false;
        startHomeBannersRotation();
        $('.hbnav').fadeOut('slow');
      });
      selectHomeBanner(0, '---');
      if (count==1)
      {
        $('#home-banner-nav').css('display', 'none');
      }
      else
      {
        $('#home-banner').append('<div class="hbnav prev"></div><div class="hbnav next"></div>');
        $('.hbnav.prev').click(prevHomeBanner);
        $('.hbnav.next').click(nextHomeBanner);
      }
      homeBannersReady=true;
    }
  }

/* Clients rotation */

  var bannerRotationDelay=2000;
  var bannerPositionsDisplay=0;
  var bannerPositionsCount=0;
  var bannerPositionWidth=0;
  var bannerPositionCurrent=0;
  var bannerDirection=0;
  var bannerMouseOver=false;
  var bannerRotation=-1;
  var bannerCaretWidth=0;
  var bannerCaretEnd=0;
  var bannerWorking=false;

  function rotateBanners()
  {
    if (!bannerMouseOver)
    {
      var start=parseInt($('#banner-caret').css('left'), 10);
      if (start<=bannerCaretEnd && bannerDirection==-1)
      {
        bannerDirection=1;
      }
      else if (start>=0 && bannerDirection==1)
      {
        bannerDirection=-1;
      }
      var step=bannerPositionWidth*bannerDirection;
      var newLeft=start+step;
      bannerWorking=true;
      $('#banner-caret').animate({'left': newLeft}, 'fast', 'swing', function(){bannerWorking=false;});
    }
    bannerRotation=setTimeout(rotateBanners, bannerRotationDelay);
  }

  function startBannersRotation()
  {
    if (!bannerMouseOver)
    {
      bannerRotation=setTimeout(rotateBanners, bannerRotationDelay);
    }
  }
  
  function stopBannersRotation()
  {
    if (bannerRotation!=-1)
    {
      clearTimeout(bannerRotation);
    }
  }

  function changeBannerDims()
  { // change banner display dimensions
    var i=0;
    $('#banner-wrapper').css('width', '100%');
    var bw=$('#banner-wrapper').width()-60;
    bannerPositionWidth=parseInt($('#banner-caret').attr('poswidth'), 10);
    bannerPositionsDisplay=Math.floor(bw/bannerPositionWidth);
    nbw=bannerPositionsDisplay*bannerPositionWidth;
    $('#banner-wrapper').css('width', nbw);
    bannerCaretWidth=parseInt($('#banner-caret').css('width'), 10);
    bannerDirection=-1;
    bannerCaretEnd=-(bannerCaretWidth-(bannerPositionsDisplay*bannerPositionWidth));
    bannerWorking=true;
    $('#banner-caret').animate({'left': 0}, 'fast', 'swing', function(){bannerWorking=false;});
    if (bannerPositionsCount>bannerPositionsDisplay) $('.banners-navigation').css('display', 'block');
  }

  function clientsRotationDelayed()
  {
    $('#banner-caret').css('display', 'block');
    changeBannerDims();
    if (bannerPositionsCount>bannerPositionsDisplay)
    {
      $(window).focus(startBannersRotation);
      $(window).blur(stopBannersRotation);
      $('#banner-wrapper').mouseenter(function()
      {
        bannerMouseOver=true;
        stopBannersRotation();
      });
      $('#banner-wrapper').mouseleave(function()
      {
        bannerMouseOver=false;
        startBannersRotation();
      });
      $('.clnav.prev').click(function()
      {
        var start=parseInt($('#banner-caret').css('left'), 10);
        if (start<0 && !bannerWorking)
        {
          var dir=bannerDirection;
          bannerDirection=1;
          var step=bannerPositionWidth*bannerDirection;
          var newLeft=start+step;
          bannerWorking=true;
          $('#banner-caret').animate({'left': newLeft}, 'fast', 'swing', function(){bannerWorking=false;});
          bannerDirection=dir;
          startBannersRotation();
        }
        $(this).blur();
      });
      $('.clnav.next').click(function()
      {
        var start=parseInt($('#banner-caret').css('left'), 10);
        if (start>bannerCaretEnd && !bannerWorking)
        {
          var dir=bannerDirection;
          bannerDirection=-1;
          var step=bannerPositionWidth*bannerDirection;
          var newLeft=start+step;
          bannerWorking=true;
          $('#banner-caret').animate({'left': newLeft}, 'fast', 'swing', function(){bannerWorking=false;});
          bannerDirection=dir;
          startBannersRotation();
        }
        $(this).blur();
      });
      $('.clnav').mouseenter(function()
      {
        bannerMouseOver=true;
        stopBannersRotation();
      });
      $('.clnav').mouseleave(function()
      {
        bannerMouseOver=false;
        startBannersRotation();
      });
      startBannersRotation();
    }
  }

  function clientsRotation()
  { // site startup
    // Banner positions fix
    $(window).bind( 'orientationchange', changeBannerDims);
    $(window).bind( 'resize', changeBannerDims);
    
    // Start banner rotation
    bannerPositionsCount=$('#banner-caret').attr('positions');
    setTimeout('clientsRotationDelayed()', 1000);
  }

  function loginBackgrounds()
  { // manages backgrounds on login controls
    $('.bg-change').focus(function()
    {
      $(this).css('background', '#FFFFFF');
    });
    $('.bg-change').blur(function()
    {
      var value=$.trim($(this).val());
      if (value=='')
      {
        var bgr=$(this).attr('background');
        $(this).val(value);
        $(this).css('background', "#FFFFFF url('"+bgr+"') no-repeat left center");
      }
    });
  }

  function loginCheck()
  {
    var f=document.forms.login;
    if (f)
    {
      return ($.trim(f.username.value)=='' || $.trim(f.userpass.value)=='')?false:true;
    }
  }

/* Installments */

  var checkedEdition=null;
  var priceBlock=null;
  var savePrice='';

  function placeInstallmentPricing(pricing)
  { // places pricing info in the installment table cells
    for (var r in pricing)
    {
      for (var c in pricing[r])
      {
        $('#install-'+r+'-'+c).html((r!=4?EUR:'')+pricing[r][c]+(r!=4?'':PAYMENTS));
      }
    }
  }

  function setActiveInstallmentProduct()
  { // selects which installment product/edition to be active
    $('.installment-product-edition').click(function()
    {
      var oldProduct=$(checkedEdition).attr('product');
      var oldEdition=$(checkedEdition).val();
      $(checkedEdition).prop('checked', false);
      $('#edition-'+oldProduct+'-'+oldEdition).removeClass('boldtext').addClass('normtext');
      $(checkedEdition).parent().parent().removeClass('block').addClass('block-alt');
      var product=$(this).attr('product');
      var edition=$(this).val();
      var pricing=productsPricing[product][edition];
      checkedEdition=$(this);
      $('#edition-'+product+'-'+edition).addClass('boldtext').removeClass('normtext');
      placeInstallmentPricing(pricing);
      $(this).parent().parent().removeClass('block-alt').addClass('block');
    });
    $('.installment-product-edition').first().click();
  }

  function setActiveRentProduct()
  { // selects which rent product/edition to be active
    var MAX_COUNT=9;

    $('.product-price-block').each(function()
    {
      $(this).html($('#select-edition-block').html());
    });

    $('.sell-product-edition').click(function()
    {
      var oldProduct=$(checkedEdition).attr('product');
      var oldEdition=$(checkedEdition).val();
      var disp=$(this).parent().children('.product-price-block');
      var oldDisp=$(checkedEdition).parent().children('.product-price-block');
      priceBlock=disp;
      oldDisp.html($('#select-edition-block').html());
      $(checkedEdition).prop('checked', false);
      $('#edition-'+oldProduct+'-'+oldEdition).removeClass('boldtext').addClass('normtext');
      $(checkedEdition).parent().removeClass('block').addClass('block-alt');
      var product=$(this).attr('product');
      var edition=$(this).val();
      var custom=$.isNumeric(edition)?false:true;
      
      $('#product-short-'+oldProduct).css('display', 'none');
      $('#product-short-'+product).css('display', 'block');
      $('#product-edition-name-'+product).html(editionNames[product][edition]);
      $('#edition-short-'+oldProduct+'-'+oldEdition).css('display', 'none');
      $('#edition-short-'+product+'-'+edition).css('display', 'block');
      
      
      var pricing=productsPricing[product][edition];
      checkedEdition=$(this);
      $(checkedEdition).prop('checked', true);
      $('#edition-'+product+'-'+edition).addClass('boldtext').removeClass('normtext');
      $(this).parent().removeClass('block-alt').addClass('block');
      disp.html($('#price-purchase-block').html());
      if (custom)
      {
        disp.children('.price-display').html('Price, '+EUR+' (VAT excluded)');
        $('#price-edit').val(savePrice);
      }
      else  
        disp.children('.price-display').html(EUR+pricing+PER_MONTH);
    });
    $('.sell-product-edition').first().click();
    $('BODY').on('click', '.count-btn', [], function(evt)
    {
      evt.preventDefault();
      var step=Number($(this).attr('step'));
      var count=Number($('#count-edit').val());
      var newCount=count+step;
      if (newCount<0) newCount=0;
      if (newCount>MAX_COUNT) newCount=MAX_COUNT;
      $('#count-edit').val(newCount);
    });
    $('BODY').on('blur', '#count-edit', [], function()
    {
      var count=Number($(this).val());
      if (count<0) count=0;
      if (count>MAX_COUNT) count=MAX_COUNT;
      $(this).val(count);
    });
    $('BODY').on('blur', '#price-edit', [], function()
    {
      var price=$.trim($(this).val());
      if ($.isNumeric(price))
      {
        price=Number(price);
        savePrice=price;
      }
      else if (price!='')
      {
        $('#price-edit').focus();
      }
      
    });
    $('BODY').on('click', '.add-button', [], function(evt)
    {
      evt.preventDefault();
      var custom=$(this).attr('mode')=='C'?true:false;
      if (custom)
      { // custom payment
        var count=1;
        var mode='C';
        var product=$(checkedEdition).attr('product');
        var edition=$(checkedEdition).val();
        var price=Number($('#price-edit').val());
        if ($.isNumeric(price) && price>0)
//          console.log('custom add '+count+'/'+product+'/'+edition+'/'+price+'/'+mode);
          addProduct2Cart(count, product, edition, price, mode);
        else
          $('#price-edit').focus();
      }
      else
      { // regular buy/rent
        var count=$('#count-edit').val();
        var mode=$('#count-edit').attr('mode');
        var product=$(checkedEdition).attr('product');
        var edition=$(checkedEdition).val();
        var price=productsPricing[product][edition];
        addProduct2Cart(count, product, edition, price, mode);
      }
    });
  }
  
  function addProduct2Cart(count, product, edition, price, mode)
  {
    var priceAddon=(mode.toUpperCase()=='C')?'&price='+price:'';
    document.location='index.php?page=shopping-cart&add='+product+'&edition='+edition+'&mode='+mode+'&count='+count+'&ref='+pageAlias+priceAddon;
  }

//// VAT functions

  var VATchecked=false;
  var VATcheckCount=0;

  function outputVATerror(msg)
  {
    $('#VAT-error').html('<b class="err">'+msg+'</b><br><br>');
  }

  function outputVATmessage(msg)
  {
    $('#VAT-error').html('<b class="conf">'+msg+'</b><br><br>');
  }

  function wizardVATcomplete()
  {
    var vatID=$('#vatID').val();
    var vatPrefix=$('#vatPrefix').val();
    var country=$('#country').val();
    var vat='';
    for (var c in vatCountries)
    {
      if (c==country)
      {
        vat=vatCountries[c];
        break;
      }
    }
    var page=encodeURI('index.php?page='+shopPage+'&country='+country+'&vatid='+vatPrefix+vatID+'&vat='+vat);
    location.replace(page);
  }

  function requestVATcheck()
  {
    var cnt=(arguments.length>0)?arguments[0]:VATcheckCount;
    var vatID=$('#vatID').val();
    var vatPrefix=$('#vatPrefix').val();
    if (vatID!='')
    {
      $('#VAT-error').html('<i class="fa fa-cog fa-spin fa-2x fa-fw"></i><br><br>');
      ajaxProcessRequest('vatCheck.php', {'vatid':vatPrefix+vatID});
    }
    else
    {
      answerVATcheck({'result':false, 'error':'Invalid VAT ID!'});
    }
    
  }
  
  function makeVATIDcheck()
  {
    var vatID=$('#vatID').val();
    vatID=vatID.toUpperCase();
    $('#vatID').val(vatID);
    
    if (vatID!='')
    {
      $('#VAT-error').html('<i class="fa fa-cog fa-spin fa-2x fa-fw"></i><br><br>');
      ajaxProcessRequest('vatCheck.php', {'vatid':vatID});
    }
    else
    {
      answerVATcheck({'result':false, 'error':'Invalid VAT ID!'});
    }
    
  }
  
  function answerVATcheck(data)
  {
    if (data['result']!=undefined)
    {
      if (data['result']==-1)
      { // server is busy, try again
        VATcheckCount++;
        if (VATcheckCount<5)
        {
          requestVATcheck();
        }
        else
        {
          outputVATerror(data['error']);
        }
      }
      else
      {
        if (data['result']==false)
        {
          outputVATerror(data['error']+'<br><br>Please check if the VAT ID you entered, is correct.');
        }
        else
        {
          outputVATmessage('VAT ID is valid. You can continue shopping');
        }
        $('#wizard-step-3').css('display', 'block');
      }
      $('#no-check-vat').css('display', 'none');
    }
  }
  
  function vatWizardSetup()
  { // initial setup of the VAT wizard steps
    var country=$('#country').val();
    $('#wizard-step-2').css('display', 'none');
    $('#wizard-step-3').css('display', 'none');
    $('#vatID').val('');
    $('#VAT-error').html('');
    $('#country-prefix').html('');
    $('#vatPrefix').val('');
    if (country!='')
    {
      var found='';
      var prefix='';
      for (var c in vatCountries)
      {
        if (c==country)
        {
          found=country;
          prefix=vatPrefixes[country];
          break;
        }
      }
      if (found!='')
      {
        $('#wizard-step-2').css('display', 'block');
        $('#country-prefix').html(prefix);
        $('#vatPrefix').val(prefix);
        $('#vatID').focus();
      }
      else
      {
        $('#wizard-step-3').css('display', 'block');
      }
    }
  }

  function showHideButton()
  {
    $('#show-hide-button').click(function(evt)
    {
      var hideText=$(this).attr('hide');
      var showText=$(this).attr('show');
      evt.preventDefault();
      var disp=$('#show-hide-container').css('display');
      if (disp=='none')
      {
        $('#show-hide-container').css('display', 'block');
        $('#show-hide-button').html(hideText);
      }
      else
      {
        $('#show-hide-container').css('display', 'none');
        $('#show-hide-button').html(showText);
      }
    });
  }

  function olderLogsButton()
  {
    $('#older-logs').click(function(evt)
    {
      evt.preventDefault();
      $('#older-logs-button').css('display', 'none');
      $('#older-logs-container').css('display', 'block');
    });
  }

  function checkCheckout(msgOK, msgERR, obj)
  { // checks if agree checkboxes are checked before confirming the checkout
    var agreed=$('#licenseAgree').prop('checked')&$('#supportAgree').prop('checked')?true:false;
    if (!agreed)
    {
      popupError(msgERR);
    }
    else
    { // checked, display confirm
      popupConfirm(msgOK, obj);
    }
    return false;
  }

  function gotoPayPal(msgOK, obj)
  { // confirm the order
    popupConfirm(msgOK, obj);
    return false;
  }
  
  function gotoPayPal2(msgOK, obj)
  { // confirm the order
    if (fundsCheckAll()) popupConfirm(msgOK, obj);
    return false;
  }
  
  function editionsChange()
  {
    if ($('.le-mobile').css('display')=='block')
    {
      var val=$('#editions').val();
      if (val!='undefined')
      {
        $('.le-column.edition').css('display', 'none');
        $('#'+val).css('display', 'block');
      }
    }
    else
    {
      var count=$('.le-column.edition').length;
      $('.le-column.edition').addClass('e'+count);
    }
    $('#editions').change(function()
    {
      var val=$(this).val();
      if (val!='undefined')
      {
        $('.le-column.edition').css('display', 'none');
        $('#'+val).css('display', 'block');
      }
    });
  }

  function hidePurchase()
  {
    $('.added-product').fadeOut('slow');
  }

  function clickRadios()
  {
    $('.click-radio').click(function()
    {
      var id=$(this).attr('id');
      $('#r'+id).click();
    });
  }

  function gotoProductMenu()
  { // scrolls to the products submenu
    if ($('#product-header-tabs').length>0)
    {
      var top=parseInt($('#product-header-tabs').offset().top, 10);
      var ptop=parseInt($('#product-header-tabs').css('padding-top'), 10);
      window.scrollTo(0, top-20+ptop);
    }
    
    setTimeout(hidePurchase, 5000);
  }

  function disableSels()
  {
    $('#header-top *').disableSelection();
    $('#header-bottom *').disableSelection();
    $('#home-banner-outer *').disableSelection();
    $('.feature-wrapper P').disableSelection();
    $('#home-clients *').disableSelection();
    $('.footer-menu').disableSelection();
    $('.footer-menu *').disableSelection();
    $('.footer-social *').disableSelection();
    $('.footer-credits *').disableSelection();
    $('.footer-credits').disableSelection();
    $('#page-banner-outside *').disableSelection();
    $('#product-header *').disableSelection();
    $('.gallery-wrapper').disableSelection();
    $('.gallery-wrapper *').disableSelection();
    $('.gallery-pointer').disableSelection();
    $('.gallery-pointer *').disableSelection();
    $('.gallery-caption').disableSelection();
    $('.gallery-caption *').disableSelection();
    $('.product-filled-box').disableSelection();
    $('.product-bordered-box').disableSelection();
    
  }

// tooltip-related

  var openTooltipContainer='';

  function openTooltip(id, callerProps)
  { // open a tooltip
    var ttobj=$('#'+id).first();
    if (ttobj.length>0)
    {
      $(ttobj).css({'top': -9999, 'left':-9999, 'display': 'block'});
      var tW=$(ttobj).width();
      var tH=$(ttobj).height();
      var tTop=callerProps.top-parseInt((tH/2-callerProps.height/2), 10);
      var tLeft=callerProps.left;
      if ((tTop+tH)>callerProps.wBottom-5) tTop=callerProps.wBottom-tH-5;
      if (tTop<callerProps.wTop) tTop=callerProps.wTop+5;
      if ((tLeft+tW)>callerProps.wRight-5) tLeft=callerProps.wRight-tW-5;
      if (tLeft<callerProps.wLeft) tLeft=callerProps.wLeft+5;
      $(ttobj).css({'top':tTop, 'left':tLeft});
      openTooltipContainer=ttobj;
    }
  }
  
  function bindTooltips()
  { // finds tooltip callers and bind events to them
    $('.tooltip-box').each(function()
    {
      var boxNode=$(this).detach();
      $('BODY').append(boxNode);
      $(this).children('.close').click(function()
      {
        var parent=$(this).parent();
        $(parent).css({'top': -9999, 'left':-9999});
        openTooltipContainer='';
      });
    });
    
    $('BODY').click(function(evt)
    {
      if (openTooltipContainer!='') $(openTooltipContainer).children('.close').click();
    });
    
    $('.tooltip-caller').click(function(evt)
    {
      evt.stopPropagation();
      if (openTooltipContainer!='') $(openTooltipContainer).children('.close').click();
      var container=$(this).attr('container');
      if (container!=undefined)
      {
        var box=$('#'+container).first();
        if (box.length>0)
        {
          $(box).css({'top': 0, 'left': 0});
          $(box).click(function(evt){evt.stopPropagation()});
          var callerProps=$(this).offset();
          callerProps.width=$(this).width();
          callerProps.height=$(this).height();
          callerProps.left=parseInt(callerProps.left, 10);
          callerProps.top=parseInt(callerProps.top, 10);
          callerProps.wLeft=$(window).scrollLeft();
          callerProps.wTop=$(window).scrollTop();
          callerProps.wWidth=$(window).width();
          callerProps.wHeight=$(window).height();
          callerProps.wRight=callerProps.wLeft+callerProps.wWidth-1;
          callerProps.wBottom=callerProps.wTop+callerProps.wHeight-1;
          openTooltip(container, callerProps);
        }
      }
    });
  }

  function walletCheck()
  {
    var result=true;
    var f=document.forms.wallet;
    trimf(f['Name']);
    trimf(f['Desc']);
    
    if (f['Name'].value=='')
    {
      result=false;
      popupError('Please fill all required fields!');
    }
    return result;
  }

  function walletASCheck()
  {
    var result=true;
    var f=document.forms.wallet;
    trimf(f['NewAmount']);
    var newAmount=Number(f['NewAmount'].value);
    var maxAmount=Number(f['maxValue'].value);

    if (f['NewAmount'].value=='' || !is_pfloat(f['NewAmount'].value))
    {
      result=false;
      popupError('Please fill valid amount (numbers and/or dot characters)!');
    }
    else if (newAmount==0 || newAmount>maxAmount)
    {
      result=false;
      popupError('Please fill amount more than 0 and less than or equal to '+maxAmount.toFixed(2)+'!');
    }
    return result;
  }

  function fundsTotal()
  {
    
  }

  function togglePriceTable()
  {
    var disp=$('#price-table').css('display');
    if (disp=='block')
    {
      $('#price-table').css('display', 'none');
      $('#toggle-table').html('Show Price Table');      
    }
    else
    {
      $('#price-table').css('display', 'block');
      $('#toggle-table').html('Hide Price Table');      
    }
  }

  function getMinutePrice(minutes)
  {
    var count=sa_minute_prices.length;
    var price=sa_minute_prices[0][1];
    // try to find the minute range
    for (var i=0; i<count; i++)
    {
      if (minutes<sa_minute_prices[i][0])
      { // less than this range
        break;
      }
      else
      { // inside this range
        price=sa_minute_prices[i][1];
      }
    }
    return price;
  }

  function fundsCheck(ShowErrors)
  {
    var result=true;
    var f=document.forms.funds;
    trimf(f['amount']);
    var tokens=Number(f['tokens'].value);
    var amount=Number(f['amount'].value);
    var vatAmount=Number(f['vatAmount'].value);
    var vatPercent=Number(f['vatPercent'].value);
    var pricemin=getMinutePrice(1);
    var va=0;
    var ta=0;
    var amount=0;

	if (ShowErrors && (f['country'].value=='' || f['address'].value=='')) 
	{
      result=false;
      popupError('Your Address or Country is not filled in. Please go to <a href="index.php?page=customer-edit-profile">Edit Profile</a> and make sure that the Country and Address fields are correct.');
	}
	else
    {
		if (f['tokens'].value=='' || !is_pint(f['tokens'].value))
		{
		  result=false;
		  if (ShowErrors) 
			popupError('Please fill valid number of Tokens!');
		}
		else if (ShowErrors && (tokens<50))
		{
		  result=false;
		  popupError('Please fill at least 50 Tokens!');
		}
		
	}		

    if (result)
    {
      pricemin=getMinutePrice(tokens);
      amount=tokens*pricemin;
      va=amount*vatPercent/100;
      ta=amount+va;
      $('#minprice').html(pricemin.toFixed(2));
      $('#tokens').val(tokens.toFixed(0));
      $('#amount').val(amount.toFixed(2));
      $('#vatAmount').val(va.toFixed(2));
      $('#totalAmount').val(ta.toFixed(2));
      $('#checkout').removeAttr('disabled');
//      $('#checkout').focus();
    }
    else
    {
//      $('#tokens').val('');
      $('#amount').val('-');
      $('#vatAmount').val('-');
      $('#totalAmount').val('-');
      $('#checkout').attr('disabled', 'disabled');
    }
//    result=false;
    return result;
  }

  function fundsCheckAll()
  {
    var result=false;
    var f=document.forms.funds;
    var country=$('#country').val();
    var totalAmout=$('#totalAmount').val();
    var address=$('#address').val();
    
    if ($('#tokens').val()!='') var ares=fundsCheck(true);

    if (ares)
    {
      if (country=='' || totalAmount=='' || address=='')
      {
        popupError('Please fill all required fields!');
      }
      else
      {
        result=true;
      }
    }
    else
    {
      result=ares;
    }
//    result=false;
    return result;
  }

  function initDP()
  {
    $( ".date-picker" ).datepicker(
    {
      dateFormat: "yy-mm-dd",
      firstDay: 1,
      maxDate: new Date()
    });
    $('.date-picker').on('click', function(e) {
       e.preventDefault();
       $(this).attr("autocomplete", "off");  
    });    
  }

  function dpSetMin(obj, target)
  {
    var date=$(obj).val();
    if (isValidDate(date))
    {
      $('#'+target).datepicker('option', 'minDate', (date!='')?new Date(date):null);
    }
    else
    {
      $(obj).val(''); 
      $('#'+target).datepicker('option', 'minDate', null);
    }
  }
  
  function dpSetMax(obj, target)
  {
    var date=$(obj).val();
    if (isValidDate(date))
    {
      $('#'+target).datepicker('option', 'maxDate', (date!='')?new Date(date):null);
    }
    else
    {
      $(obj).val(''); 
      $('#'+target).datepicker('option', 'maxDate', null);
    }
  }
  
  function isValidDate(str)
  {
    // mm-dd-yyyy hh:mm:ss
    var regex=/(\d{2,4})[-\/](\d{1,2})[-\/](\d{1,2})/;
    var parts=regex.exec(str); 
  
    if (parts)
    {
      var date=new Date ((+parts[1]), (+parts[2])-1, (+parts[3]), 0, 0, 0);
      return ((date.getDate()==parts[3])&&(date.getMonth()==parts[2]-1)&&(date.getFullYear()==parts[1]))?true:false;
    } 
    return false;  
  }  

  function export2excel(t, s, e, w)
  {
    document.location="export_sa_report.php?t="+t+'&s='+s+'&e='+e+'&w='+w;
  }

// --- startup


/* End Clients rotation */
  
  $(document).ready(setWH);
  $(document).ready(setSmallMenu);
  $(document).ready(setHomeBanners);
  $(document).ready(clientsRotation);
  $(document).ready(loginBackgrounds);
  $(document).ready(showHideButton);
  $(document).ready(olderLogsButton);
  $(document).ready(editionsChange);
  $(document).ready(clickRadios);
  $(document).ready(disableSels);
  $(document).ready(bindTooltips);
  $(document).ready(initDP);

  $(window).resize(setWH);
  $(window).focus(startHomeBannersRotation);
  $(window).blur(stopHomeBannersRotation);
