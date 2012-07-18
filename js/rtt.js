var jQT = new $.jQTouch(
{
    icon: '../img/jqtouch.png',
    icon4: '../img/jqtouch4.png',
    startupScreen: '../img/jqt_startup.png',
});

var bolLoggedIn = false;
var ticketsLoaded = false;

$(function()
{
    function startsWith(needle, haystack)
    {
        if(haystack.substr(0, needle.length) == needle)
        {
          return true;
        }
        return false;
    }

    function login(usn, pw, func)
    {
        $.post('includes/ticketTracker.php', { username: usn, password: pw, c: '0' }, function(data) 
        {
            // true == valid login | false == unvalid logn -> error msg
            if(startsWith('true', data))
            {
                bolLoggedIn = true;
                func('true');
            }
            else
            {
                func(data);
            }
        });
    }
    
    function loginWithCookie()
    {
        var username = $.cookie("username");
        var password = $.cookie("password");
        if(username == undefined || password == undefined)
        {
            jQT.goTo('#home', 'fade');
        }
        login(username, password, function(answer)
        {
            if(answer != 'true')
            {
                jQT.goTo('#home', 'fade');
            }
            else
            {
                if(ticketsLoaded == false)
                {
                    loadTicketData();
                }
            }
        });
    }
    
    //check for layer ads (free space fix)
    function removeLayerAd(data)
    {
        var idx = data.indexOf('<script type="text/javascript" src="http://view.binlayer.com/ad-12085.js"></script>');
        if(idx != -1)
        {
            data = data.substring(0, idx);
        }
        return data;
    }
    
    function loadTicketData()
    {
        $.post('includes/ticketTracker.php', { c: '1' }, function(data) 
        {
            ticketsLoaded = true;
            data = removeLayerAd(data);
            var html;
            var jsId = eval('(' + data + ')');
            var jsIdArray = jsId.ids;
            $('#ticketList').html($('#ticketLoader'));
            var ticketLoader = $('#ticketLoader');
            for(var i = 0; i<jsIdArray.length; i++)
            {
                loadTicketDataForId(jsIdArray[i], function(jsObj, index)
                {
                    html = '<div class="ticketEntry">'
                    html +=     '<div class="ticketId">' + jsObj.ticket_id + '</div>'
                    html +=     '<div class="ticketCharacterName"></div>'
                    html +=     '<div class="ticketCharacterState"></div>'
                    html +=     '<div class="ticketText">' + jsObj.ticket_text + '</div>'
                    html +=     '<div class="ticketDelete">' + jsObj.ticket_lastchange + '</div>'
                    html += '</div>'
                    ticketLoader.remove();
                    $('#ticketList').append(
                        html,ticketLoader
                    );
                    if(index == jsIdArray.length-1)
                    {
                        ticketLoader.remove();
                    }
                }, i);
            }
        });
    }
    
    function loadTicketDataForId(ID, func, index)
    {
        $.post('includes/ticketTracker.php', { c: '2', ticket: ID}, function(data) {
            data = removeLayerAd(data);
            var jsObj = eval('(' + data + ')');
            func(jsObj, index);
        });
    }
    
    function logout()
    {
        $.post('includes/ticketTracker.php', { c: '6' });
        $.cookie("username", null);
        $.cookie("password", null);
        jQT.goTo('#home', 'slideright');
    }

    function showLoadingDialog()
    {
        var html = '<img style="margin:0px auto;display:block" src="img/ajax-loader.gif" />';
        html    += '<br>';
        html    += '<h3>Loading...</h3>';
        $.blockUI({ 
            message: html 
        })
    }
    
    $('#loginForm').submit(function()
    {
        var username = $('#username').val();
        var password = $('#password').val();
        if(username == '')
        {
            $('#msg').html(
                'Username field is empty !'
            );
            return;
        }
        if(password == '')
        {
            $('#msg').html(
                'Password field is empty !'
            );
            return;
        }
        var encrPw = SHA1(username.toUpperCase() + ":" + password.toUpperCase());
        $.cookie("username", username);
        $.cookie("password", encrPw);
        login(username, encrPw, function(answer) {
            if(answer != 'true')
            {
                $('#msg').html(
                    answer
                );
            }
            else if(answer == 'true')
            {
                jQT.goTo('#ticket', 'slideleft');
            }
            $.unblockUI();
        });
    });
    
    $('#logoutButton').click(function()
    {
        logout();
    });
    $.ajaxSetup({
      error: function(xhr, status, error) {
        alert("An AJAX error occured: " + status + "\nError: " + error);
      }
    });
    
    $(document).ready(function() 
    {
        $('#ticket').bind('pageAnimationEnd', function(event, info){
            if (info.direction == 'in')
            {
                if(bolLoggedIn)
                {
                    loadTicketData();
                }
                else
                {
                    loginWithCookie();
                }
            }
        });

        var selectedPage = $('.current').attr('id');
        if(bolLoggedIn == false && selectedPage != 'home')
        {
            loginWithCookie();
        }
        else if(selectedPage == 'ticket' && bolLoggedIn == true)
        {
            if(ticketsLoaded == false)
            {
                loadTicketData();
            }
        }
});

     
});

