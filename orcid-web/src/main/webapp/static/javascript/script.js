/*
 * =============================================================================
 *
 * ORCID (R) Open Source
 * http://orcid.org
 *
 * Copyright (c) 2012-2014 ORCID, Inc.
 * Licensed under an MIT-Style License (MIT)
 * http://orcid.org/open-source-license
 *
 * This copyright and license information (including a link to the full license)
 * shall be included in its entirety in all copies or substantial portion of
 * the software.
 *
 * =============================================================================
 */

/*
 * 1 - Utility functions 
 */

function scriptTmpl(elemId) {
    var elt = document.getElementById( elemId );
    var viewdef = "";
    if (elt && elt.getAttribute('type') == 'text/ng-template') {
        viewdef = elt.textContent;
    }
    viewdef.toString();
    return viewdef;
}

var enableRightToLeft = function(){
    var rightToLeftLang = ["rl", "ar"];
    var currentLanguage = lang;

    document.getElementsByTagName('html')[0].setAttribute('lang', currentLanguage); //Update the lang attribute on the htmfl tag, this was missing.

    if( rightToLeftLang.indexOf( currentLanguage ) >= 0 ){
        document.body.className += " lang-rl"; //Add class that display right to left for selected languages
    }
}

window.onload = function() {
    enableRightToLeft();
};

function openImportWizardUrl(url) {
    var win = window.open(url, "_target");
    setTimeout( function() {
        if(!win || win.outerHeight === 0) {
            //First Checking Condition Works For IE & Firefox
            //Second Checking Condition Works For Chrome
            window.location.href = url;
        }
    }, 250);
    $.colorbox.close();
}

function contains(arr, obj) {
    var index = arr.length;
    while (index--) {
       if (arr[index] === obj) {
           return true;
       }
    }
    return false;
}

function getScripts(scripts, callback) {
    var progress = 0;
    var internalCallback = function () {        
        if (++progress == scripts.length - 1) {
            callback();
        }
    };    
    scripts.forEach(function(script) {        
        $.getScript(script, internalCallback);        
    });
}

function fixZindexIE7(target, zindex){
    if(isIE() == 7){
        $(target).each(function(){
            $(this).css('z-index', zindex);
            --zindex;
        });
    }
}

function emptyTextField(field) {
    if (field != null
        && field.value != null
        && field.value.trim() != '') {
        return false;
    }
    return true;
}

function addComma(str) {
    if (str.length > 0) return str + ', ';
    return str;
}

//Needs refactor for dw object
function removeBadContributors(dw) {
    for (var idx in dw.contributors) {
        if (dw.contributors[idx].contributorSequence == null
            && dw.contributors[idx].email == null
            && dw.contributors[idx].orcid == null
            && dw.contributors[idx].creditName == null
            && dw.contributors[idx].contributorRole == null
            && dw.contributors[idx].creditNameVisibility == null) {
                dw.contributors.splice(idx,1);
            }
    }
}

function isEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function isOrcid(orcid) {
    var orcidId = /(\d{4}-){3,}\d{3}[\dX]/;
    var orcidUrl = /(http|https):\/\/([^\/]*orcid\.org|localhost.*\/orcid-web)\/(\d{4}-){3,}\d{3}[\dX]/;    
    return orcidId.test(orcid) || orcidUrl.test(orcid);
}


function getParameterByName(name) {
    var name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


//IE7 hack
if (!(window.console && console.log)) {
    console = {
        log : function() {
        },
        debug : function() {
        },
        info : function() {
        },
        warn : function() {
        },
        error : function() {
        }
    };
};

// add number padding function
Number.prototype.pad = function(size) {
    var s = String(this);
    if (typeof (size) !== "number") {
        size = 2;
    }

    while (s.length < size) {
        s = "0" + s;
    }
    return s;
};

// add new method to string
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function(str) {
        return this.slice(0, str.length) == str;
    };
}

// add new method to string
if (typeof String.prototype.contains != 'function') {
    String.prototype.contains = function(str) {
        return this.indexOf(str) != -1;
    };
}

//add new method to escape html
if (typeof String.prototype.escapeHtml != 'function') {
    String.prototype.escapeHtml = function() {
            return this
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/\//g, '&#x2F;');
    };
}

// add new method to string
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function(str) {
        return this.slice(-str.length) == str;
    };
}

if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [], k;
        for (k in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}

if (typeof String.prototype.trim != 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

// This is to prevent IE from caching ajax request via jquery
$.ajaxSetup({
    cache : false
});

// test for touch events support and if not supported, attach .no-touch class to
// the HTML tag.
if (!("ontouchstart" in document.documentElement)) {
    document.documentElement.className += " no-touch";
}

var signinLocked = false;
function disableSignin() {
    signinLocked = true;
    $('#form-sign-in-button').prop('disabled', true);
    $('form#loginForm').attr('disabled', 'disabled');
}

function enableSignin() {
    orcidGA.gaPush(function() { 
        $('#ajax-loader').hide();
        $('form#loginForm').removeAttr('disabled');
        $('#form-sign-in-button').prop('disabled', false);
        signinLocked = false;
    }); 
}

// function for javascript cookies
var OrcidCookie = new function() {
    this.getCookie = function(c_name) {
        var i, x, y, ARRcookies = document.cookie.split(";");
        for (i = 0; i < ARRcookies.length; i++) {
            x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
            y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
            x = x.replace(/^\s+|\s+$/g, "");
            if (x == c_name) {
                return unescape(y);
            }
        }
    };

    this.setCookie = function(c_name, value, exdays) {
        var cookieDomain = getCookieDomain(window.location);
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value = escape(value)
                + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
        document.cookie = c_name + "=" + c_value + ";domain=" + cookieDomain + ";path=/";
    };
    
    this.checkIfCookiesEnabled = function() {
    	this.setCookie("cookieTest", "test", 1);
    	var result = this.getCookie("cookieTest");
    	this.setCookie("cookieTest", "test", -1);
        return result;
    };
};

var OrcidMessage = function() {
    
};

var messagesPromise = new Promise(function(resolve, reject) {
    if(messages == null) {
        $.ajax({
            url : getBaseUri() + '/messages.json',
            type : 'GET',
            dataType: 'text',
            contentType: "application/json",            
            success : function(data) {     
                var data = JSON.parse(data);
                messages = data['messages'];  
                resolve();
            }
        }).fail(
        // detects server is down or CSRF mismatches
        // do to session expiration or server bounces
        function(e) {
            console.log("error fetching javascript messages");
            console.log(e);
            reject();
        });
    } else {
        resolve();
    }
});    

OrcidMessage.prototype.get = function(name) {
    return messages[name];
};

OrcidMessage.prototype.process = function(name) {
    return messagesPromise;
};

var messages = null;
var om = new OrcidMessage();

/*
 * every 15 seconds check and make sure the user is logged in. This should keep
 * their session going and if they get logged out (server restart ect...) it
 * will redir them to the signin page.
 */
function logAjaxError(e){
    /*console.log("status: " + e.status);
    console.log("statusText: " + e.statusText);
    console.log("readyState: " + e.readyState);
    console.log("responseText: " + e.responseText);*/
}

function getBaseUri() {    
    var uri = location.protocol + '//' + location.host
    if(window.location.host.startsWith('localhost:8443') | window.location.host.startsWith('localhost:8080')) {
        uri = uri + '/orcid-web';        
    }    
    return uri;
}

function getBaseUriHttps() {    
    var uri = 'https://' + location.host
    if(window.location.host.startsWith('localhost:8443') | window.location.host.startsWith('localhost:8080')) {
        uri = uri + '/orcid-web';        
    }    
    return uri;
}

function getCookieDomain(location){
        host = location.host;
        if(host.indexOf("qa.orcid.org") >= 0){
            cookieDomain = "qa.orcid.org"
        } else if(host.indexOf("localhost") >= 0){
            cookieDomain = "localhost"
        } else{
            cookieDomain = "orcid.org"
        }   
        return cookieDomain;
}

function checkOrcidLoggedIn() {	    
    if (OrcidCookie.checkIfCookiesEnabled()) {    
        if (OrcidCookie.getCookie('XSRF-TOKEN') != '') {            
            $.ajax({
                url : getBaseUriHttps() + '/userStatus.json?callback=?',
                type : 'POST',
                dataType : 'json',
                headers: {
                    'x-xsrf-token': OrcidCookie.getCookie('XSRF-TOKEN')
                },
                success : function(data) {
                    if (data.loggedIn == false && (
                        basePath.indexOf('my-orcid') > -1 || 
                        basePath.indexOf('inbox') > -1 ||
                        basePath.indexOf('account') > -1 || 
                        basePath.indexOf('manage') > -1 ||
                        basePath.indexOf('developer') > -1 || 
                        basePath.indexOf('admin-actions') > -1 ||
                        basePath.indexOf('self-service') > -1
                    )){
                        console.log("loggedOutRedir " + data);
                        window.location.href = baseUrl + "signin";
                    }
                }
            }).fail(
            // detects server is down or CSRF mismatches
            // do to session expiration or server bounces
            function(xhr, status, error) {
                console.log("error with loggin check on :"
                        + window.location.href);
                logAjaxError(xhr);
                // for some slow OAuth code redirects this is hit while 
                // people are signing in. Ingore if singing in.
                if (!signinLocked && xhr.status == 205)
                    console.log ("xhr.status is 205")
            });            
        }
    }
}

var OM = OrcidMessage;

/*******************************************************************************
 * used for triming org.orcid.pojo.ajaxForm.Text trim the value if it has spaces
 */
function trimAjaxFormText(pojoMember) {
    if (pojoMember != null
            && pojoMember.value != null
            && (pojoMember.value.charAt(0) == ' ' || pojoMember.value
                    .charAt(pojoMember.value.length - 1) == ' '))
        pojoMember.value = pojoMember.value.trim();
}

function logOffReload(reload_param) {
    $.ajax({
        url : baseUrl + 'userStatus.json?logUserOut=true',
        type : 'GET',
        dataType : 'json',
        success : function(data) {
            if (reload_param != null) {
                window.location = window.location.href + '#' + reload_param;
            }
            window.location.reload();
        }
    }).fail(function() {
        // something bad is happening!
        console.log("Error with log out");
        logAjaxError(e);
        window.location.reload();
    });
};

// jquery ready
$(function() {
    
    // Common
    window.baseUrl = getBaseUri() + '/';
    window.basePath = window.location.pathname;

    // fire off  check, if this page wasn't loaded via iframe (or html5
    // foo)
    if (location == parent.location && !$("#error-page").length) {
        checkOrcidLoggedIn();
        setInterval(checkOrcidLoggedIn, 30000);
    }

    // track when deactived people are pushed to signin page
    if (window.location.href.endsWith("signin#deactivated")) {
        messagesPromise.then(function() {
            showLoginError(om.get('orcid.frontend.security.orcid_deactivated'));
        });        
    }

    var uaParser = new UAParser()
    var uaResult = uaParser.getResult()
    

    // The following regexp is auto generated on the orcid-angular app
    // And should be maintained by replacing it for the most recently updated version on 
    // https://github.com/ORCID/orcid-angular/tree/master/src/app/cdk/platform-info/browserlist.regexp.ts
    var BROWSERLIST_REGEXP = /((CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(13[_\.]2|13[_\.]([3-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})[_\.]\d+)(?:[_\.]\d+)?)|(Edge\/(80|(8[1-9]|9\d|\d{3,}))(?:\.\d+)?)|(HeadlessChrome((?:\/80\.\d+\.\d+)?|(?:\/(8[1-9]|9\d|\d{3,})\.\d+\.\d+)?))|((Chromium|Chrome)\/(80|(8[1-9]|9\d|\d{3,}))\.\d+(?:\.\d+)?)|(Version\/(12\.1|12\.([2-9]|\d{2,})|(1[3-9]|[2-9]\d|\d{3,})\.\d+|13\.0|13\.([1-9]|\d{2,})|(1[4-9]|[2-9]\d|\d{3,})\.\d+)(?:\.\d+)? Safari\/)|(Trident\/7\.0)|(Firefox\/(68|(69|[7-9]\d|\d{3,})|75|(7[6-9]|[8-9]\d|\d{3,}))\.\d+\.\d+)|(Firefox\/(68|(69|[7-9]\d|\d{3,})|75|(7[6-9]|[8-9]\d|\d{3,}))\.\d+(pre|[ab]\d+[a-z]*)?)|(([MS]?IE) (11|(1[2-9]|[2-9]\d|\d{3,}))\.\d+)/
    var oldBrowserFlag = false;
    if (!BROWSERLIST_REGEXP.test(navigator.userAgent)) {
        oldBrowserFlag = true
    }

    if (oldBrowserFlag && location == parent.location) {

            messagesPromise.then(function() {
                var wHtml = '<div class="alert alert-banner" id="browser-warn-div">';
                wHtml = wHtml + '<p>';
                wHtml = wHtml + om.get('common.old.browser_1');
                wHtml = wHtml + om.get('common.old_browser_2');
                wHtml = wHtml + ' <a href="https://support.orcid.org/hc/en-us/articles/360006895074" target="common.old_browser_2">' + om.get('common.old_browser_3') + '</a>';
                wHtml = wHtml + '</p>';
                wHtml = wHtml + '</div>';
                $('body').prepend(wHtml);
                       
            });            
        
    }
    
    $(document)
            .on('submit', 'form#loginForm',

                    function() {
                        var loginUrl = baseUrl + 'signin/auth.json';
                        window.angularComponentReference.zone.run(function() { 
                            var gaString = window.angularComponentReference.component.gaString
                            if (signinLocked) return false;
                            disableSignin();
                            
                            if (basePath.startsWith('/shibboleth/') || basePath.startsWith('/orcid-web/shibboleth/')) {
                                loginUrl = baseUrl + 'shibboleth/signin/auth.json';
                            }
                            else if (basePath.startsWith('/social/') || basePath.startsWith('/orcid-web/social/')) {
                                loginUrl = baseUrl + 'social/signin/auth.json';
                            }

                            $('#login-error-mess, #login-deactivated-error').hide();
                            $('#ajax-loader').css('display', 'block');
                            $
                                    .ajax(
                                            {
                                                url : loginUrl,
                                                type : 'POST',
                                                data : 'userId=' + encodeURIComponent(orcidLoginFitler($('input[name=userId]').val())) + '&password=' + encodeURIComponent($('input[name=password]').val()) + '&verificationCode=' + encodeURIComponent($('input[name=verificationCode]').val())  + '&recoveryCode=' + encodeURIComponent($('input[name=recoveryCode]').val()) + '&oauthRequest=' + encodeURIComponent($('input[name=oauthRequest]').val()),
                                                dataType : 'json',
                                                success : function(data) {
                                                    if (data.success) {
                                                        if (gaString) {

                                                            orcidGA
                                                                    .gaPush([
                                                                            'send',
                                                                            'event',
                                                                            'RegGrowth',
                                                                            'Sign-In',
                                                                            'OAuth '
                                                                                    + gaString ]);
                                                        } else
                                                            orcidGA.gaPush([
                                                                    'send',
                                                                    'event',
                                                                    'RegGrowth',
                                                                    'Sign-In',
                                                                    'Website' ]);
                                                        orcidGA
                                                                .windowLocationHrefDelay(data.url
                                                                        + window.location.hash);
                                                    } else if (data.verificationCodeRequired && !data.badVerificationCode) {
                                                        enableSignin(); 
                                                        show2FA();
                                                    } else {
                                                        enableSignin(); 
                                                        var message;
                                                        if (data.deprecated) {                                                                                                               
                                                            messagesPromise.then(function() {
                                                                if (data.primary)
                                                                    message = om.get('orcid.frontend.security.deprecated_with_primary')
                                                                            .replace("{{primary}}",data.primary);
                                                                else
                                                                    message = om.get('orcid.frontend.security.deprecated');
                                                                showLoginError(message);
                                                            });
                                                        } else if (data.disabled) {
                                                                showLoginDeactivatedError();
                                                                return;
                                                        } else if (data.unclaimed) {                                                        
                                                            messagesPromise.then(function() {
                                                                        var resendClaimUrl = baseUrl + "resend-claim";
                                                                        var userId = $(
                                                                                '#userId')
                                                                                .val();
                                                                        if (userId
                                                                                .indexOf('@') != -1) {
                                                                            resendClaimUrl += '?email='
                                                                                + encodeURIComponent(userId);
                                                                        }
                                                                        message = om
                                                                                .get(
                                                                                        'orcid.frontend.security.unclaimed_exists_1');
                                                                        message = message + '<a href="' + resendClaimUrl + '">';
                                                                        message = message + om.get('orcid.frontend.security.unclaimed_exists_2');
                                                                        message = message + '</a>';
                                                                        message = message + om.get('orcid.frontend.security.unclaimed_exists_3');
                                                                        showLoginError(message);
                                                                        });
                                                        } else if (data.badVerificationCode) {
                                                            messagesPromise.then(function() {
                                                                showLoginError(om.get('orcid.frontend.security.2fa.bad_verification_code'));
                                                                show2FA();
                                                                });
                                                        } else if (data.badRecoveryCode) {
                                                            messagesPromise.then(function() {
                                                                showLoginError(om.get('orcid.frontend.security.2fa.bad_recovery_code'));
                                                                });
                                                        } else if(data.invalidUserType) {
                                                            messagesPromise.then(function() {
                                                                message = om.get('orcid.frontend.security.invalid_user_type_1');
                                                                message = message + ' <a href="https://support.orcid.org/hc/en-us/requests/new">';
                                                                message = message + om.get('orcid.frontend.security.invalid_user_type_2');
                                                                message = message + '</a>';
                                                                showLoginError(message);
                                                            });                                                        
                                                        } else {
                                                            messagesPromise.then(function() {
                                                                showLoginError(om.get('orcid.frontend.security.bad_credentials'));
                                                                });
                                                        }
                                                    }; 
                                                }
                                            }).fail(function(e) {
                                        // something bad is happening!
                                        console.log("Error with log in");
                                        logAjaxError(e);
                                        window.location.reload();
                                    });
                            return false;
                        })
                    });
    
    $('.delete-url').on('click', function(e) {
        e.preventDefault();
        $(this).closest('p').fadeOut(300, function() {
            $(this).closest('p').remove();
        });
    });

    function orcidLoginFitler(userId) {
    	var orcidPattern = /(\d{4}[- ]{0,}){3}\d{3}[\dX]/;
    	var extId = orcidPattern.exec(userId);
    	if(extId != null) {
    		userId = extId[0].toString().replace(/ /g, '');
    		userId = userId.toString().replace(/-/g, '');
    		var temp = userId.toString().replace(/(.{4})/g, "$1-");
    		var length = temp.length;
    		userId = temp.substring(0, length - 1);
    	}
    	return userId;
    }
    
    var hideThing = function(e, selector, className) {
        var p = $(selector + "." + className);
        if (p.length == 0) {
            return;
        }
        if (!$.contains(p.get(0), e.target)) {
            p.removeClass(className);
        }
    };
    
    function showLoginError(message) {
        if ($('form#loginForm #loginErrors #login-error-mess, form#loginForm #loginErrors #login-deactivated-error:visible').length == 0) {
             $(
                "<div class='orcid-error' id='login-error-mess'  role='alert'>"
                        + message
                        + "</div>")
                .hide()
                .appendTo(
                        'form#loginForm #loginErrors')
                .fadeIn('fast');
        } 
        else {
             $(
             'form#loginForm #loginErrors #login-error-mess, form#loginForm #loginErrors #login-deactivated-error:visible')
             .fadeOut(
                    'fast',
                     function() {
                        $('form#loginForm #loginErrors #login-error-mess').html(message);
                         $(
                                 $('form#loginForm #login-error-mess'))
                                 .fadeIn(
                                         'fast');
                     });
        }
    }
    
    function showLoginDeactivatedError() {
        window.angularComponentReference.zone.run(
            function(){
                window.angularComponentReference.showDeactivationError(); 
                
            }

        );
        if ($('form#loginForm #login-error-mess').length == 0) {
            $('form#loginForm #login-deactivated-error').fadeIn('fast');
        } else {
             $('form#loginForm #login-error-mess')
             .fadeOut(
                'fast',
                 function() {
                    $('form#loginForm #login-deactivated-error').fadeIn('fast');
                 }
             );
        }
    }

    function show2FA() {
        $('#verificationCodeFor2FA').attr("style", "display: block");
        $('#verificationCode').focus();
        $('#RequestPasswordResetCtr').hide();
        $('#2FAInstructions').show();
        $('#enterRecoveryCode').click(function() {
           $('#recoveryCodeSignin').show(); 
        });
        
        messagesPromise.then(function() {
            $('#form-sign-in-button').html(om.get('orcid.frontend.security.2fa.authenticate'));                        
            });
    }

    // Privacy toggle

    $('body').on('mousedown', function(e) {
        hideThing(e, '.privacy-group', 'open');
        hideThing(e, '.popover', 'show');
    });

    $('body').on('mousedown', function(e) {
        hideThing(e, '.privacy-group', 'open');
        hideThing(e, '.popover', 'show');
    });

    var btnClassR = /(btn-\w+)/;

    var getBtnClass = function(el) {
        var r = btnClassR.exec(el.className);
        return (r ? r[0] : "");
    };

    function privacyBind() {

        $('.privacy-group').each(
                function(i, el) {
                    var $el = $(el), current = "", toggle = $el
                            .find('.privacy-toggle');
                    $el.on('click', '.privacy-toggle', function(e) {
                        e.preventDefault();
                        if ($el.hasClass('open')) {
                            return $el.removeClass('open');
                        }
                        $('.privacy-group.open').removeClass('open');
                        current = getBtnClass(this);
                        $el.toggleClass('open');
                    });
                    $el.on('click', '.btn-privacy', function(e) {
                        e.preventDefault();
                        var f = toggle.closest('form');
                        var s;
                        var priAct = $(this).attr('href').replace("#", "");
                        if (f.length
                                && (f.attr('action') == 'save-current-works')) {
                            s = $('select', toggle.closest('label'));
                            s.val(priAct);
                            showChangeMessage();
                            $el.removeClass('open');
                            toggle.removeClass(current).addClass(
                                    getBtnClass(this));
                            toggle.html($(this).html());
                        } else {
                            var s = toggle.closest('.privacy-tool').prev(
                                    '.visibility-lbl').find('select');
                            if (s.length) {
                                s.val(priAct);
                            }
                            toggle.removeClass(current).addClass(
                                    getBtnClass(this));
                            toggle.html($(this).html());
                            $el.removeClass('open');
                        }
                    });
                });

    }

    privacyBind();

    var passwordStrengthContainer = $(".password-strength");
    if (typeof passwordStrength !== 'undefined') {
        var ps = passwordStrengthContainer.passStrength();
        ps.on('keyup', function(e) {
            if ((location != parent.location) && !this.changed) {
                var i = $('.popover.show iframe', parent.document);
                i.height(i.contents().height());
                this.changed = 1;
            }
        });
    }

    // Manage

    // Popovers
    if (parent !== window) {
        if (typeof parent.$ !== 'undefined') {
            var popover = parent.$('.popover-large:visible');
            if (popover.length) {
                popover.find('iframe').height($('body').outerHeight());
            }
        }
    }

    // Workspace

    // lightboxes

    $('.colorbox').colorbox();

    top.colorOnCloseBoxDest = top.location;

    $('.btn-update:not(.no-icon), .update, #update-personal-modal-link')
            .colorbox({
                iframe : true,
                scrolling : true,
                height : function() {
                    isMobile() ? heightsize = 1150 : heightsize = 600;
                    return heightsize;
                },
                width : 990,
                close : '',
                onClosed : function() {
                    top.location = top.colorOnCloseBoxDest;
                }
            });

    $('.colorbox-modal').colorbox({
        inline : true,
        close : 'x'
    });

    $('body').on('click', '.colorbox-close', function(e) {
        $.colorbox.close();
    });

    if ($('#loginForm').length && (window.location != window.parent.location)) {
        window.parent.location.reload();
    }

    $('.close-button').on('click', function(e) {
        parent.location.reload();
    });

    $('.colorbox-add').colorbox({
        height : 400,
        href : baseUrl + "account/search-for-delegates #add-an-individual"
    });

    // delgates
    $('#searchForDelegatesForm').on(
            'submit',
            function(e) {
                e.preventDefault();
                console.log($(this).serialize(), baseUrl
                        + 'manage/search-for-delegates')
                $.post(baseUrl + 'manage/search-for-delegates', $(this)
                        .serialize(), function(data) {
                    $('#searchResults').html(data);
                });
            });
    
    // set of functions to track colorbox complete for automated testing
    window.cbox_complete = false;
    // traditional tracker
    $(document).bind("cbox_complete", function(){
       window.cbox_complete = true;
    });
    // traditional tracker
    $(document).bind("cbox_open", function(){
       window.cbox_complete = false;
    });
    // traditional tracker
    $(document).bind("cbox_closed", function(){
       window.cbox_complete = false;
    });
    
});

/* START: Bibjson to work AjaxForm */
/*
 * { "errors":[], "publicationDate": {
 * "errors":[],"month":"","day":"","year":"","required":true,"getRequiredMessage":null},
 * "visibility":"LIMITED","putCode":null, "shortDescription":{
 * "errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "url":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "journalTitle":{"errors":[],"value":null,"required":false,"getRequiredMessage":null},
 * "languageCode":{"errors":[],"value":null,"required":false,"getRequiredMessage":null},
 * "languageName":{"errors":[],"value":null,"required":false,"getRequiredMessage":null},
 * "citation":{"errors":[],"citation":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "citationType":{"errors":[],"value":"formatted-unspecified","required":true,"getRequiredMessage":null},"required":true,"getRequiredMessage":null},
 * "countryCode":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "countryName":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "contributors":[{"errors":[],"contributorSequence":{"errors":[],"value":"","required":true,"getRequiredMessage":null},"email":null,"orcid":null,"uri":null,"creditName":null,"contributorRole":{"errors":[],"value":"","required":true,"getRequiredMessage":null}}],
 * "workExternalIdentifiers":[ { "errors":[],
 * "externalIdentifierId":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "externalIdentifierType":{"errors":[],"value":"","required":true,"getRequiredMessage":null}
 * }], "source":null, "sourceName":null,
 * "title":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "subtitle":{"errors":[],"value":null,"required":true,"getRequiredMessage":null},
 * "translatedTitle":{"errors":[],"content":"","languageCode":"","languageName":"","required":false,"getRequiredMessage":null},
 * "workCategory":{"errors":[],"value":"","required":true,"getRequiredMessage":null},
 * "workType":{"errors":[],"value":"","required":true,"getRequiredMessage":null},"dateSortString":null}
 */

var bibMonths = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

var bibToWorkTypeMap = {};
bibToWorkTypeMap['article'] = [ 'publication', 'journal-article' ];
bibToWorkTypeMap['book'] = [ 'publication', 'book' ];
bibToWorkTypeMap['booklet'] = [ 'other_output', 'other' ];
bibToWorkTypeMap['conference'] = [ 'conference', 'conference-paper' ];
bibToWorkTypeMap['inbook'] = [ 'publication', 'book-chapter' ];
bibToWorkTypeMap['incollection'] = [ 'publication', 'book-chapter' ];
bibToWorkTypeMap['inproceedings'] = [ 'conference', 'conference-paper' ];
bibToWorkTypeMap['manual'] = [ 'publication', 'manual' ];
bibToWorkTypeMap['mastersthesis'] = [ 'publication',
        'supervised-student-publication' ];
bibToWorkTypeMap['misc'] = [ 'other_output', 'other' ];
bibToWorkTypeMap['phdthesis'] = [ 'publication', 'dissertation-thesis'  ];
bibToWorkTypeMap['proceedings'] = [ 'conference', 'conference-paper' ];
bibToWorkTypeMap['techreport'] = [ 'publication', 'report' ];
bibToWorkTypeMap['unpublished'] = [ 'other_output', 'other' ];

function externalIdentifierId(work, idType, value) {
	
    if(!value) {
        console.warn("Empty value for ext id: " + idType);
        return;
    }
    
    //Define relationship type based on work type
	var relationship = 'self';
	if(idType === 'issn') {
		if(work.workType.value != 'book') {
			relationship = 'part-of';
		}
	} else if(idType === 'isbn') {
	    var isbnWorkSelfWorkTypes = ['book','manual','report','other_output'];
		if(isbnWorkSelfWorkTypes.indexOf(work.workType.value) < 0) {
			relationship = 'part-of';
		}
	} 

    var ident = {
        externalIdentifierId : {
            'value' : value
        },
        externalIdentifierType : {
            'value' : idType
        }, 
        relationship : {
        	'value' : relationship
        }
    };
    
    if (work.workExternalIdentifiers[0].externalIdentifierId.value == null)
        work.workExternalIdentifiers[0] = ident;
    // Only adds the url if there is no other identifier
    else if ( idType !== "uri" ) {
        work.workExternalIdentifiers.push(ident);
    }
};

function populateWorkAjaxForm(bibJson, work) {

    // get the bibtex back put it in the citation field
    var bibtex = bibtexParse.toBibtex([ bibJson ]);
    work.citation = {'citation': {'value': bibtex},'citationType': {'value': 'bibtex'}}
    
    // set the work type based off the entry type    
    if (bibJson.entryType) {

        var type = bibJson.entryType.toLowerCase();

        if (bibToWorkTypeMap.hasOwnProperty(type)) {
            work.workCategory.value = latexParseJs.decodeLatex(bibToWorkTypeMap[type][0]);
            work.workType.value = bibToWorkTypeMap[type][1];
        }
    }

    // tags we mapped
    if (bibJson.entryTags) {
        // create a lower case create a reference map
        var tags = bibJson.entryTags;
        var lowerKeyTags = {};
        for (key in tags)
            lowerKeyTags[key.toLowerCase()] = tags[key];

        if (lowerKeyTags.hasOwnProperty('booktitle'))
            if (!lowerKeyTags.hasOwnProperty('title'))
                work.title.value = latexParseJs.decodeLatex(lowerKeyTags['booktitle']);
            else if (!lowerKeyTags.hasOwnProperty('journal'))
                work.journalTitle.value = latexParseJs.decodeLatex(lowerKeyTags['booktitle']);

        if (lowerKeyTags.hasOwnProperty('doi'))
            externalIdentifierId(work, 'doi', lowerKeyTags['doi']);
        
        if (lowerKeyTags.hasOwnProperty('pmid'))
            externalIdentifierId(work, 'pmid', lowerKeyTags['pmid']);
        
        if (lowerKeyTags.hasOwnProperty('eprint')
                && lowerKeyTags.hasOwnProperty('eprinttype') && lowerKeyTags['eprinttype']=='arxiv')
            externalIdentifierId(work, 'arxiv', tags['eprint']);
        
        if (lowerKeyTags.hasOwnProperty('isbn'))
            externalIdentifierId(work, 'isbn', lowerKeyTags['isbn']);

        if (lowerKeyTags.hasOwnProperty('issn'))
            externalIdentifierId(work, 'issn', lowerKeyTags['issn']);
        
        // pissn, eissn and lissn are all issn's
        if(lowerKeyTags.hasOwnProperty('pissn'))
            externalIdentifierId(work, 'issn', lowerKeyTags['pissn']);

        if(lowerKeyTags.hasOwnProperty('eissn'))
            externalIdentifierId(work, 'issn', lowerKeyTags['eissn']);
        
        if(lowerKeyTags.hasOwnProperty('lissn'))
            externalIdentifierId(work, 'issn', lowerKeyTags['lissn']);
                
        if (lowerKeyTags.hasOwnProperty('url'))
            externalIdentifierId(work, 'uri', lowerKeyTags['url']);

        if (lowerKeyTags.hasOwnProperty('journal'))
            work.journalTitle.value = latexParseJs.decodeLatex(lowerKeyTags['journal']);

        if (lowerKeyTags.hasOwnProperty('title'))
            work.title.value = latexParseJs.decodeLatex(lowerKeyTags['title']);

        if (lowerKeyTags.hasOwnProperty('year'))
            if (!isNaN(lowerKeyTags['year']))
                work.publicationDate.year = lowerKeyTags['year'].trim();

        if (lowerKeyTags.hasOwnProperty('month')) {
            var month = lowerKeyTags['month'].trim();
            if (bibMonths.indexOf(month.trim().substring(0,3)) >= 0) 
                month = bibMonths.indexOf(month.trim().substring(0,3)) + 1;
            if (!isNaN(month) && month > 0 && month <= 12)
                work.publicationDate.month = Number(month).pad(2);
        }

        if (lowerKeyTags.hasOwnProperty('url'))
            work.url.value = lowerKeyTags['url'];

    }
    return work;
};

/* start bibtexParse 0.0.24 */

//Original work by Henrik Muehe (c) 2010
//
//CommonJS port by Mikola Lysenko 2013
//
//Port to Browser lib by ORCID / RCPETERS
//
//Issues:
//no comment handling within strings
//no string concatenation
//no variable values yet
//Grammar implemented here:
//bibtex -> (string | preamble | comment | entry)*;
//string -> '@STRING' '{' key_equals_value '}';
//preamble -> '@PREAMBLE' '{' value '}';
//comment -> '@COMMENT' '{' value '}';
//entry -> '@' key '{' key ',' key_value_list '}';
//key_value_list -> key_equals_value (',' key_equals_value)*;
//key_equals_value -> key '=' value;
//value -> value_quotes | value_braces | key;
//value_quotes -> '"' .*? '"'; // not quite
//value_braces -> '{' .*? '"'; // not quite
(function(exports) {

  function BibtexParser() {

      this.months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      this.notKey = [',','{','}',' ','='];
      this.pos = 0;
      this.input = "";
      this.entries = new Array();
      this.errors = new Array();
      this.currentEntry = "";

      this.addError = function(e) {
          this.errors.push(e);
      };

      this.setInput = function(t) {
          this.input = t;
      };

      this.getEntries = function() {
          return this.entries;
      };

      this.isWhitespace = function(s) {
          return (s == ' ' || s == '\r' || s == '\t' || s == '\n');
      };

      this.match = function(s, canCommentOut) {
          if (canCommentOut == undefined || canCommentOut == null)
              canCommentOut = true;
          this.skipWhitespace(canCommentOut);
          if (this.input.substring(this.pos, this.pos + s.length) == s) {
              this.pos += s.length;
          } else {
              throw "Token mismatch, expected " + s + ", found ";
          };
          this.skipWhitespace(canCommentOut);
      };

      this.tryMatch = function(s, canCommentOut) {
          if (canCommentOut == undefined || canCommentOut == null)
              canCommentOut = true;
          this.skipWhitespace(canCommentOut);
          if (this.input.substring(this.pos, this.pos + s.length) == s) {
              return true;
          } else {
              return false;
          };
          this.skipWhitespace(canCommentOut);
      };

      /* when search for a match all text can be ignored, not just white space */
      this.matchAt = function() {
          while (this.input.length > this.pos && this.input[this.pos] != '@') {
              this.pos++;
          };

          if (this.input[this.pos] == '@') {
              return true;
          };
          return false;
      };

      this.skipWhitespace = function(canCommentOut) {
          while (this.isWhitespace(this.input[this.pos])) {
              this.pos++;
          };
          if (this.input[this.pos] == "%" && canCommentOut == true) {
              while ((this.input[this.pos] != ("\n" || "\r")) && this.pos < this.input.length) {
                  this.pos++;
              };
              this.skipWhitespace(canCommentOut);
          };
      };

      this.value_braces = function() {
          var bracecount = 0;
          this.match("{", false);
          var start = this.pos;
          var escaped = false;
          while (true) {
              if (!escaped) {
                  if (this.input[this.pos] == '}') {
                      if (bracecount > 0) {
                          bracecount--;
                      } else {
                          var end = this.pos;
                          this.match("}", false);
                          return this.input.substring(start, end);
                      };
                  } else if (this.input[this.pos] == '{') {
                      bracecount++;
                  } else if (this.pos >= this.input.length - 1) {
                      throw "Closing } character missing";
                  };
              };
              if (this.input[this.pos] == '\\' && escaped == false)
                  escaped = true;
              else
                  escaped = false;
              this.pos++;
          };
      };

      this.value_comment = function() {
          var str = '';
          var brcktCnt = 0;
          while (!(this.tryMatch("}", false) && brcktCnt == 0)) {
              str = str + this.input[this.pos];
              if (this.input[this.pos] == '{')
                  brcktCnt++;
              if (this.input[this.pos] == '}')
                  brcktCnt--;
              if (this.pos >= this.input.length - 1) {
                  throw "Closing } character missing";
              };
              this.pos++;
          };
          return str;
      };

      this.value_quotes = function() {
          this.match('"', false);
          var start = this.pos;
          var escaped = false;
          while (true) {
              if (!escaped) {
                  if (this.input[this.pos] == '"') {
                      var end = this.pos;
                      this.match('"', false);
                      return this.input.substring(start, end);
                  } else if (this.pos >= this.input.length - 1) {
                      throw "Closing \" character missing";
                  };
              }
              if (this.input[this.pos] == '\\' && escaped == false)
                  escaped = true;
              else
                  escaped = false;
              this.pos++;
          };
      };

      this.single_value = function() {
          var start = this.pos;
          if (this.tryMatch("{")) {
              return this.value_braces();
          } else if (this.tryMatch('"')) {
              return this.value_quotes();
          } else {
              var k = this.key();
              if (k.match("^[0-9]+$"))
                  return k;
              else if (this.months.indexOf(k.toLowerCase()) >= 0)
                  return k.toLowerCase();
              else
                  throw "Value missing for field";

          };
      };

      this.value = function() {
          var values = [];
          values.push(this.single_value());
          while (this.tryMatch("#")) {
              this.match("#");
              values.push(this.single_value());
          };
          return values.join("");
      };

      this.key = function(optional) {
          var start = this.pos;
          while (true) {
              if (this.pos >= this.input.length) {
                  throw "Runaway key";
              };
                              // ??-????-?? is Cyrillic
              if (this.notKey.indexOf(this.input[this.pos]) >= 0) {
                  if (optional && this.input[this.pos] != ',') {
                      this.pos = start;
                      return null;
                  };
                  return this.input.substring(start, this.pos);
              } else {
                  this.pos++;

              };
          };
      };

      this.key_equals_value = function() {
          var key = this.key();
          if (this.tryMatch("=")) {
              this.match("=");
              var val = this.value();
              key = key.trim()
              return [ key, val ];
          } else {
              throw "Value missing for field " + key;
          };
      };

      this.key_value_list = function() {
          var kv = this.key_equals_value();
          this.currentEntry['entryTags'] = {};
          this.currentEntry['entryTags'][kv[0]] = kv[1];
          while (this.tryMatch(",")) {
              this.match(",");
              // fixes problems with commas at the end of a list
              if (this.tryMatch("}")) {
                  break;
              }
              ;
              kv = this.key_equals_value();
              this.currentEntry['entryTags'][kv[0]] = kv[1];
          };
      };

      this.entry_body = function(d) {
          this.currentEntry = {};
          this.currentEntry['citationKey'] = this.key(true);
          this.currentEntry['entryType'] = d.substring(1);
          if (this.currentEntry['citationKey'] != null) {
              this.match(",");
          }
          this.key_value_list();
          this.entries.push(this.currentEntry);
      };

      this.directive = function() {
          this.match("@");
          return "@" + this.key();
      };

      this.preamble = function() {
          this.currentEntry = {};
          this.currentEntry['entryType'] = 'PREAMBLE';
          this.currentEntry['entry'] = this.value_comment();
          this.entries.push(this.currentEntry);
      };

      this.comment = function() {
          this.currentEntry = {};
          this.currentEntry['entryType'] = 'COMMENT';
          this.currentEntry['entry'] = this.value_comment();
          this.entries.push(this.currentEntry);
      };

      this.entry = function(d) {
          this.entry_body(d);
      };

      this.alernativeCitationKey = function () {
          this.entries.forEach(function (entry) {
              if (!entry.citationKey && entry.entryTags) {
                  entry.citationKey = '';
                  if (entry.entryTags.author) {
                      entry.citationKey += entry.entryTags.author.split(',')[0] += ', ';
                  }
                  entry.citationKey += entry.entryTags.year;
              }
          });
      }

      this.bibtex = function() {
          while (this.matchAt()) {
              var d = this.directive();
              this.match("{");
              if (d.toUpperCase() == "@STRING") {
                  this.string();
              } else if (d.toUpperCase() == "@PREAMBLE") {
                  this.preamble();
              } else if (d.toUpperCase() == "@COMMENT") {
                  this.comment();
              } else {
                  this.entry(d);
              }
              this.match("}");
          };

          this.alernativeCitationKey();
      };
  };

  exports.toJSON = function(bibtex) {
      var b = new BibtexParser();
      b.setInput(bibtex);
      if (b.tryMatch("@")){
        try {
            b.bibtex();
            return b.entries;
        } catch (e) {
            var citationKey="";
            if (b.currentEntry['citationKey']){
                citationKey = " " + b.currentEntry['citationKey'];
            }
            return "Error parsing Bibtex in entry " + (b.entries.length+1) + citationKey + " near text '" + b.input.substring(b.pos-20, b.pos) + "'. " + e; 
        }  
      } else {
        return "Error parsing Bibtex. No Bibtex entries found in file"
      }
       
  };

  /* added during hackathon don't hate on me */
  exports.toBibtex = function(json) {
      var out = '';
      for ( var i in json) {
          out += "@" + json[i].entryType;
          out += '{';
          if (json[i].citationKey)
              out += json[i].citationKey + ', ';
          if (json[i].entry)
              out += json[i].entry ;
          if (json[i].entryTags) {
              var tags = '';
              for (var jdx in json[i].entryTags) {
                  if (tags.length != 0)
                      tags += ', ';
                  tags += jdx + '= {' + json[i].entryTags[jdx] + '}';
              }
              out += tags;
          }
          out += '}\n\n';
      }
      return out;

  };

})(typeof exports === 'undefined' ? this['bibtexParse'] = {} : exports);

/* end bibtexParse */

/* start latexJs 0.0.0 */

//complete rubish, please avoid 

(function(exports) {

 
 function LatexToUTF8 () {
     this.orcidCharLatexMap = {
     };

     this.orcidLatexCharMap = {
     "\\`A": "??", // begin grave
     "\\`E": "??",
     "\\`I": "??",
     "\\`O": "??",
     "\\`U": "??",
     "\\`a": "??",
     "\\`e": "??",
     "\\`i": "??",
     "\\`o": "??",
     "\\`u": "??",
     "\\\'A": "??", // begin acute
     "\\\'E": "??",
     "\\\'I": "??",
     "\\\'O": "??",
     "\\\'U": "??",
     "\\\'Y": "??",
     "\\\'a": "??",
     "\\\'e": "??",
     "\\\'i": "??",
     "\\\'o": "??",
     "\\\'u": "??",
     "\\\'y": "??",
     "\\\"A": "??", // begin diaeresis
     "\\r A": "??",
     "\\\"E": "??",
     "\\\"I": "??",
     "\\\"O": "??",
     "\\\"U": "??",
     "\\\"a": "??",
     "\\r a": "??",
     "\\\"e": "??",
     "\\\"i": "??",
     "\\\"o": "??",
     "\\\"u": "??",
     "\\~A": "??", // begin tilde
     "\\~N": "??",
     "\\~O": "??",
     "\\~a": "??",
     "\\~n": "??",
     "\\~o": "??",
     "\\rU": "??", // begin ring above
     "\\ru": "??",
     "\\vC": "??",  // begin caron
     "\\vD": "??",
     "\\vE": "??",
     "\\vN": "??",
     "\\vR": "??",
     "\\vS": "??",
     "\\vT": "??",
     "\\vZ": "??",
     "\\vc": "??",
     "\\vd": "??",
     "\\ve": "??",
     "\\vn": "??",
     "\\vr": "??",
     "\\vs": "??",
     "\\vt": "??",
     "\\vz": "??",
     "\\#": "#",  // begin special symbols
     "\\$": "$",
     "\\%": "%",
     "\\&": "&",
     "\\\\": "\\",
     "\\^": "^",
     "\\_": "_",
     "\\{": "{",
     "\\}": "}",
     "\\~": "~",
     "\\\"": "\"",
     "\\\'": "???", // closing single quote
     "\\`": "???", // opening single quote
     "\\AA": "??", // begin non-ASCII letters
     "\\AE": "??",
     "\\c{C}": "??",
     "\\O": "??",
     "\\aa": "??",
     "\\c{c}": "??",
     "\\ae": "??",
     "\\o": "??",
     "\\ss": "??",
     "\\textcopyright": "??",
     "\\textellipsis": "???" ,
     "\\textemdash": "???",
     "\\textendash": "???",
     "\\textregistered": "??",
     "\\texttrademark": "???",
     "\\alpha": "??", // begin greek alphabet
     "\\beta": "??",
     "\\gamma": "??",
     "\\delta": "??",
     "\\epsilon": "??",
     "\\zeta": "??",
     "\\eta": "??",
     "\\theta": "??",
     "\\iota": "??",
     "\\kappa": "??",
     "\\lambda": "??",
     "\\mu": "??",
     "\\nu": "??",
     "\\xi": "??",
     "\\omicron": "??",
     "\\pi": "??",
     "\\rho": "??",
     "\\sigma": "??",
     "\\tau": "??",
     "\\upsilon": "??",
     "\\phi": "??",
     "\\chi": "??",
     "\\psi": "??",
     "\\omega": "??",
     "\\=A": "??",
     "\\=a": "??",
     "\\u{A}": "??",
     "\\u{a}": "??",
     "\\k A": "??",
     "\\k a": "??",
     "\\'C": "??",
     "\\'c": "??",
     "\\^C": "??",
     "\\^c": "??",
     "\\.C": "??",
     "\\.c": "??",
     "\\v{C}": "??",
     "\\v{c}": "??",
     "\\v{D}": "??",
     "\\=E": "??",
     "\\=e": "??",
     "\\u{E}": "??",
     "\\u{e}": "??",
     "\\.E": "??",
     "\\.e": "??",
     "\\k E": "??",
     "\\k e": "??",
     "\\v{E}": "??",
     "\\v{e}": "??",
     "\\^G": "??",
     "\\^g": "??",
     "\\u{G}": "??",
     "\\u{g}": "??",
     "\\.G": "??",
     "\\.g": "??",
     "\\c{G}": "??",
     "\\c{g}": "??",
     "\\^H": "??",
     "\\^h": "??",
     "\\dH": "??",
     "\\dh": "??",
     "\\~I": "??",
     "\\~i": "??",
     "\\=I": "??",
     "\\=i": "??",
     "\\u{I}": "??",
     "\\u{i}": "??",
     "\\k I": "??",
     "\\k i": "??",
     "\\.I": "??",
     "\\^J": "??",
     "\\^j": "??",
     "\\c{J}": "??",
     "\\c{j}": "??",
     "\\'L": "??",
     "\\'l": "??",
     "\\c{L}": "??",
     "\\c{l}": "??",
     "\\v{L}": "??",
     "\\v{l}": "??",
     "\\dL": "??",
     "\\dl": "??",
     "\\'N": "??",
     "\\'n": "??",
     "\\c{N}": "??",
     "\\c{n}": "??",
     "\\v{N}": "??",
     "\\v{n}": "??",
     "\\=O": "??",
     "\\=o": "??",
     "\\u{O}": "??",
     "\\u{o}": "??",
     "\\H{O}": "??",
     "\\H{o}": "??",
     "\\OE": "??",
     "\\oe": "??",
     "\\'R": "??",
     "\\'r": "??",
     "\\c{R}": "??",
     "\\c{r}": "??",
     "\\v{R}": "??",
     "\\v{r}": "??",
     "\\'R": "??",
     "\\'r": "??",
     "\\^S": "??",
     "\\^s": "??",
     "\\c{S}": "??",
     "\\c{s}": "??",
     "\\v{S}": "??",
     "\\v{s}": "??",
     "\\c{T}": "??",
     "\\c{t}": "??",
     "\\v{T}": "??",
     "\\v{t}": "??",
     "\\dT": "??",
     "\\dt": "??",
     "\\~U": "??",
     "\\~u": "??",
     "\\=U": "??",
     "\\=u": "??",
     "\\u{U}": "??",
     "\\u{u}": "??",
     "\\r U": "??",
     "\\r u": "??",
     "\\H{U}": "??",
     "\\H{u}": "??",
     "\\k U": "??",
     "\\k u": "??",
     "\\^W": "??",
     "\\^w": "??",
     "\\^Y": "??",
     "\\^y": "??",
     "\\\"Y": "??",
     "\\'Z": "??",
     "\\'z": "??",
     "\\.Z": "??",
     "\\.z": "??",
     "\\v{Z}": "??",
     "\\v{z}": "??"
 };

     this.w3cCharLatexMap = {
     };

//Generated from http://www.w3.org/2003/entities/2007xml/unicode.xml
//Duplicate latex keys skipped (first choosen) 
//Duplicate latex keys not starting with backwardslash (\) skipped
//Decimal Charcode with dashes (-) skipped 
this.w3cLatexCharMap = {
"\\space": " ",
"\\#": "#",
"\\textdollar": "$",
"\\%": "%",
"\\&": "&",
"\\textquotesingle": "'",
"\\ast": "*",
"\\textbackslash": "\\",
"\\^{}": "^",
"\\_": "_",
"\\textasciigrave": "`",
"\\lbrace": "{",
"\\vert": "|",
"\\rbrace": "}",
"\\textasciitilde": "~",
"\\textexclamdown": "??",
"\\textcent": "??",
"\\textsterling": "??",
"\\textcurrency": "??",
"\\textyen": "??",
"\\textbrokenbar": "??",
"\\textsection": "??",
"\\textasciidieresis": "??",
"\\textcopyright": "??",
"\\textordfeminine": "??",
"\\guillemotleft": "??",
"\\lnot": "??",
"\\-": "??",
"\\textregistered": "??",
"\\textasciimacron": "??",
"\\textdegree": "??",
"\\pm": "??",
"\\textasciiacute": "??",
"\\mathrm{\\mu}": "??",
"\\textparagraph": "??",
"\\cdot": "??",
"\\c{}": "??",
"\\textordmasculine": "??",
"\\guillemotright": "??",
"\\textonequarter": "??",
"\\textonehalf": "??",
"\\textthreequarters": "??",
"\\textquestiondown": "??",
"\\`{A}": "??",
"\\'{A}": "??",
"\\^{A}": "??",
"\\~{A}": "??",
"\\\"{A}": "??",
"\\AA": "??",
"\\AE": "??",
"\\c{C}": "??",
"\\`{E}": "??",
"\\'{E}": "??",
"\\^{E}": "??",
"\\\"{E}": "??",
"\\`{I}": "??",
"\\'{I}": "??",
"\\^{I}": "??",
"\\\"{I}": "??",
"\\DH": "??",
"\\~{N}": "??",
"\\`{O}": "??",
"\\'{O}": "??",
"\\^{O}": "??",
"\\~{O}": "??",
"\\\"{O}": "??",
"\\texttimes": "??",
"\\O": "??",
"\\`{U}": "??",
"\\'{U}": "??",
"\\^{U}": "??",
"\\\"{U}": "??",
"\\'{Y}": "??",
"\\TH": "??",
"\\ss": "??",
"\\`{a}": "??",
"\\'{a}": "??",
"\\^{a}": "??",
"\\~{a}": "??",
"\\\"{a}": "??",
"\\aa": "??",
"\\ae": "??",
"\\c{c}": "??",
"\\`{e}": "??",
"\\'{e}": "??",
"\\^{e}": "??",
"\\\"{e}": "??",
"\\`{\\i}": "??",
"\\'{\\i}": "??",
"\\^{\\i}": "??",
"\\\"{\\i}": "??",
"\\dh": "??",
"\\~{n}": "??",
"\\`{o}": "??",
"\\'{o}": "??",
"\\^{o}": "??",
"\\~{o}": "??",
"\\\"{o}": "??",
"\\div": "??",
"\\o": "??",
"\\`{u}": "??",
"\\'{u}": "??",
"\\^{u}": "??",
"\\\"{u}": "??",
"\\'{y}": "??",
"\\th": "??",
"\\\"{y}": "??",
"\\={A}": "??",
"\\={a}": "??",
"\\u{A}": "??",
"\\u{a}": "??",
"\\k{A}": "??",
"\\k{a}": "??",
"\\'{C}": "??",
"\\'{c}": "??",
"\\^{C}": "??",
"\\^{c}": "??",
"\\.{C}": "??",
"\\.{c}": "??",
"\\v{C}": "??",
"\\v{c}": "??",
"\\v{D}": "??",
"\\v{d}": "??",
"\\DJ": "??",
"\\dj": "??",
"\\={E}": "??",
"\\={e}": "??",
"\\u{E}": "??",
"\\u{e}": "??",
"\\.{E}": "??",
"\\.{e}": "??",
"\\k{E}": "??",
"\\k{e}": "??",
"\\v{E}": "??",
"\\v{e}": "??",
"\\^{G}": "??",
"\\^{g}": "??",
"\\u{G}": "??",
"\\u{g}": "??",
"\\.{G}": "??",
"\\.{g}": "??",
"\\c{G}": "??",
"\\c{g}": "??",
"\\^{H}": "??",
"\\^{h}": "??",
"\\Elzxh": "??",
"\\~{I}": "??",
"\\~{\\i}": "??",
"\\={I}": "??",
"\\={\\i}": "??",
"\\u{I}": "??",
"\\u{\\i}": "??",
"\\k{I}": "??",
"\\k{i}": "??",
"\\.{I}": "??",
"\\i": "??",
"\\^{J}": "??",
"\\^{\\j}": "??",
"\\c{K}": "??",
"\\c{k}": "??",
"\\'{L}": "??",
"\\'{l}": "??",
"\\c{L}": "??",
"\\c{l}": "??",
"\\v{L}": "??",
"\\v{l}": "??",
"\\L": "??",
"\\l": "??",
"\\'{N}": "??",
"\\'{n}": "??",
"\\c{N}": "??",
"\\c{n}": "??",
"\\v{N}": "??",
"\\v{n}": "??",
"\\NG": "??",
"\\ng": "??",
"\\={O}": "??",
"\\={o}": "??",
"\\u{O}": "??",
"\\u{o}": "??",
"\\H{O}": "??",
"\\H{o}": "??",
"\\OE": "??",
"\\oe": "??",
"\\'{R}": "??",
"\\'{r}": "??",
"\\c{R}": "??",
"\\c{r}": "??",
"\\v{R}": "??",
"\\v{r}": "??",
"\\'{S}": "??",
"\\'{s}": "??",
"\\^{S}": "??",
"\\^{s}": "??",
"\\c{S}": "??",
"\\c{s}": "??",
"\\v{S}": "??",
"\\v{s}": "??",
"\\c{T}": "??",
"\\c{t}": "??",
"\\v{T}": "??",
"\\v{t}": "??",
"\\~{U}": "??",
"\\~{u}": "??",
"\\={U}": "??",
"\\={u}": "??",
"\\u{U}": "??",
"\\u{u}": "??",
"\\r{U}": "??",
"\\r{u}": "??",
"\\H{U}": "??",
"\\H{u}": "??",
"\\k{U}": "??",
"\\k{u}": "??",
"\\^{W}": "??",
"\\^{w}": "??",
"\\^{Y}": "??",
"\\^{y}": "??",
"\\\"{Y}": "??",
"\\'{Z}": "??",
"\\'{z}": "??",
"\\.{Z}": "??",
"\\.{z}": "??",
"\\v{Z}": "??",
"\\v{z}": "??",
"\\texthvlig": "??",
"\\textnrleg": "??",
"\\eth": "??",
"\\textdoublepipe": "??",
"\\'{g}": "??",
"\\Elztrna": "??",
"\\Elztrnsa": "??",
"\\Elzopeno": "??",
"\\Elzrtld": "??",
"\\Elzschwa": "??",
"\\varepsilon": "??",
"\\Elzpgamma": "??",
"\\Elzpbgam": "??",
"\\Elztrnh": "??",
"\\Elzbtdl": "??",
"\\Elzrtll": "??",
"\\Elztrnm": "??",
"\\Elztrnmlr": "??",
"\\Elzltlmr": "??",
"\\Elzltln": "??",
"\\Elzrtln": "??",
"\\Elzclomeg": "??",
"\\textphi": "??",
"\\Elztrnr": "??",
"\\Elztrnrl": "??",
"\\Elzrttrnr": "??",
"\\Elzrl": "??",
"\\Elzrtlr": "??",
"\\Elzfhr": "??",
"\\Elzrtls": "??",
"\\Elzesh": "??",
"\\Elztrnt": "??",
"\\Elzrtlt": "??",
"\\Elzpupsil": "??",
"\\Elzpscrv": "??",
"\\Elzinvv": "??",
"\\Elzinvw": "??",
"\\Elztrny": "??",
"\\Elzrtlz": "??",
"\\Elzyogh": "??",
"\\Elzglst": "??",
"\\Elzreglst": "??",
"\\Elzinglst": "??",
"\\textturnk": "??",
"\\Elzdyogh": "??",
"\\Elztesh": "??",
"\\textasciicaron": "??",
"\\Elzverts": "??",
"\\Elzverti": "??",
"\\Elzlmrk": "??",
"\\Elzhlmrk": "??",
"\\Elzsbrhr": "??",
"\\Elzsblhr": "??",
"\\Elzrais": "??",
"\\Elzlow": "??",
"\\textasciibreve": "??",
"\\textperiodcentered": "??",
"\\r{}": "??",
"\\k{}": "??",
"\\texttildelow": "??",
"\\H{}": "??",
"\\tone{55}": "??",
"\\tone{44}": "??",
"\\tone{33}": "??",
"\\tone{22}": "??",
"\\tone{11}": "??",
"\\`": "??",
"\\'": "??",
"\\^": "??",
"\\~": "??",
"\\=": "??",
"\\u": "??",
"\\.": "??",
"\\\"": "??",
"\\r": "??",
"\\H": "??",
"\\v": "??",
"\\cyrchar\\C": "??",
"\\Elzpalh": "??",
"\\Elzrh": "??",
"\\c": "??",
"\\k": "??",
"\\Elzsbbrg": "??",
"\\Elzxl": "??",
"\\Elzbar": "??",
"\\'{H}": "??",
"\\'{}{I}": "??",
"\\'{}O": "??",
"\\mathrm{'Y}": "??",
"\\mathrm{'\\Omega}": "??",
"\\acute{\\ddot{\\iota}}": "??",
"\\Alpha": "??",
"\\Beta": "??",
"\\Gamma": "??",
"\\Delta": "??",
"\\Epsilon": "??",
"\\Zeta": "??",
"\\Eta": "??",
"\\Theta": "??",
"\\Iota": "??",
"\\Kappa": "??",
"\\Lambda": "??",
"\\Xi": "??",
"\\Pi": "??",
"\\Rho": "??",
"\\Sigma": "??",
"\\Tau": "??",
"\\Upsilon": "??",
"\\Phi": "??",
"\\Chi": "??",
"\\Psi": "??",
"\\Omega": "??",
"\\mathrm{\\ddot{I}}": "??",
"\\mathrm{\\ddot{Y}}": "??",
"\\'{$\\alpha$}": "??",
"\\acute{\\epsilon}": "??",
"\\acute{\\eta}": "??",
"\\acute{\\iota}": "??",
"\\acute{\\ddot{\\upsilon}}": "??",
"\\alpha": "??",
"\\beta": "??",
"\\gamma": "??",
"\\delta": "??",
"\\epsilon": "??",
"\\zeta": "??",
"\\eta": "??",
"\\texttheta": "??",
"\\iota": "??",
"\\kappa": "??",
"\\lambda": "??",
"\\mu": "??",
"\\nu": "??",
"\\xi": "??",
"\\pi": "??",
"\\rho": "??",
"\\varsigma": "??",
"\\sigma": "??",
"\\tau": "??",
"\\upsilon": "??",
"\\varphi": "??",
"\\chi": "??",
"\\psi": "??",
"\\omega": "??",
"\\ddot{\\iota}": "??",
"\\ddot{\\upsilon}": "??",
"\\acute{\\upsilon}": "??",
"\\acute{\\omega}": "??",
"\\Pisymbol{ppi022}{87}": "??",
"\\textvartheta": "??",
"\\phi": "??",
"\\varpi": "??",
"\\Stigma": "??",
"\\Digamma": "??",
"\\digamma": "??",
"\\Koppa": "??",
"\\Sampi": "??",
"\\varkappa": "??",
"\\varrho": "??",
"\\textTheta": "??",
"\\backepsilon": "??",
"\\cyrchar\\CYRYO": "??",
"\\cyrchar\\CYRDJE": "??",
"\\cyrchar{\\'\\CYRG}": "??",
"\\cyrchar\\CYRIE": "??",
"\\cyrchar\\CYRDZE": "??",
"\\cyrchar\\CYRII": "??",
"\\cyrchar\\CYRYI": "??",
"\\cyrchar\\CYRJE": "??",
"\\cyrchar\\CYRLJE": "??",
"\\cyrchar\\CYRNJE": "??",
"\\cyrchar\\CYRTSHE": "??",
"\\cyrchar{\\'\\CYRK}": "??",
"\\cyrchar\\CYRUSHRT": "??",
"\\cyrchar\\CYRDZHE": "??",
"\\cyrchar\\CYRA": "??",
"\\cyrchar\\CYRB": "??",
"\\cyrchar\\CYRV": "??",
"\\cyrchar\\CYRG": "??",
"\\cyrchar\\CYRD": "??",
"\\cyrchar\\CYRE": "??",
"\\cyrchar\\CYRZH": "??",
"\\cyrchar\\CYRZ": "??",
"\\cyrchar\\CYRI": "??",
"\\cyrchar\\CYRISHRT": "??",
"\\cyrchar\\CYRK": "??",
"\\cyrchar\\CYRL": "??",
"\\cyrchar\\CYRM": "??",
"\\cyrchar\\CYRN": "??",
"\\cyrchar\\CYRO": "??",
"\\cyrchar\\CYRP": "??",
"\\cyrchar\\CYRR": "??",
"\\cyrchar\\CYRS": "??",
"\\cyrchar\\CYRT": "??",
"\\cyrchar\\CYRU": "??",
"\\cyrchar\\CYRF": "??",
"\\cyrchar\\CYRH": "??",
"\\cyrchar\\CYRC": "??",
"\\cyrchar\\CYRCH": "??",
"\\cyrchar\\CYRSH": "??",
"\\cyrchar\\CYRSHCH": "??",
"\\cyrchar\\CYRHRDSN": "??",
"\\cyrchar\\CYRERY": "??",
"\\cyrchar\\CYRSFTSN": "??",
"\\cyrchar\\CYREREV": "??",
"\\cyrchar\\CYRYU": "??",
"\\cyrchar\\CYRYA": "??",
"\\cyrchar\\cyra": "??",
"\\cyrchar\\cyrb": "??",
"\\cyrchar\\cyrv": "??",
"\\cyrchar\\cyrg": "??",
"\\cyrchar\\cyrd": "??",
"\\cyrchar\\cyre": "??",
"\\cyrchar\\cyrzh": "??",
"\\cyrchar\\cyrz": "??",
"\\cyrchar\\cyri": "??",
"\\cyrchar\\cyrishrt": "??",
"\\cyrchar\\cyrk": "??",
"\\cyrchar\\cyrl": "??",
"\\cyrchar\\cyrm": "??",
"\\cyrchar\\cyrn": "??",
"\\cyrchar\\cyro": "??",
"\\cyrchar\\cyrp": "??",
"\\cyrchar\\cyrr": "??",
"\\cyrchar\\cyrs": "??",
"\\cyrchar\\cyrt": "??",
"\\cyrchar\\cyru": "??",
"\\cyrchar\\cyrf": "??",
"\\cyrchar\\cyrh": "??",
"\\cyrchar\\cyrc": "??",
"\\cyrchar\\cyrch": "??",
"\\cyrchar\\cyrsh": "??",
"\\cyrchar\\cyrshch": "??",
"\\cyrchar\\cyrhrdsn": "??",
"\\cyrchar\\cyrery": "??",
"\\cyrchar\\cyrsftsn": "??",
"\\cyrchar\\cyrerev": "??",
"\\cyrchar\\cyryu": "??",
"\\cyrchar\\cyrya": "??",
"\\cyrchar\\cyryo": "??",
"\\cyrchar\\cyrdje": "??",
"\\cyrchar{\\'\\cyrg}": "??",
"\\cyrchar\\cyrie": "??",
"\\cyrchar\\cyrdze": "??",
"\\cyrchar\\cyrii": "??",
"\\cyrchar\\cyryi": "??",
"\\cyrchar\\cyrje": "??",
"\\cyrchar\\cyrlje": "??",
"\\cyrchar\\cyrnje": "??",
"\\cyrchar\\cyrtshe": "??",
"\\cyrchar{\\'\\cyrk}": "??",
"\\cyrchar\\cyrushrt": "??",
"\\cyrchar\\cyrdzhe": "??",
"\\cyrchar\\CYROMEGA": "??",
"\\cyrchar\\cyromega": "??",
"\\cyrchar\\CYRYAT": "??",
"\\cyrchar\\CYRIOTE": "??",
"\\cyrchar\\cyriote": "??",
"\\cyrchar\\CYRLYUS": "??",
"\\cyrchar\\cyrlyus": "??",
"\\cyrchar\\CYRIOTLYUS": "??",
"\\cyrchar\\cyriotlyus": "??",
"\\cyrchar\\CYRBYUS": "??",
"\\cyrchar\\CYRIOTBYUS": "??",
"\\cyrchar\\cyriotbyus": "??",
"\\cyrchar\\CYRKSI": "??",
"\\cyrchar\\cyrksi": "??",
"\\cyrchar\\CYRPSI": "??",
"\\cyrchar\\cyrpsi": "??",
"\\cyrchar\\CYRFITA": "??",
"\\cyrchar\\CYRIZH": "??",
"\\cyrchar\\CYRUK": "??",
"\\cyrchar\\cyruk": "??",
"\\cyrchar\\CYROMEGARND": "??",
"\\cyrchar\\cyromegarnd": "??",
"\\cyrchar\\CYROMEGATITLO": "??",
"\\cyrchar\\cyromegatitlo": "??",
"\\cyrchar\\CYROT": "??",
"\\cyrchar\\cyrot": "??",
"\\cyrchar\\CYRKOPPA": "??",
"\\cyrchar\\cyrkoppa": "??",
"\\cyrchar\\cyrthousands": "??",
"\\cyrchar\\cyrhundredthousands": "??",
"\\cyrchar\\cyrmillions": "??",
"\\cyrchar\\CYRSEMISFTSN": "??",
"\\cyrchar\\cyrsemisftsn": "??",
"\\cyrchar\\CYRRTICK": "??",
"\\cyrchar\\cyrrtick": "??",
"\\cyrchar\\CYRGUP": "??",
"\\cyrchar\\cyrgup": "??",
"\\cyrchar\\CYRGHCRS": "??",
"\\cyrchar\\cyrghcrs": "??",
"\\cyrchar\\CYRGHK": "??",
"\\cyrchar\\cyrghk": "??",
"\\cyrchar\\CYRZHDSC": "??",
"\\cyrchar\\cyrzhdsc": "??",
"\\cyrchar\\CYRZDSC": "??",
"\\cyrchar\\cyrzdsc": "??",
"\\cyrchar\\CYRKDSC": "??",
"\\cyrchar\\cyrkdsc": "??",
"\\cyrchar\\CYRKVCRS": "??",
"\\cyrchar\\cyrkvcrs": "??",
"\\cyrchar\\CYRKHCRS": "??",
"\\cyrchar\\cyrkhcrs": "??",
"\\cyrchar\\CYRKBEAK": "??",
"\\cyrchar\\cyrkbeak": "??",
"\\cyrchar\\CYRNDSC": "??",
"\\cyrchar\\cyrndsc": "??",
"\\cyrchar\\CYRNG": "??",
"\\cyrchar\\cyrng": "??",
"\\cyrchar\\CYRPHK": "??",
"\\cyrchar\\cyrphk": "??",
"\\cyrchar\\CYRABHHA": "??",
"\\cyrchar\\cyrabhha": "??",
"\\cyrchar\\CYRSDSC": "??",
"\\cyrchar\\cyrsdsc": "??",
"\\cyrchar\\CYRTDSC": "??",
"\\cyrchar\\cyrtdsc": "??",
"\\cyrchar\\CYRY": "??",
"\\cyrchar\\cyry": "??",
"\\cyrchar\\CYRYHCRS": "??",
"\\cyrchar\\cyryhcrs": "??",
"\\cyrchar\\CYRHDSC": "??",
"\\cyrchar\\cyrhdsc": "??",
"\\cyrchar\\CYRTETSE": "??",
"\\cyrchar\\cyrtetse": "??",
"\\cyrchar\\CYRCHRDSC": "??",
"\\cyrchar\\cyrchrdsc": "??",
"\\cyrchar\\CYRCHVCRS": "??",
"\\cyrchar\\cyrchvcrs": "??",
"\\cyrchar\\CYRSHHA": "??",
"\\cyrchar\\cyrshha": "??",
"\\cyrchar\\CYRABHCH": "??",
"\\cyrchar\\cyrabhch": "??",
"\\cyrchar\\CYRABHCHDSC": "??",
"\\cyrchar\\cyrabhchdsc": "??",
"\\cyrchar\\CYRpalochka": "??",
"\\cyrchar\\CYRKHK": "??",
"\\cyrchar\\cyrkhk": "??",
"\\cyrchar\\CYRNHK": "??",
"\\cyrchar\\cyrnhk": "??",
"\\cyrchar\\CYRCHLDSC": "??",
"\\cyrchar\\cyrchldsc": "??",
"\\cyrchar\\CYRAE": "??",
"\\cyrchar\\cyrae": "??",
"\\cyrchar\\CYRSCHWA": "??",
"\\cyrchar\\cyrschwa": "??",
"\\cyrchar\\CYRABHDZE": "??",
"\\cyrchar\\cyrabhdze": "??",
"\\cyrchar\\CYROTLD": "??",
"\\cyrchar\\cyrotld": "??",
"\\hspace{0.6em}": "???",
"\\hspace{1em}": "???",
"\\hspace{0.33em}": "???",
"\\hspace{0.25em}": "???",
"\\hspace{0.166em}": "???",
"\\hphantom{0}": "???",
"\\hphantom{,}": "???",
"\\hspace{0.167em}": "???",
"\\mkern1mu": "???",
"\\textendash": "???",
"\\textemdash": "???",
"\\rule{1em}{1pt}": "???",
"\\Vert": "???",
"\\Elzreapos": "???",
"\\textquotedblleft": "???",
"\\textquotedblright": "???",
"\\textdagger": "???",
"\\textdaggerdbl": "???",
"\\textbullet": "???",
"\\ldots": "???",
"\\textperthousand": "???",
"\\textpertenthousand": "???",
"\\backprime": "???",
"\\guilsinglleft": "???",
"\\guilsinglright": "???",
"\\mkern4mu": "???",
"\\nolinebreak": "???",
"\\ensuremath{\\Elzpes}": "???",
"\\mbox{\\texteuro}": "???",
"\\dddot": "???",
"\\ddddot": "???",
"\\mathbb{C}": "???",
"\\mathscr{g}": "???",
"\\mathscr{H}": "???",
"\\mathfrak{H}": "???",
"\\mathbb{H}": "???",
"\\hslash": "???",
"\\mathscr{I}": "???",
"\\mathfrak{I}": "???",
"\\mathscr{L}": "???",
"\\mathscr{l}": "???",
"\\mathbb{N}": "???",
"\\cyrchar\\textnumero": "???",
"\\wp": "???",
"\\mathbb{P}": "???",
"\\mathbb{Q}": "???",
"\\mathscr{R}": "???",
"\\mathfrak{R}": "???",
"\\mathbb{R}": "???",
"\\Elzxrat": "???",
"\\texttrademark": "???",
"\\mathbb{Z}": "???",
"\\mho": "???",
"\\mathfrak{Z}": "???",
"\\ElsevierGlyph{2129}": "???",
"\\mathscr{B}": "???",
"\\mathfrak{C}": "???",
"\\mathscr{e}": "???",
"\\mathscr{E}": "???",
"\\mathscr{F}": "???",
"\\mathscr{M}": "???",
"\\mathscr{o}": "???",
"\\aleph": "???",
"\\beth": "???",
"\\gimel": "???",
"\\daleth": "???",
"\\textfrac{1}{3}": "???",
"\\textfrac{2}{3}": "???",
"\\textfrac{1}{5}": "???",
"\\textfrac{2}{5}": "???",
"\\textfrac{3}{5}": "???",
"\\textfrac{4}{5}": "???",
"\\textfrac{1}{6}": "???",
"\\textfrac{5}{6}": "???",
"\\textfrac{1}{8}": "???",
"\\textfrac{3}{8}": "???",
"\\textfrac{5}{8}": "???",
"\\textfrac{7}{8}": "???",
"\\leftarrow": "???",
"\\uparrow": "???",
"\\rightarrow": "???",
"\\downarrow": "???",
"\\leftrightarrow": "???",
"\\updownarrow": "???",
"\\nwarrow": "???",
"\\nearrow": "???",
"\\searrow": "???",
"\\swarrow": "???",
"\\nleftarrow": "???",
"\\nrightarrow": "???",
"\\arrowwaveleft": "???",
"\\arrowwaveright": "???",
"\\twoheadleftarrow": "???",
"\\twoheadrightarrow": "???",
"\\leftarrowtail": "???",
"\\rightarrowtail": "???",
"\\mapsto": "???",
"\\hookleftarrow": "???",
"\\hookrightarrow": "???",
"\\looparrowleft": "???",
"\\looparrowright": "???",
"\\leftrightsquigarrow": "???",
"\\nleftrightarrow": "???",
"\\Lsh": "???",
"\\Rsh": "???",
"\\ElsevierGlyph{21B3}": "???",
"\\curvearrowleft": "???",
"\\curvearrowright": "???",
"\\circlearrowleft": "???",
"\\circlearrowright": "???",
"\\leftharpoonup": "???",
"\\leftharpoondown": "???",
"\\upharpoonright": "???",
"\\upharpoonleft": "???",
"\\rightharpoonup": "???",
"\\rightharpoondown": "???",
"\\downharpoonright": "???",
"\\downharpoonleft": "???",
"\\rightleftarrows": "???",
"\\dblarrowupdown": "???",
"\\leftrightarrows": "???",
"\\leftleftarrows": "???",
"\\upuparrows": "???",
"\\rightrightarrows": "???",
"\\downdownarrows": "???",
"\\leftrightharpoons": "???",
"\\rightleftharpoons": "???",
"\\nLeftarrow": "???",
"\\nLeftrightarrow": "???",
"\\nRightarrow": "???",
"\\Leftarrow": "???",
"\\Uparrow": "???",
"\\Rightarrow": "???",
"\\Downarrow": "???",
"\\Leftrightarrow": "???",
"\\Updownarrow": "???",
"\\Lleftarrow": "???",
"\\Rrightarrow": "???",
"\\rightsquigarrow": "???",
"\\DownArrowUpArrow": "???",
"\\forall": "???",
"\\complement": "???",
"\\partial": "???",
"\\exists": "???",
"\\nexists": "???",
"\\varnothing": "???",
"\\nabla": "???",
"\\in": "???",
"\\not\\in": "???",
"\\ni": "???",
"\\not\\ni": "???",
"\\prod": "???",
"\\coprod": "???",
"\\sum": "???",
"\\mp": "???",
"\\dotplus": "???",
"\\setminus": "???",
"\\circ": "???",
"\\bullet": "???",
"\\surd": "???",
"\\propto": "???",
"\\infty": "???",
"\\rightangle": "???",
"\\angle": "???",
"\\measuredangle": "???",
"\\sphericalangle": "???",
"\\mid": "???",
"\\nmid": "???",
"\\parallel": "???",
"\\nparallel": "???",
"\\wedge": "???",
"\\vee": "???",
"\\cap": "???",
"\\cup": "???",
"\\int": "???",
"\\int\\!\\int": "???",
"\\int\\!\\int\\!\\int": "???",
"\\oint": "???",
"\\surfintegral": "???",
"\\volintegral": "???",
"\\clwintegral": "???",
"\\ElsevierGlyph{2232}": "???",
"\\ElsevierGlyph{2233}": "???",
"\\therefore": "???",
"\\because": "???",
"\\Colon": "???",
"\\ElsevierGlyph{2238}": "???",
"\\mathbin{{:}\\!\\!{-}\\!\\!{:}}": "???",
"\\homothetic": "???",
"\\sim": "???",
"\\backsim": "???",
"\\lazysinv": "???",
"\\wr": "???",
"\\not\\sim": "???",
"\\ElsevierGlyph{2242}": "???",
"\\simeq": "???",
"\\not\\simeq": "???",
"\\cong": "???",
"\\approxnotequal": "???",
"\\not\\cong": "???",
"\\approx": "???",
"\\not\\approx": "???",
"\\approxeq": "???",
"\\tildetrpl": "???",
"\\allequal": "???",
"\\asymp": "???",
"\\Bumpeq": "???",
"\\bumpeq": "???",
"\\doteq": "???",
"\\doteqdot": "???",
"\\fallingdotseq": "???",
"\\risingdotseq": "???",
"\\eqcirc": "???",
"\\circeq": "???",
"\\estimates": "???",
"\\ElsevierGlyph{225A}": "???",
"\\starequal": "???",
"\\triangleq": "???",
"\\ElsevierGlyph{225F}": "???",
"\\not =": "???",
"\\equiv": "???",
"\\not\\equiv": "???",
"\\leq": "???",
"\\geq": "???",
"\\leqq": "???",
"\\geqq": "???",
"\\lneqq": "???",
"\\gneqq": "???",
"\\ll": "???",
"\\gg": "???",
"\\between": "???",
"\\not\\kern-0.3em\\times": "???",
"\\not<": "???",
"\\not>": "???",
"\\not\\leq": "???",
"\\not\\geq": "???",
"\\lessequivlnt": "???",
"\\greaterequivlnt": "???",
"\\ElsevierGlyph{2274}": "???",
"\\ElsevierGlyph{2275}": "???",
"\\lessgtr": "???",
"\\gtrless": "???",
"\\notlessgreater": "???",
"\\notgreaterless": "???",
"\\prec": "???",
"\\succ": "???",
"\\preccurlyeq": "???",
"\\succcurlyeq": "???",
"\\precapprox": "???",
"\\succapprox": "???",
"\\not\\prec": "???",
"\\not\\succ": "???",
"\\subset": "???",
"\\supset": "???",
"\\not\\subset": "???",
"\\not\\supset": "???",
"\\subseteq": "???",
"\\supseteq": "???",
"\\not\\subseteq": "???",
"\\not\\supseteq": "???",
"\\subsetneq": "???",
"\\supsetneq": "???",
"\\uplus": "???",
"\\sqsubset": "???",
"\\sqsupset": "???",
"\\sqsubseteq": "???",
"\\sqsupseteq": "???",
"\\sqcap": "???",
"\\sqcup": "???",
"\\oplus": "???",
"\\ominus": "???",
"\\otimes": "???",
"\\oslash": "???",
"\\odot": "???",
"\\circledcirc": "???",
"\\circledast": "???",
"\\circleddash": "???",
"\\boxplus": "???",
"\\boxminus": "???",
"\\boxtimes": "???",
"\\boxdot": "???",
"\\vdash": "???",
"\\dashv": "???",
"\\top": "???",
"\\perp": "???",
"\\truestate": "???",
"\\forcesextra": "???",
"\\Vdash": "???",
"\\Vvdash": "???",
"\\VDash": "???",
"\\nvdash": "???",
"\\nvDash": "???",
"\\nVdash": "???",
"\\nVDash": "???",
"\\vartriangleleft": "???",
"\\vartriangleright": "???",
"\\trianglelefteq": "???",
"\\trianglerighteq": "???",
"\\original": "???",
"\\image": "???",
"\\multimap": "???",
"\\hermitconjmatrix": "???",
"\\intercal": "???",
"\\veebar": "???",
"\\rightanglearc": "???",
"\\ElsevierGlyph{22C0}": "???",
"\\ElsevierGlyph{22C1}": "???",
"\\bigcap": "???",
"\\bigcup": "???",
"\\diamond": "???",
"\\star": "???",
"\\divideontimes": "???",
"\\bowtie": "???",
"\\ltimes": "???",
"\\rtimes": "???",
"\\leftthreetimes": "???",
"\\rightthreetimes": "???",
"\\backsimeq": "???",
"\\curlyvee": "???",
"\\curlywedge": "???",
"\\Subset": "???",
"\\Supset": "???",
"\\Cap": "???",
"\\Cup": "???",
"\\pitchfork": "???",
"\\lessdot": "???",
"\\gtrdot": "???",
"\\verymuchless": "???",
"\\verymuchgreater": "???",
"\\lesseqgtr": "???",
"\\gtreqless": "???",
"\\curlyeqprec": "???",
"\\curlyeqsucc": "???",
"\\not\\sqsubseteq": "???",
"\\not\\sqsupseteq": "???",
"\\Elzsqspne": "???",
"\\lnsim": "???",
"\\gnsim": "???",
"\\precedesnotsimilar": "???",
"\\succnsim": "???",
"\\ntriangleleft": "???",
"\\ntriangleright": "???",
"\\ntrianglelefteq": "???",
"\\ntrianglerighteq": "???",
"\\vdots": "???",
"\\cdots": "???",
"\\upslopeellipsis": "???",
"\\downslopeellipsis": "???",
"\\barwedge": "???",
"\\varperspcorrespond": "???",
"\\lceil": "???",
"\\rceil": "???",
"\\lfloor": "???",
"\\rfloor": "???",
"\\recorder": "???",
"\\mathchar\"2208": "???",
"\\ulcorner": "???",
"\\urcorner": "???",
"\\llcorner": "???",
"\\lrcorner": "???",
"\\frown": "???",
"\\smile": "???",
"\\ElsevierGlyph{E838}": "???",
"\\Elzdlcorn": "???",
"\\lmoustache": "???",
"\\rmoustache": "???",
"\\textvisiblespace": "???",
"\\ding{172}": "???",
"\\ding{173}": "???",
"\\ding{174}": "???",
"\\ding{175}": "???",
"\\ding{176}": "???",
"\\ding{177}": "???",
"\\ding{178}": "???",
"\\ding{179}": "???",
"\\ding{180}": "???",
"\\ding{181}": "???",
"\\circledS": "???",
"\\Elzdshfnc": "???",
"\\Elzsqfnw": "???",
"\\diagup": "???",
"\\ding{110}": "???",
"\\square": "???",
"\\blacksquare": "???",
"\\fbox{~~}": "???",
"\\Elzvrecto": "???",
"\\ElsevierGlyph{E381}": "???",
"\\ding{115}": "???",
"\\bigtriangleup": "???",
"\\blacktriangle": "???",
"\\vartriangle": "???",
"\\blacktriangleright": "???",
"\\triangleright": "???",
"\\ding{116}": "???",
"\\bigtriangledown": "???",
"\\blacktriangledown": "???",
"\\triangledown": "???",
"\\blacktriangleleft": "???",
"\\triangleleft": "???",
"\\ding{117}": "???",
"\\lozenge": "???",
"\\bigcirc": "???",
"\\ding{108}": "???",
"\\Elzcirfl": "???",
"\\Elzcirfr": "???",
"\\Elzcirfb": "???",
"\\ding{119}": "???",
"\\Elzrvbull": "???",
"\\Elzsqfl": "???",
"\\Elzsqfr": "???",
"\\Elzsqfse": "???",
"\\ding{72}": "???",
"\\ding{73}": "???",
"\\ding{37}": "???",
"\\ding{42}": "???",
"\\ding{43}": "???",
"\\rightmoon": "???",
"\\mercury": "???",
"\\venus": "???",
"\\male": "???",
"\\jupiter": "???",
"\\saturn": "???",
"\\uranus": "???",
"\\neptune": "???",
"\\pluto": "???",
"\\aries": "???",
"\\taurus": "???",
"\\gemini": "???",
"\\cancer": "???",
"\\leo": "???",
"\\virgo": "???",
"\\libra": "???",
"\\scorpio": "???",
"\\sagittarius": "???",
"\\capricornus": "???",
"\\aquarius": "???",
"\\pisces": "???",
"\\ding{171}": "???",
"\\ding{168}": "???",
"\\ding{170}": "???",
"\\ding{169}": "???",
"\\quarternote": "???",
"\\eighthnote": "???",
"\\flat": "???",
"\\natural": "???",
"\\sharp": "???",
"\\ding{33}": "???",
"\\ding{34}": "???",
"\\ding{35}": "???",
"\\ding{36}": "???",
"\\ding{38}": "???",
"\\ding{39}": "???",
"\\ding{40}": "???",
"\\ding{41}": "???",
"\\ding{44}": "???",
"\\ding{45}": "???",
"\\ding{46}": "???",
"\\ding{47}": "???",
"\\ding{48}": "???",
"\\ding{49}": "???",
"\\ding{50}": "???",
"\\ding{51}": "???",
"\\ding{52}": "???",
"\\ding{53}": "???",
"\\ding{54}": "???",
"\\ding{55}": "???",
"\\ding{56}": "???",
"\\ding{57}": "???",
"\\ding{58}": "???",
"\\ding{59}": "???",
"\\ding{60}": "???",
"\\ding{61}": "???",
"\\ding{62}": "???",
"\\ding{63}": "???",
"\\ding{64}": "???",
"\\ding{65}": "???",
"\\ding{66}": "???",
"\\ding{67}": "???",
"\\ding{68}": "???",
"\\ding{69}": "???",
"\\ding{70}": "???",
"\\ding{71}": "???",
"\\ding{74}": "???",
"\\ding{75}": "???",
"\\ding{76}": "???",
"\\ding{77}": "???",
"\\ding{78}": "???",
"\\ding{79}": "???",
"\\ding{80}": "???",
"\\ding{81}": "???",
"\\ding{82}": "???",
"\\ding{83}": "???",
"\\ding{84}": "???",
"\\ding{85}": "???",
"\\ding{86}": "???",
"\\ding{87}": "???",
"\\ding{88}": "???",
"\\ding{89}": "???",
"\\ding{90}": "???",
"\\ding{91}": "???",
"\\ding{92}": "???",
"\\ding{93}": "???",
"\\ding{94}": "???",
"\\ding{95}": "???",
"\\ding{96}": "???",
"\\ding{97}": "???",
"\\ding{98}": "???",
"\\ding{99}": "???",
"\\ding{100}": "???",
"\\ding{101}": "???",
"\\ding{102}": "???",
"\\ding{103}": "???",
"\\ding{104}": "???",
"\\ding{105}": "???",
"\\ding{106}": "???",
"\\ding{107}": "???",
"\\ding{109}": "???",
"\\ding{111}": "???",
"\\ding{112}": "???",
"\\ding{113}": "???",
"\\ding{114}": "???",
"\\ding{118}": "???",
"\\ding{120}": "???",
"\\ding{121}": "???",
"\\ding{122}": "???",
"\\ding{123}": "???",
"\\ding{124}": "???",
"\\ding{125}": "???",
"\\ding{126}": "???",
"\\ding{161}": "???",
"\\ding{162}": "???",
"\\ding{163}": "???",
"\\ding{164}": "???",
"\\ding{165}": "???",
"\\ding{166}": "???",
"\\ding{167}": "???",
"\\ding{182}": "???",
"\\ding{183}": "???",
"\\ding{184}": "???",
"\\ding{185}": "???",
"\\ding{186}": "???",
"\\ding{187}": "???",
"\\ding{188}": "???",
"\\ding{189}": "???",
"\\ding{190}": "???",
"\\ding{191}": "???",
"\\ding{192}": "???",
"\\ding{193}": "???",
"\\ding{194}": "???",
"\\ding{195}": "???",
"\\ding{196}": "???",
"\\ding{197}": "???",
"\\ding{198}": "???",
"\\ding{199}": "???",
"\\ding{200}": "???",
"\\ding{201}": "???",
"\\ding{202}": "???",
"\\ding{203}": "???",
"\\ding{204}": "???",
"\\ding{205}": "???",
"\\ding{206}": "???",
"\\ding{207}": "???",
"\\ding{208}": "???",
"\\ding{209}": "???",
"\\ding{210}": "???",
"\\ding{211}": "???",
"\\ding{212}": "???",
"\\ding{216}": "???",
"\\ding{217}": "???",
"\\ding{218}": "???",
"\\ding{219}": "???",
"\\ding{220}": "???",
"\\ding{221}": "???",
"\\ding{222}": "???",
"\\ding{223}": "???",
"\\ding{224}": "???",
"\\ding{225}": "???",
"\\ding{226}": "???",
"\\ding{227}": "???",
"\\ding{228}": "???",
"\\ding{229}": "???",
"\\ding{230}": "???",
"\\ding{231}": "???",
"\\ding{232}": "???",
"\\ding{233}": "???",
"\\ding{234}": "???",
"\\ding{235}": "???",
"\\ding{236}": "???",
"\\ding{237}": "???",
"\\ding{238}": "???",
"\\ding{239}": "???",
"\\ding{241}": "???",
"\\ding{242}": "???",
"\\ding{243}": "???",
"\\ding{244}": "???",
"\\ding{245}": "???",
"\\ding{246}": "???",
"\\ding{247}": "???",
"\\ding{248}": "???",
"\\ding{249}": "???",
"\\ding{250}": "???",
"\\ding{251}": "???",
"\\ding{252}": "???",
"\\ding{253}": "???",
"\\ding{254}": "???",
"\\langle": "???",
"\\rangle": "???",
"\\longleftarrow": "???",
"\\longrightarrow": "???",
"\\longleftrightarrow": "???",
"\\Longleftarrow": "???",
"\\Longrightarrow": "???",
"\\Longleftrightarrow": "???",
"\\longmapsto": "???",
"\\sim\\joinrel\\leadsto": "???",
"\\ElsevierGlyph{E212}": "???",
"\\UpArrowBar": "???",
"\\DownArrowBar": "???",
"\\ElsevierGlyph{E20C}": "???",
"\\ElsevierGlyph{E20D}": "???",
"\\ElsevierGlyph{E20B}": "???",
"\\ElsevierGlyph{E20A}": "???",
"\\ElsevierGlyph{E211}": "???",
"\\ElsevierGlyph{E20E}": "???",
"\\ElsevierGlyph{E20F}": "???",
"\\ElsevierGlyph{E210}": "???",
"\\ElsevierGlyph{E21C}": "???",
"\\ElsevierGlyph{E21A}": "???",
"\\ElsevierGlyph{E219}": "???",
"\\Elolarr": "???",
"\\Elorarr": "???",
"\\ElzRlarr": "???",
"\\ElzrLarr": "???",
"\\Elzrarrx": "???",
"\\LeftRightVector": "???",
"\\RightUpDownVector": "???",
"\\DownLeftRightVector": "???",
"\\LeftUpDownVector": "???",
"\\LeftVectorBar": "???",
"\\RightVectorBar": "???",
"\\RightUpVectorBar": "???",
"\\RightDownVectorBar": "???",
"\\DownLeftVectorBar": "???",
"\\DownRightVectorBar": "???",
"\\LeftUpVectorBar": "???",
"\\LeftDownVectorBar": "???",
"\\LeftTeeVector": "???",
"\\RightTeeVector": "???",
"\\RightUpTeeVector": "???",
"\\RightDownTeeVector": "???",
"\\DownLeftTeeVector": "???",
"\\DownRightTeeVector": "???",
"\\LeftUpTeeVector": "???",
"\\LeftDownTeeVector": "???",
"\\UpEquilibrium": "???",
"\\ReverseUpEquilibrium": "???",
"\\RoundImplies": "???",
"\\ElsevierGlyph{E214}": "???",
"\\ElsevierGlyph{E215}": "???",
"\\Elztfnc": "???",
"\\ElsevierGlyph{3018}": "???",
"\\Elroang": "???",
"\\ElsevierGlyph{E291}": "???",
"\\Elzddfnc": "???",
"\\Angle": "???",
"\\Elzlpargt": "???",
"\\ElsevierGlyph{E260}": "???",
"\\ElsevierGlyph{E61B}": "???",
"\\ElzLap": "???",
"\\Elzdefas": "???",
"\\LeftTriangleBar": "???",
"\\RightTriangleBar": "???",
"\\ElsevierGlyph{E372}": "???",
"\\blacklozenge": "???",
"\\RuleDelayed": "???",
"\\Elxuplus": "???",
"\\ElzThr": "???",
"\\Elxsqcup": "???",
"\\ElzInf": "???",
"\\ElzSup": "???",
"\\ElzCint": "???",
"\\clockoint": "???",
"\\ElsevierGlyph{E395}": "???",
"\\sqrint": "???",
"\\ElsevierGlyph{E25A}": "???",
"\\ElsevierGlyph{E25B}": "???",
"\\ElsevierGlyph{E25C}": "???",
"\\ElsevierGlyph{E25D}": "???",
"\\ElzTimes": "???",
"\\ElsevierGlyph{E25E}": "???",
"\\ElsevierGlyph{E259}": "???",
"\\amalg": "???",
"\\ElzAnd": "???",
"\\ElzOr": "???",
"\\ElsevierGlyph{E36E}": "???",
"\\ElOr": "???",
"\\perspcorrespond": "???",
"\\Elzminhat": "???",
"\\stackrel{*}{=}": "???",
"\\Equal": "???",
"\\leqslant": "???",
"\\geqslant": "???",
"\\lessapprox": "???",
"\\gtrapprox": "???",
"\\lneq": "???",
"\\gneq": "???",
"\\lnapprox": "???",
"\\gnapprox": "???",
"\\lesseqqgtr": "???",
"\\gtreqqless": "???",
"\\eqslantless": "???",
"\\eqslantgtr": "???",
"\\Pisymbol{ppi020}{117}": "???",
"\\Pisymbol{ppi020}{105}": "???",
"\\NestedLessLess": "???",
"\\NestedGreaterGreater": "???",
"\\preceq": "???",
"\\succeq": "???",
"\\precneqq": "???",
"\\succneqq": "???",
"\\precnapprox": "???",
"\\succnapprox": "???",
"\\subseteqq": "???",
"\\supseteqq": "???",
"\\subsetneqq": "???",
"\\supsetneqq": "???",
"\\ElsevierGlyph{E30D}": "???",
"\\Elztdcol": "???",
"\\ElsevierGlyph{300A}": "???",
"\\ElsevierGlyph{300B}": "???",
"\\ElsevierGlyph{3019}": "???",
"\\openbracketleft": "???",
"\\openbracketright": "???",
"\\mathbf{A}": "????",
"\\mathbf{B}": "????",
"\\mathbf{C}": "????",
"\\mathbf{D}": "????",
"\\mathbf{E}": "????",
"\\mathbf{F}": "????",
"\\mathbf{G}": "????",
"\\mathbf{H}": "????",
"\\mathbf{I}": "????",
"\\mathbf{J}": "????",
"\\mathbf{K}": "????",
"\\mathbf{L}": "????",
"\\mathbf{M}": "????",
"\\mathbf{N}": "????",
"\\mathbf{O}": "????",
"\\mathbf{P}": "????",
"\\mathbf{Q}": "????",
"\\mathbf{R}": "????",
"\\mathbf{S}": "????",
"\\mathbf{T}": "????",
"\\mathbf{U}": "????",
"\\mathbf{V}": "????",
"\\mathbf{W}": "????",
"\\mathbf{X}": "????",
"\\mathbf{Y}": "????",
"\\mathbf{Z}": "????",
"\\mathbf{a}": "????",
"\\mathbf{b}": "????",
"\\mathbf{c}": "????",
"\\mathbf{d}": "????",
"\\mathbf{e}": "????",
"\\mathbf{f}": "????",
"\\mathbf{g}": "????",
"\\mathbf{h}": "????",
"\\mathbf{i}": "????",
"\\mathbf{j}": "????",
"\\mathbf{k}": "????",
"\\mathbf{l}": "????",
"\\mathbf{m}": "????",
"\\mathbf{n}": "????",
"\\mathbf{o}": "????",
"\\mathbf{p}": "????",
"\\mathbf{q}": "????",
"\\mathbf{r}": "????",
"\\mathbf{s}": "????",
"\\mathbf{t}": "????",
"\\mathbf{u}": "????",
"\\mathbf{v}": "????",
"\\mathbf{w}": "????",
"\\mathbf{x}": "????",
"\\mathbf{y}": "????",
"\\mathbf{z}": "????",
"\\mathmit{A}": "????",
"\\mathmit{B}": "????",
"\\mathmit{C}": "????",
"\\mathmit{D}": "????",
"\\mathmit{E}": "????",
"\\mathmit{F}": "????",
"\\mathmit{G}": "????",
"\\mathmit{H}": "????",
"\\mathmit{I}": "????",
"\\mathmit{J}": "????",
"\\mathmit{K}": "????",
"\\mathmit{L}": "????",
"\\mathmit{M}": "????",
"\\mathmit{N}": "????",
"\\mathmit{O}": "????",
"\\mathmit{P}": "????",
"\\mathmit{Q}": "????",
"\\mathmit{R}": "????",
"\\mathmit{S}": "????",
"\\mathmit{T}": "????",
"\\mathmit{U}": "????",
"\\mathmit{V}": "????",
"\\mathmit{W}": "????",
"\\mathmit{X}": "????",
"\\mathmit{Y}": "????",
"\\mathmit{Z}": "????",
"\\mathmit{a}": "????",
"\\mathmit{b}": "????",
"\\mathmit{c}": "????",
"\\mathmit{d}": "????",
"\\mathmit{e}": "????",
"\\mathmit{f}": "????",
"\\mathmit{g}": "????",
"\\mathmit{i}": "????",
"\\mathmit{j}": "????",
"\\mathmit{k}": "????",
"\\mathmit{l}": "????",
"\\mathmit{m}": "????",
"\\mathmit{n}": "????",
"\\mathmit{o}": "????",
"\\mathmit{p}": "????",
"\\mathmit{q}": "????",
"\\mathmit{r}": "????",
"\\mathmit{s}": "????",
"\\mathmit{t}": "????",
"\\mathmit{u}": "????",
"\\mathmit{v}": "????",
"\\mathmit{w}": "????",
"\\mathmit{x}": "????",
"\\mathmit{y}": "????",
"\\mathmit{z}": "????",
"\\mathbit{A}": "????",
"\\mathbit{B}": "????",
"\\mathbit{C}": "????",
"\\mathbit{D}": "????",
"\\mathbit{E}": "????",
"\\mathbit{F}": "????",
"\\mathbit{G}": "????",
"\\mathbit{H}": "????",
"\\mathbit{I}": "????",
"\\mathbit{J}": "????",
"\\mathbit{K}": "????",
"\\mathbit{L}": "????",
"\\mathbit{M}": "????",
"\\mathbit{N}": "????",
"\\mathbit{O}": "????",
"\\mathbit{P}": "????",
"\\mathbit{Q}": "????",
"\\mathbit{R}": "????",
"\\mathbit{S}": "????",
"\\mathbit{T}": "????",
"\\mathbit{U}": "????",
"\\mathbit{V}": "????",
"\\mathbit{W}": "????",
"\\mathbit{X}": "????",
"\\mathbit{Y}": "????",
"\\mathbit{Z}": "????",
"\\mathbit{a}": "????",
"\\mathbit{b}": "????",
"\\mathbit{c}": "????",
"\\mathbit{d}": "????",
"\\mathbit{e}": "????",
"\\mathbit{f}": "????",
"\\mathbit{g}": "????",
"\\mathbit{h}": "????",
"\\mathbit{i}": "????",
"\\mathbit{j}": "????",
"\\mathbit{k}": "????",
"\\mathbit{l}": "????",
"\\mathbit{m}": "????",
"\\mathbit{n}": "????",
"\\mathbit{o}": "????",
"\\mathbit{p}": "????",
"\\mathbit{q}": "????",
"\\mathbit{r}": "????",
"\\mathbit{s}": "????",
"\\mathbit{t}": "????",
"\\mathbit{u}": "????",
"\\mathbit{v}": "????",
"\\mathbit{w}": "????",
"\\mathbit{x}": "????",
"\\mathbit{y}": "????",
"\\mathbit{z}": "????",
"\\mathscr{A}": "????",
"\\mathscr{C}": "????",
"\\mathscr{D}": "????",
"\\mathscr{G}": "????",
"\\mathscr{J}": "????",
"\\mathscr{K}": "????",
"\\mathscr{N}": "????",
"\\mathscr{O}": "????",
"\\mathscr{P}": "????",
"\\mathscr{Q}": "????",
"\\mathscr{S}": "????",
"\\mathscr{T}": "????",
"\\mathscr{U}": "????",
"\\mathscr{V}": "????",
"\\mathscr{W}": "????",
"\\mathscr{X}": "????",
"\\mathscr{Y}": "????",
"\\mathscr{Z}": "????",
"\\mathscr{a}": "????",
"\\mathscr{b}": "????",
"\\mathscr{c}": "????",
"\\mathscr{d}": "????",
"\\mathscr{f}": "????",
"\\mathscr{h}": "????",
"\\mathscr{i}": "????",
"\\mathscr{j}": "????",
"\\mathscr{k}": "????",
"\\mathscr{m}": "????",
"\\mathscr{n}": "????",
"\\mathscr{p}": "????",
"\\mathscr{q}": "????",
"\\mathscr{r}": "????",
"\\mathscr{s}": "????",
"\\mathscr{t}": "????",
"\\mathscr{u}": "????",
"\\mathscr{v}": "????",
"\\mathscr{w}": "????",
"\\mathscr{x}": "????",
"\\mathscr{y}": "????",
"\\mathscr{z}": "????",
"\\mathbcal{A}": "????",
"\\mathbcal{B}": "????",
"\\mathbcal{C}": "????",
"\\mathbcal{D}": "????",
"\\mathbcal{E}": "????",
"\\mathbcal{F}": "????",
"\\mathbcal{G}": "????",
"\\mathbcal{H}": "????",
"\\mathbcal{I}": "????",
"\\mathbcal{J}": "????",
"\\mathbcal{K}": "????",
"\\mathbcal{L}": "????",
"\\mathbcal{M}": "????",
"\\mathbcal{N}": "????",
"\\mathbcal{O}": "????",
"\\mathbcal{P}": "????",
"\\mathbcal{Q}": "????",
"\\mathbcal{R}": "????",
"\\mathbcal{S}": "????",
"\\mathbcal{T}": "????",
"\\mathbcal{U}": "????",
"\\mathbcal{V}": "????",
"\\mathbcal{W}": "????",
"\\mathbcal{X}": "????",
"\\mathbcal{Y}": "????",
"\\mathbcal{Z}": "????",
"\\mathbcal{a}": "????",
"\\mathbcal{b}": "????",
"\\mathbcal{c}": "????",
"\\mathbcal{d}": "????",
"\\mathbcal{e}": "????",
"\\mathbcal{f}": "????",
"\\mathbcal{g}": "????",
"\\mathbcal{h}": "????",
"\\mathbcal{i}": "????",
"\\mathbcal{j}": "????",
"\\mathbcal{k}": "????",
"\\mathbcal{l}": "????",
"\\mathbcal{m}": "????",
"\\mathbcal{n}": "????",
"\\mathbcal{o}": "????",
"\\mathbcal{p}": "????",
"\\mathbcal{q}": "????",
"\\mathbcal{r}": "????",
"\\mathbcal{s}": "????",
"\\mathbcal{t}": "????",
"\\mathbcal{u}": "????",
"\\mathbcal{v}": "????",
"\\mathbcal{w}": "????",
"\\mathbcal{x}": "????",
"\\mathbcal{y}": "????",
"\\mathbcal{z}": "????",
"\\mathfrak{A}": "????",
"\\mathfrak{B}": "????",
"\\mathfrak{D}": "????",
"\\mathfrak{E}": "????",
"\\mathfrak{F}": "????",
"\\mathfrak{G}": "????",
"\\mathfrak{J}": "????",
"\\mathfrak{K}": "????",
"\\mathfrak{L}": "????",
"\\mathfrak{M}": "????",
"\\mathfrak{N}": "????",
"\\mathfrak{O}": "????",
"\\mathfrak{P}": "????",
"\\mathfrak{Q}": "????",
"\\mathfrak{S}": "????",
"\\mathfrak{T}": "????",
"\\mathfrak{U}": "????",
"\\mathfrak{V}": "????",
"\\mathfrak{W}": "????",
"\\mathfrak{X}": "????",
"\\mathfrak{Y}": "????",
"\\mathfrak{a}": "????",
"\\mathfrak{b}": "????",
"\\mathfrak{c}": "????",
"\\mathfrak{d}": "????",
"\\mathfrak{e}": "????",
"\\mathfrak{f}": "????",
"\\mathfrak{g}": "????",
"\\mathfrak{h}": "????",
"\\mathfrak{i}": "????",
"\\mathfrak{j}": "????",
"\\mathfrak{k}": "????",
"\\mathfrak{l}": "????",
"\\mathfrak{m}": "????",
"\\mathfrak{n}": "????",
"\\mathfrak{o}": "????",
"\\mathfrak{p}": "????",
"\\mathfrak{q}": "????",
"\\mathfrak{r}": "????",
"\\mathfrak{s}": "????",
"\\mathfrak{t}": "????",
"\\mathfrak{u}": "????",
"\\mathfrak{v}": "????",
"\\mathfrak{w}": "????",
"\\mathfrak{x}": "????",
"\\mathfrak{y}": "????",
"\\mathfrak{z}": "????",
"\\mathbb{A}": "????",
"\\mathbb{B}": "????",
"\\mathbb{D}": "????",
"\\mathbb{E}": "????",
"\\mathbb{F}": "????",
"\\mathbb{G}": "????",
"\\mathbb{I}": "????",
"\\mathbb{J}": "????",
"\\mathbb{K}": "????",
"\\mathbb{L}": "????",
"\\mathbb{M}": "????",
"\\mathbb{O}": "????",
"\\mathbb{S}": "????",
"\\mathbb{T}": "????",
"\\mathbb{U}": "????",
"\\mathbb{V}": "????",
"\\mathbb{W}": "????",
"\\mathbb{X}": "????",
"\\mathbb{Y}": "????",
"\\mathbb{a}": "????",
"\\mathbb{b}": "????",
"\\mathbb{c}": "????",
"\\mathbb{d}": "????",
"\\mathbb{e}": "????",
"\\mathbb{f}": "????",
"\\mathbb{g}": "????",
"\\mathbb{h}": "????",
"\\mathbb{i}": "????",
"\\mathbb{j}": "????",
"\\mathbb{k}": "????",
"\\mathbb{l}": "????",
"\\mathbb{m}": "????",
"\\mathbb{n}": "????",
"\\mathbb{o}": "????",
"\\mathbb{p}": "????",
"\\mathbb{q}": "????",
"\\mathbb{r}": "????",
"\\mathbb{s}": "????",
"\\mathbb{t}": "????",
"\\mathbb{u}": "????",
"\\mathbb{v}": "????",
"\\mathbb{w}": "????",
"\\mathbb{x}": "????",
"\\mathbb{y}": "????",
"\\mathbb{z}": "????",
"\\mathbfrak{A}": "????",
"\\mathbfrak{B}": "????",
"\\mathbfrak{C}": "????",
"\\mathbfrak{D}": "????",
"\\mathbfrak{E}": "????",
"\\mathbfrak{F}": "????",
"\\mathbfrak{G}": "????",
"\\mathbfrak{H}": "????",
"\\mathbfrak{I}": "????",
"\\mathbfrak{J}": "????",
"\\mathbfrak{K}": "????",
"\\mathbfrak{L}": "????",
"\\mathbfrak{M}": "????",
"\\mathbfrak{N}": "????",
"\\mathbfrak{O}": "????",
"\\mathbfrak{P}": "????",
"\\mathbfrak{Q}": "????",
"\\mathbfrak{R}": "????",
"\\mathbfrak{S}": "????",
"\\mathbfrak{T}": "????",
"\\mathbfrak{U}": "????",
"\\mathbfrak{V}": "????",
"\\mathbfrak{W}": "????",
"\\mathbfrak{X}": "????",
"\\mathbfrak{Y}": "????",
"\\mathbfrak{Z}": "????",
"\\mathbfrak{a}": "????",
"\\mathbfrak{b}": "????",
"\\mathbfrak{c}": "????",
"\\mathbfrak{d}": "????",
"\\mathbfrak{e}": "????",
"\\mathbfrak{f}": "????",
"\\mathbfrak{g}": "????",
"\\mathbfrak{h}": "????",
"\\mathbfrak{i}": "????",
"\\mathbfrak{j}": "????",
"\\mathbfrak{k}": "????",
"\\mathbfrak{l}": "????",
"\\mathbfrak{m}": "????",
"\\mathbfrak{n}": "????",
"\\mathbfrak{o}": "????",
"\\mathbfrak{p}": "????",
"\\mathbfrak{q}": "????",
"\\mathbfrak{r}": "????",
"\\mathbfrak{s}": "????",
"\\mathbfrak{t}": "????",
"\\mathbfrak{u}": "????",
"\\mathbfrak{v}": "????",
"\\mathbfrak{w}": "????",
"\\mathbfrak{x}": "????",
"\\mathbfrak{y}": "????",
"\\mathbfrak{z}": "????",
"\\mathsf{A}": "????",
"\\mathsf{B}": "????",
"\\mathsf{C}": "????",
"\\mathsf{D}": "????",
"\\mathsf{E}": "????",
"\\mathsf{F}": "????",
"\\mathsf{G}": "????",
"\\mathsf{H}": "????",
"\\mathsf{I}": "????",
"\\mathsf{J}": "????",
"\\mathsf{K}": "????",
"\\mathsf{L}": "????",
"\\mathsf{M}": "????",
"\\mathsf{N}": "????",
"\\mathsf{O}": "????",
"\\mathsf{P}": "????",
"\\mathsf{Q}": "????",
"\\mathsf{R}": "????",
"\\mathsf{S}": "????",
"\\mathsf{T}": "????",
"\\mathsf{U}": "????",
"\\mathsf{V}": "????",
"\\mathsf{W}": "????",
"\\mathsf{X}": "????",
"\\mathsf{Y}": "????",
"\\mathsf{Z}": "????",
"\\mathsf{a}": "????",
"\\mathsf{b}": "????",
"\\mathsf{c}": "????",
"\\mathsf{d}": "????",
"\\mathsf{e}": "????",
"\\mathsf{f}": "????",
"\\mathsf{g}": "????",
"\\mathsf{h}": "????",
"\\mathsf{i}": "????",
"\\mathsf{j}": "????",
"\\mathsf{k}": "????",
"\\mathsf{l}": "????",
"\\mathsf{m}": "????",
"\\mathsf{n}": "????",
"\\mathsf{o}": "????",
"\\mathsf{p}": "????",
"\\mathsf{q}": "????",
"\\mathsf{r}": "????",
"\\mathsf{s}": "????",
"\\mathsf{t}": "????",
"\\mathsf{u}": "????",
"\\mathsf{v}": "????",
"\\mathsf{w}": "????",
"\\mathsf{x}": "????",
"\\mathsf{y}": "????",
"\\mathsf{z}": "????",
"\\mathsfbf{A}": "????",
"\\mathsfbf{B}": "????",
"\\mathsfbf{C}": "????",
"\\mathsfbf{D}": "????",
"\\mathsfbf{E}": "????",
"\\mathsfbf{F}": "????",
"\\mathsfbf{G}": "????",
"\\mathsfbf{H}": "????",
"\\mathsfbf{I}": "????",
"\\mathsfbf{J}": "????",
"\\mathsfbf{K}": "????",
"\\mathsfbf{L}": "????",
"\\mathsfbf{M}": "????",
"\\mathsfbf{N}": "????",
"\\mathsfbf{O}": "????",
"\\mathsfbf{P}": "????",
"\\mathsfbf{Q}": "????",
"\\mathsfbf{R}": "????",
"\\mathsfbf{S}": "????",
"\\mathsfbf{T}": "????",
"\\mathsfbf{U}": "????",
"\\mathsfbf{V}": "????",
"\\mathsfbf{W}": "????",
"\\mathsfbf{X}": "????",
"\\mathsfbf{Y}": "????",
"\\mathsfbf{Z}": "????",
"\\mathsfbf{a}": "????",
"\\mathsfbf{b}": "????",
"\\mathsfbf{c}": "????",
"\\mathsfbf{d}": "????",
"\\mathsfbf{e}": "????",
"\\mathsfbf{f}": "????",
"\\mathsfbf{g}": "????",
"\\mathsfbf{h}": "????",
"\\mathsfbf{i}": "????",
"\\mathsfbf{j}": "????",
"\\mathsfbf{k}": "????",
"\\mathsfbf{l}": "????",
"\\mathsfbf{m}": "????",
"\\mathsfbf{n}": "????",
"\\mathsfbf{o}": "????",
"\\mathsfbf{p}": "????",
"\\mathsfbf{q}": "????",
"\\mathsfbf{r}": "????",
"\\mathsfbf{s}": "????",
"\\mathsfbf{t}": "????",
"\\mathsfbf{u}": "????",
"\\mathsfbf{v}": "????",
"\\mathsfbf{w}": "????",
"\\mathsfbf{x}": "????",
"\\mathsfbf{y}": "????",
"\\mathsfbf{z}": "????",
"\\mathsfsl{A}": "????",
"\\mathsfsl{B}": "????",
"\\mathsfsl{C}": "????",
"\\mathsfsl{D}": "????",
"\\mathsfsl{E}": "????",
"\\mathsfsl{F}": "????",
"\\mathsfsl{G}": "????",
"\\mathsfsl{H}": "????",
"\\mathsfsl{I}": "????",
"\\mathsfsl{J}": "????",
"\\mathsfsl{K}": "????",
"\\mathsfsl{L}": "????",
"\\mathsfsl{M}": "????",
"\\mathsfsl{N}": "????",
"\\mathsfsl{O}": "????",
"\\mathsfsl{P}": "????",
"\\mathsfsl{Q}": "????",
"\\mathsfsl{R}": "????",
"\\mathsfsl{S}": "????",
"\\mathsfsl{T}": "????",
"\\mathsfsl{U}": "????",
"\\mathsfsl{V}": "????",
"\\mathsfsl{W}": "????",
"\\mathsfsl{X}": "????",
"\\mathsfsl{Y}": "????",
"\\mathsfsl{Z}": "????",
"\\mathsfsl{a}": "????",
"\\mathsfsl{b}": "????",
"\\mathsfsl{c}": "????",
"\\mathsfsl{d}": "????",
"\\mathsfsl{e}": "????",
"\\mathsfsl{f}": "????",
"\\mathsfsl{g}": "????",
"\\mathsfsl{h}": "????",
"\\mathsfsl{i}": "????",
"\\mathsfsl{j}": "????",
"\\mathsfsl{k}": "????",
"\\mathsfsl{l}": "????",
"\\mathsfsl{m}": "????",
"\\mathsfsl{n}": "????",
"\\mathsfsl{o}": "????",
"\\mathsfsl{p}": "????",
"\\mathsfsl{q}": "????",
"\\mathsfsl{r}": "????",
"\\mathsfsl{s}": "????",
"\\mathsfsl{t}": "????",
"\\mathsfsl{u}": "????",
"\\mathsfsl{v}": "????",
"\\mathsfsl{w}": "????",
"\\mathsfsl{x}": "????",
"\\mathsfsl{y}": "????",
"\\mathsfsl{z}": "????",
"\\mathsfbfsl{A}": "????",
"\\mathsfbfsl{B}": "????",
"\\mathsfbfsl{C}": "????",
"\\mathsfbfsl{D}": "????",
"\\mathsfbfsl{E}": "????",
"\\mathsfbfsl{F}": "????",
"\\mathsfbfsl{G}": "????",
"\\mathsfbfsl{H}": "????",
"\\mathsfbfsl{I}": "????",
"\\mathsfbfsl{J}": "????",
"\\mathsfbfsl{K}": "????",
"\\mathsfbfsl{L}": "????",
"\\mathsfbfsl{M}": "????",
"\\mathsfbfsl{N}": "????",
"\\mathsfbfsl{O}": "????",
"\\mathsfbfsl{P}": "????",
"\\mathsfbfsl{Q}": "????",
"\\mathsfbfsl{R}": "????",
"\\mathsfbfsl{S}": "????",
"\\mathsfbfsl{T}": "????",
"\\mathsfbfsl{U}": "????",
"\\mathsfbfsl{V}": "????",
"\\mathsfbfsl{W}": "????",
"\\mathsfbfsl{X}": "????",
"\\mathsfbfsl{Y}": "????",
"\\mathsfbfsl{Z}": "????",
"\\mathsfbfsl{a}": "????",
"\\mathsfbfsl{b}": "????",
"\\mathsfbfsl{c}": "????",
"\\mathsfbfsl{d}": "????",
"\\mathsfbfsl{e}": "????",
"\\mathsfbfsl{f}": "????",
"\\mathsfbfsl{g}": "????",
"\\mathsfbfsl{h}": "????",
"\\mathsfbfsl{i}": "????",
"\\mathsfbfsl{j}": "????",
"\\mathsfbfsl{k}": "????",
"\\mathsfbfsl{l}": "????",
"\\mathsfbfsl{m}": "????",
"\\mathsfbfsl{n}": "????",
"\\mathsfbfsl{o}": "????",
"\\mathsfbfsl{p}": "????",
"\\mathsfbfsl{q}": "????",
"\\mathsfbfsl{r}": "????",
"\\mathsfbfsl{s}": "????",
"\\mathsfbfsl{t}": "????",
"\\mathsfbfsl{u}": "????",
"\\mathsfbfsl{v}": "????",
"\\mathsfbfsl{w}": "????",
"\\mathsfbfsl{x}": "????",
"\\mathsfbfsl{y}": "????",
"\\mathsfbfsl{z}": "????",
"\\mathtt{A}": "????",
"\\mathtt{B}": "????",
"\\mathtt{C}": "????",
"\\mathtt{D}": "????",
"\\mathtt{E}": "????",
"\\mathtt{F}": "????",
"\\mathtt{G}": "????",
"\\mathtt{H}": "????",
"\\mathtt{I}": "????",
"\\mathtt{J}": "????",
"\\mathtt{K}": "????",
"\\mathtt{L}": "????",
"\\mathtt{M}": "????",
"\\mathtt{N}": "????",
"\\mathtt{O}": "????",
"\\mathtt{P}": "????",
"\\mathtt{Q}": "????",
"\\mathtt{R}": "????",
"\\mathtt{S}": "????",
"\\mathtt{T}": "????",
"\\mathtt{U}": "????",
"\\mathtt{V}": "????",
"\\mathtt{W}": "????",
"\\mathtt{X}": "????",
"\\mathtt{Y}": "????",
"\\mathtt{Z}": "????",
"\\mathtt{a}": "????",
"\\mathtt{b}": "????",
"\\mathtt{c}": "????",
"\\mathtt{d}": "????",
"\\mathtt{e}": "????",
"\\mathtt{f}": "????",
"\\mathtt{g}": "????",
"\\mathtt{h}": "????",
"\\mathtt{i}": "????",
"\\mathtt{j}": "????",
"\\mathtt{k}": "????",
"\\mathtt{l}": "????",
"\\mathtt{m}": "????",
"\\mathtt{n}": "????",
"\\mathtt{o}": "????",
"\\mathtt{p}": "????",
"\\mathtt{q}": "????",
"\\mathtt{r}": "????",
"\\mathtt{s}": "????",
"\\mathtt{t}": "????",
"\\mathtt{u}": "????",
"\\mathtt{v}": "????",
"\\mathtt{w}": "????",
"\\mathtt{x}": "????",
"\\mathtt{y}": "????",
"\\mathtt{z}": "????",
"\\mathbf{\\Alpha}": "????",
"\\mathbf{\\Beta}": "????",
"\\mathbf{\\Gamma}": "????",
"\\mathbf{\\Delta}": "????",
"\\mathbf{\\Epsilon}": "????",
"\\mathbf{\\Zeta}": "????",
"\\mathbf{\\Eta}": "????",
"\\mathbf{\\Theta}": "????",
"\\mathbf{\\Iota}": "????",
"\\mathbf{\\Kappa}": "????",
"\\mathbf{\\Lambda}": "????",
"\\mathbf{\\Xi}": "????",
"\\mathbf{\\Pi}": "????",
"\\mathbf{\\Rho}": "????",
"\\mathbf{\\vartheta}": "????",
"\\mathbf{\\Sigma}": "????",
"\\mathbf{\\Tau}": "????",
"\\mathbf{\\Upsilon}": "????",
"\\mathbf{\\Phi}": "????",
"\\mathbf{\\Chi}": "????",
"\\mathbf{\\Psi}": "????",
"\\mathbf{\\Omega}": "????",
"\\mathbf{\\nabla}": "????",
"\\mathbf{\\alpha}": "????",
"\\mathbf{\\beta}": "????",
"\\mathbf{\\gamma}": "????",
"\\mathbf{\\delta}": "????",
"\\mathbf{\\epsilon}": "????",
"\\mathbf{\\zeta}": "????",
"\\mathbf{\\eta}": "????",
"\\mathbf{\\theta}": "????",
"\\mathbf{\\iota}": "????",
"\\mathbf{\\kappa}": "????",
"\\mathbf{\\lambda}": "????",
"\\mathbf{\\mu}": "????",
"\\mathbf{\\nu}": "????",
"\\mathbf{\\xi}": "????",
"\\mathbf{\\pi}": "????",
"\\mathbf{\\rho}": "????",
"\\mathbf{\\varsigma}": "????",
"\\mathbf{\\sigma}": "????",
"\\mathbf{\\tau}": "????",
"\\mathbf{\\upsilon}": "????",
"\\mathbf{\\phi}": "????",
"\\mathbf{\\chi}": "????",
"\\mathbf{\\psi}": "????",
"\\mathbf{\\omega}": "????",
"\\mathbf{\\varepsilon}": "????",
"\\mathbf{\\varkappa}": "????",
"\\mathbf{\\varrho}": "????",
"\\mathbf{\\varpi}": "????",
"\\mathmit{\\Alpha}": "????",
"\\mathmit{\\Beta}": "????",
"\\mathmit{\\Gamma}": "????",
"\\mathmit{\\Delta}": "????",
"\\mathmit{\\Epsilon}": "????",
"\\mathmit{\\Zeta}": "????",
"\\mathmit{\\Eta}": "????",
"\\mathmit{\\Theta}": "????",
"\\mathmit{\\Iota}": "????",
"\\mathmit{\\Kappa}": "????",
"\\mathmit{\\Lambda}": "????",
"\\mathmit{\\Xi}": "????",
"\\mathmit{\\Pi}": "????",
"\\mathmit{\\Rho}": "????",
"\\mathmit{\\vartheta}": "????",
"\\mathmit{\\Sigma}": "????",
"\\mathmit{\\Tau}": "????",
"\\mathmit{\\Upsilon}": "????",
"\\mathmit{\\Phi}": "????",
"\\mathmit{\\Chi}": "????",
"\\mathmit{\\Psi}": "????",
"\\mathmit{\\Omega}": "????",
"\\mathmit{\\nabla}": "????",
"\\mathmit{\\alpha}": "????",
"\\mathmit{\\beta}": "????",
"\\mathmit{\\gamma}": "????",
"\\mathmit{\\delta}": "????",
"\\mathmit{\\epsilon}": "????",
"\\mathmit{\\zeta}": "????",
"\\mathmit{\\eta}": "????",
"\\mathmit{\\theta}": "????",
"\\mathmit{\\iota}": "????",
"\\mathmit{\\kappa}": "????",
"\\mathmit{\\lambda}": "????",
"\\mathmit{\\mu}": "????",
"\\mathmit{\\nu}": "????",
"\\mathmit{\\xi}": "????",
"\\mathmit{\\pi}": "????",
"\\mathmit{\\rho}": "????",
"\\mathmit{\\varsigma}": "????",
"\\mathmit{\\sigma}": "????",
"\\mathmit{\\tau}": "????",
"\\mathmit{\\upsilon}": "????",
"\\mathmit{\\phi}": "????",
"\\mathmit{\\chi}": "????",
"\\mathmit{\\psi}": "????",
"\\mathmit{\\omega}": "????",
"\\mathmit{\\varkappa}": "????",
"\\mathmit{\\varrho}": "????",
"\\mathmit{\\varpi}": "????",
"\\mathbit{\\Alpha}": "????",
"\\mathbit{\\Beta}": "????",
"\\mathbit{\\Gamma}": "????",
"\\mathbit{\\Delta}": "????",
"\\mathbit{\\Epsilon}": "????",
"\\mathbit{\\Zeta}": "????",
"\\mathbit{\\Eta}": "????",
"\\mathbit{\\Theta}": "????",
"\\mathbit{\\Iota}": "????",
"\\mathbit{\\Kappa}": "????",
"\\mathbit{\\Lambda}": "????",
"\\mathbit{\\Xi}": "????",
"\\mathbit{\\Pi}": "????",
"\\mathbit{\\Rho}": "????",
"\\mathbit{\\Sigma}": "????",
"\\mathbit{\\Tau}": "????",
"\\mathbit{\\Upsilon}": "????",
"\\mathbit{\\Phi}": "????",
"\\mathbit{\\Chi}": "????",
"\\mathbit{\\Psi}": "????",
"\\mathbit{\\Omega}": "????",
"\\mathbit{\\nabla}": "????",
"\\mathbit{\\alpha}": "????",
"\\mathbit{\\beta}": "????",
"\\mathbit{\\gamma}": "????",
"\\mathbit{\\delta}": "????",
"\\mathbit{\\epsilon}": "????",
"\\mathbit{\\zeta}": "????",
"\\mathbit{\\eta}": "????",
"\\mathbit{\\theta}": "????",
"\\mathbit{\\iota}": "????",
"\\mathbit{\\kappa}": "????",
"\\mathbit{\\lambda}": "????",
"\\mathbit{\\mu}": "????",
"\\mathbit{\\nu}": "????",
"\\mathbit{\\xi}": "????",
"\\mathbit{\\pi}": "????",
"\\mathbit{\\rho}": "????",
"\\mathbit{\\varsigma}": "????",
"\\mathbit{\\sigma}": "????",
"\\mathbit{\\tau}": "????",
"\\mathbit{\\upsilon}": "????",
"\\mathbit{\\phi}": "????",
"\\mathbit{\\chi}": "????",
"\\mathbit{\\psi}": "????",
"\\mathbit{\\omega}": "????",
"\\mathbit{\\vartheta}": "????",
"\\mathbit{\\varkappa}": "????",
"\\mathbit{\\varrho}": "????",
"\\mathbit{\\varpi}": "????",
"\\mathsfbf{\\Alpha}": "????",
"\\mathsfbf{\\Beta}": "????",
"\\mathsfbf{\\Gamma}": "????",
"\\mathsfbf{\\Delta}": "????",
"\\mathsfbf{\\Epsilon}": "????",
"\\mathsfbf{\\Zeta}": "????",
"\\mathsfbf{\\Eta}": "????",
"\\mathsfbf{\\Theta}": "????",
"\\mathsfbf{\\Iota}": "????",
"\\mathsfbf{\\Kappa}": "????",
"\\mathsfbf{\\Lambda}": "????",
"\\mathsfbf{\\Xi}": "????",
"\\mathsfbf{\\Pi}": "????",
"\\mathsfbf{\\Rho}": "????",
"\\mathsfbf{\\vartheta}": "????",
"\\mathsfbf{\\Sigma}": "????",
"\\mathsfbf{\\Tau}": "????",
"\\mathsfbf{\\Upsilon}": "????",
"\\mathsfbf{\\Phi}": "????",
"\\mathsfbf{\\Chi}": "????",
"\\mathsfbf{\\Psi}": "????",
"\\mathsfbf{\\Omega}": "????",
"\\mathsfbf{\\nabla}": "????",
"\\mathsfbf{\\alpha}": "????",
"\\mathsfbf{\\beta}": "????",
"\\mathsfbf{\\gamma}": "????",
"\\mathsfbf{\\delta}": "????",
"\\mathsfbf{\\epsilon}": "????",
"\\mathsfbf{\\zeta}": "????",
"\\mathsfbf{\\eta}": "????",
"\\mathsfbf{\\theta}": "????",
"\\mathsfbf{\\iota}": "????",
"\\mathsfbf{\\kappa}": "????",
"\\mathsfbf{\\lambda}": "????",
"\\mathsfbf{\\mu}": "????",
"\\mathsfbf{\\nu}": "????",
"\\mathsfbf{\\xi}": "????",
"\\mathsfbf{\\pi}": "????",
"\\mathsfbf{\\rho}": "????",
"\\mathsfbf{\\varsigma}": "????",
"\\mathsfbf{\\sigma}": "????",
"\\mathsfbf{\\tau}": "????",
"\\mathsfbf{\\upsilon}": "????",
"\\mathsfbf{\\phi}": "????",
"\\mathsfbf{\\chi}": "????",
"\\mathsfbf{\\psi}": "????",
"\\mathsfbf{\\omega}": "????",
"\\mathsfbf{\\varepsilon}": "????",
"\\mathsfbf{\\varkappa}": "????",
"\\mathsfbf{\\varrho}": "????",
"\\mathsfbf{\\varpi}": "????",
"\\mathsfbfsl{\\Alpha}": "????",
"\\mathsfbfsl{\\Beta}": "????",
"\\mathsfbfsl{\\Gamma}": "????",
"\\mathsfbfsl{\\Delta}": "????",
"\\mathsfbfsl{\\Epsilon}": "????",
"\\mathsfbfsl{\\Zeta}": "????",
"\\mathsfbfsl{\\Eta}": "????",
"\\mathsfbfsl{\\vartheta}": "????",
"\\mathsfbfsl{\\Iota}": "????",
"\\mathsfbfsl{\\Kappa}": "????",
"\\mathsfbfsl{\\Lambda}": "????",
"\\mathsfbfsl{\\Xi}": "????",
"\\mathsfbfsl{\\Pi}": "????",
"\\mathsfbfsl{\\Rho}": "????",
"\\mathsfbfsl{\\Sigma}": "????",
"\\mathsfbfsl{\\Tau}": "????",
"\\mathsfbfsl{\\Upsilon}": "????",
"\\mathsfbfsl{\\Phi}": "????",
"\\mathsfbfsl{\\Chi}": "????",
"\\mathsfbfsl{\\Psi}": "????",
"\\mathsfbfsl{\\Omega}": "????",
"\\mathsfbfsl{\\nabla}": "????",
"\\mathsfbfsl{\\alpha}": "????",
"\\mathsfbfsl{\\beta}": "????",
"\\mathsfbfsl{\\gamma}": "????",
"\\mathsfbfsl{\\delta}": "????",
"\\mathsfbfsl{\\epsilon}": "????",
"\\mathsfbfsl{\\zeta}": "????",
"\\mathsfbfsl{\\eta}": "????",
"\\mathsfbfsl{\\iota}": "????",
"\\mathsfbfsl{\\kappa}": "????",
"\\mathsfbfsl{\\lambda}": "????",
"\\mathsfbfsl{\\mu}": "????",
"\\mathsfbfsl{\\nu}": "????",
"\\mathsfbfsl{\\xi}": "????",
"\\mathsfbfsl{\\pi}": "????",
"\\mathsfbfsl{\\rho}": "????",
"\\mathsfbfsl{\\varsigma}": "????",
"\\mathsfbfsl{\\sigma}": "????",
"\\mathsfbfsl{\\tau}": "????",
"\\mathsfbfsl{\\upsilon}": "????",
"\\mathsfbfsl{\\phi}": "????",
"\\mathsfbfsl{\\chi}": "????",
"\\mathsfbfsl{\\psi}": "????",
"\\mathsfbfsl{\\omega}": "????",
"\\mathsfbfsl{\\varkappa}": "????",
"\\mathsfbfsl{\\varrho}": "????",
"\\mathsfbfsl{\\varpi}": "????",
"\\mathbf{0}": "????",
"\\mathbf{1}": "????",
"\\mathbf{2}": "????",
"\\mathbf{3}": "????",
"\\mathbf{4}": "????",
"\\mathbf{5}": "????",
"\\mathbf{6}": "????",
"\\mathbf{7}": "????",
"\\mathbf{8}": "????",
"\\mathbf{9}": "????",
"\\mathbb{0}": "????",
"\\mathbb{1}": "????",
"\\mathbb{2}": "????",
"\\mathbb{3}": "????",
"\\mathbb{4}": "????",
"\\mathbb{5}": "????",
"\\mathbb{6}": "????",
"\\mathbb{7}": "????",
"\\mathbb{8}": "????",
"\\mathbb{9}": "????",
"\\mathsf{0}": "????",
"\\mathsf{1}": "????",
"\\mathsf{2}": "????",
"\\mathsf{3}": "????",
"\\mathsf{4}": "????",
"\\mathsf{5}": "????",
"\\mathsf{6}": "????",
"\\mathsf{7}": "????",
"\\mathsf{8}": "????",
"\\mathsf{9}": "????",
"\\mathsfbf{0}": "????",
"\\mathsfbf{1}": "????",
"\\mathsfbf{2}": "????",
"\\mathsfbf{3}": "????",
"\\mathsfbf{4}": "????",
"\\mathsfbf{5}": "????",
"\\mathsfbf{6}": "????",
"\\mathsfbf{7}": "????",
"\\mathsfbf{8}": "????",
"\\mathsfbf{9}": "????",
"\\mathtt{0}": "????",
"\\mathtt{1}": "????",
"\\mathtt{2}": "????",
"\\mathtt{3}": "????",
"\\mathtt{4}": "????",
"\\mathtt{5}": "????",
"\\mathtt{6}": "????",
"\\mathtt{7}": "????",
"\\mathtt{8}": "????",
"\\mathtt{9}": "????"
}        
     for (var idx in this.orcidLatexCharMap) {
         if (this.orcidLatexCharMap[idx].length > this.maxLatexLength)
           this.maxLatexLength = this.orcidLatexCharMap[idx].length;
         this.orcidCharLatexMap[this.orcidLatexCharMap[idx]] = idx;
     }

     for (var idx in this.w3cLatexCharMap) {
         if (this.w3cLatexCharMap[idx].length > this.maxLatexLength)
           this.maxLatexLength = this.w3cLatexCharMap[idx].length;
         this.w3cCharLatexMap[this.w3cLatexCharMap[idx]] = idx;
     }

     this.getUni = function(latex) {
         if (this.w3cLatexCharMap[latex]) 
             return this.w3cLatexCharMap[latex];
         return this.orcidLatexCharMap[latex];
     };

     this.hasLatexMatch = function (latex) {
         return latex in this.orcidLatexCharMap
             || latex in this.w3cLatexCharMap;
     };

     this.getLatex = function(uni) {
         if (this.w3cCharLatexMap[uni])
             return this.w3cCharLatexMap[uni]
         return this.orcidCharLatexMap[uni];
     };

     this.hasUniMatch = function (uni) {
         return uni in this.orcidCharLatexMap
             ||  uni in this.w3cCharLatexMap;
     };

     this.longestEscapeMatch = function(value, pos) {
         var subStringEnd =  pos + 1 + this.maxLatexLength <= value.length ?
                     pos + 1 + this.maxLatexLength : value.length;
         var subStr =  value.substring(pos,subStringEnd);                    
         while (subStr.length > 0) {
          if (this.hasLatexMatch(subStr)) {
             break;
          }
          subStr = subStr.substring(0,subStr.length -1);
         }
         return subStr;
     }
     
     
 };



 var latexToUTF8 = new LatexToUTF8();
 
 exports.decodeLatex = function(value) {
     var newVal = '';
     var pos = 0;
     while (pos < value.length) {
         if (value[pos] == '\\') {
             var match = latexToUTF8.longestEscapeMatch(value, pos);
             if (match.length > 0) {
                 newVal += latexToUTF8.getUni(match);
                 pos = pos + match.length;
             } else {
                 newVal += value[pos];
                 pos++;
             }
         } else if (value[pos] == '{' || value[pos] == '}') {
           pos++;
         } else {
             newVal += value[pos];
             pos++;
         }
     }
     return newVal;
 }

 exports.encodeLatex = function(value) {
     var trans = '';
     for (var idx = 0; idx < value.length; ++idx) {
         var c = value.charAt(idx);
         if (this.hasUniMatch(c))
             trans += latexToUTF8.getLatex(c);
         else
             trans += c;
     }
     return trans;
 }


})(typeof exports === 'undefined' ? this['latexParseJs'] = {} : exports);

/* end latex */



/* START: workIdLinkJs v0.0.8 */
/* https://github.com/ORCID/workIdLinkJs */

/* browser and NodeJs compatible */
(function(exports){

   // add new method to string
   if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function (str){
         return this.slice(0, str.length) == str;
      };
   }

   //add new method to string
   if (typeof String.prototype.endsWith != 'function') {
      String.prototype.endsWith = function (str){
         return this.slice(-str.length) == str;
      };
   }

   //add new method to string
   if (typeof String.prototype.trim != 'function') {  
      String.prototype.trim = function () {  
         return this.replace(/^\s+|\s+$/g,'');  
      };  
   }

   var typeMap = {};
   
   typeMap.hasOwnProperty = function(property) {
      return typeMap[property] !== undefined;
   };
   
   typeMap['arxiv'] = function (id) {
      if (id.toLowerCase().startsWith('arxiv.org')) return 'http://' + id;
      if (id.startsWith('arXiv:')) return 'http://arxiv.org/abs/' + id.substring(6);
      return 'http://arxiv.org/abs/' + id;
   };
   
   typeMap['asin'] = function (id) {
      if (id.toLowerCase().startsWith('amazon.') || id.startsWith('www.amazon.')) return 'http://' + id;
      return 'http://www.amazon.com/dp/' + id;
   };

   typeMap['bibcode'] = function (id) {
      if (id.toLowerCase().startsWith('adsabs.harvard.edu')) return 'http://' + id;
      return 'http://adsabs.harvard.edu/abs/' + id;
   };
   
   typeMap['doi'] = function (id) {
      if (id.toLowerCase().startsWith('dx.doi.org') || id.toLowerCase().startsWith('doi.org') ) return 'https://' + id;
      return 'https://doi.org/' + id;
   };

   typeMap['ethos'] = function (id) {
      if (id.toLowerCase().startsWith('ethos.bl.uk')) return 'http://' + id;
      return 'http://ethos.bl.uk/OrderDetails.do?uin=' + encodeURIComponent(id);
   };

   typeMap['isbn'] = function (id) {
      if (id.toLowerCase().startsWith('amazon.com/dp/') || id.toLowerCase().startsWith('www.worldcat.org')) return 'http://' + id;
      return 'http://www.worldcat.org/isbn/' + id.replace(/\-/g, '');
   };

   typeMap['jfm'] = function (id) {
      if (id.toLowerCase().startsWith('www.zentralblatt-math.org')) return 'http://' + id;
      if (id.toLowerCase().startsWith('zbmath.org/?q=an:')) return 'http://' + id;
      return 'http://zbmath.org/?q=' + encodeURIComponent('an:' + id ) + '&format=complete';
   };

   typeMap['jstor'] = function (id) {
      if (id.toLowerCase().startsWith('dx.doi.org') || id.startsWith('www.jstor.org')) return 'http://' + id;
      return 'http://www.jstor.org/stable/' + id;
   };

   typeMap['lccn'] = function (id) {
      if (id.toLowerCase().startsWith('lccn.loc.gov')) return 'http://' + id;
      return 'http://lccn.loc.gov/' + id;
   };

   typeMap['mr'] = function (id) {
      id = id.match(/[^\(]*/)[0];
      if (id.toLowerCase().startsWith('ams.org/mathscinet-getitem')) return 'http://' + id;
      return 'http://www.ams.org/mathscinet-getitem?mr=' + encodeURIComponent(id);
   };

   typeMap['oclc'] = function (id) {
      if (id.toLowerCase().startsWith('worldcat.org')) return 'http://' + id;
      return 'http://www.worldcat.org/oclc/' + id;
   };

   typeMap['ol'] = function (id) {
      if (id.toLowerCase().startsWith('openlibrary.org/b/')) return 'http://' + id;
      return 'http://openlibrary.org/b/' + id;
   };
 
   typeMap['osti'] = function (id) {
      if (id.toLowerCase().startsWith('www.osti.gov')) return 'http://' + id;
      return 'http://www.osti.gov/energycitations/product.biblio.jsp?osti_id=' + encodeURIComponent(id);
   };

   typeMap['pmc'] = function (id) { 
      if (id.toLowerCase().startsWith('pmc')) return 'http://europepmc.org/articles/' + id;
      if (id.toLowerCase().startsWith('www.ncbi.nlm.nih.gov')) return 'http://' + id;
      //return 'http://www.ncbi.nlm.nih.gov/pubmed/' + id;
      return 'http://europepmc.org/articles/' + id;
   };

   /* 
    * We need a method of determining www.ncbi.nlm.nih.gov identifiers
    * vs europepmc.org identifiers
    * http://www.ncbi.nlm.nih.gov/pubmed/
    * http://europepmc.org/abstract/med/
    */
   typeMap['pmid'] = function (id) {
      if (id.toLowerCase().startsWith('www.ncbi.nlm.nih.gov')) return 'http://' + id;
      if (id.toLowerCase().startsWith('europepmc.org')) return 'http://' + id;
      return 'http://europepmc.org/abstract/med/' + id;
   };

   typeMap['rfc'] = function (id) {
      id = id.replace(/\s/g,'');
      id = id.toLowerCase();
      if (id.toLowerCase().startsWith('www.rfc-editor.org/rfc/')) return 'http://' + id;
      return 'http://www.rfc-editor.org/rfc/' + id + '.txt';
   };

   typeMap['ssrn'] = function (id) {
      if (id.toLowerCase().startsWith('papers.ssrn.com')) return 'http://' + id;
      return 'http://papers.ssrn.com/abstract_id=' + encodeURIComponent(id);
   };

   typeMap['zbl'] = function (id) {
      if (id.toLowerCase().startsWith('zentralblatt-math.org')) return 'http://' + id;
      if (id.toLowerCase().startsWith('zbmath.org/?q=an')) return 'http://' + id;
      return 'http://zbmath.org/?q=' + encodeURIComponent('an:' + id ) + '&format=complete';
   };
   
   typeMap['kuid'] = function (id) {
       return 'https://koreamed.org/article/' + encodeURIComponent(id);
   };
   
   typeMap['lensid'] = function (id) {
       if (id.toLowerCase().startsWith('www.lens.org')) return 'https://' + id;
       return 'https://www.lens.org/' + encodeURIComponent(id);
   };
   
   typeMap['cienciaiul'] = function (id) {
       return 'https://ciencia.iscte-iul.pt/id/' + encodeURIComponent(id);
   };
   
   typeMap['rrid'] = function (id) {
       return 'http://identifiers.org/rrid/' + encodeURIComponent(id);
   };

   typeMap['authenticusid'] = function (id) {
       return 'https://www.authenticus.pt/' + encodeURIComponent(id);
   };
   
   typeMap['dnb'] = function (id) {
       return 'https://d-nb.info/' + encodeURIComponent(id);
   };

   exports.getLink = function(id, type) {
      if (id == null) id = "";//return null;
      id = id.trim();
      if (id.startsWith('http:') || id.startsWith('https:')) return id;
      if (type == null) return null;
      type = type.toLowerCase();
      if (!typeMap.hasOwnProperty(type)) return null;
      return typeMap[type](id);
    };

   exports.getTypes = function() {
      var types = '';
      for(i in typeMap) {
          if (i != 'hasOwnProperty')
          types = types + ' ' + i;
      }
      return types;
   }

})(typeof exports === 'undefined'? this['workIdLinkJs']={}: exports);

/* END: workIdLinkJs */

/* Mobile detection, useful for colorbox lightboxes resizing */
function isMobile() {
    (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i
            .test((navigator.userAgent || navigator.vendor || window.opera)) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
            .test((navigator.userAgent || navigator.vendor || window.opera)
                    .substr(0, 4))) ? im = true : im = false;
    return im;
};

function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1])
            : false;
}

function getWindowWidth() {
    var windowWidth = 0;
    if (typeof (window.innerWidth) == 'number') {
        windowWidth = window.innerWidth;
    } else {
        if (document.documentElement && document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            if (document.body && document.body.clientWidth) {
                windowWidth = document.body.clientWidth;
            }
        }
    }
    return windowWidth;
};

function iframeResize(putCode){						
	$('#'+putCode).iFrameResize({
		log: false,
		autoResize: true			
	});
}

