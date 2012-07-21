(function() {
    var jQT = new $.jQTouch(
    {
        icon: '../img/jqtouch.png',
        icon4: '../img/jqtouch4.png',
        startupScreen: '../img/jqt_startup.png',
    });

    var bolLoggedIn = false;
    var ticketsLoaded = false;
    var selectedTicketEntry;
    var accountUsername;
    var charId;
    
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
                accountUsername = usn;
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
    
    function refreshTickets()
    {
        $('#ticketList').append(
            '<img id="ticketLoader" style="margin:0px auto;display:block" src="img/ajax-loader.gif" />'
        );
        ticketsLoaded = false;
        loadTicketData();
    }
    
    function loadTicketData()
    {
        if(ticketsLoaded == true)return;
        $.post('includes/ticketTracker.php', { c: '1' }, function(data) 
        {
            if(ticketsLoaded == true)return;
            ticketsLoaded = true;
            data = removeLayerAd(data);
            var html;
            var jsId = eval('(' + data + ')');
            var jsIdArray = jsId.ids;
            $('#ticketList').html($('#ticketLoader'));
            var ticketLoader = $('#ticketLoader');
            if(jsIdArray.length == 0)
            {
                ticketLoader.remove();
                $('#ticketList').append(
                    '<div class="info">No tickets found !</div>'
                );
                return;
            }
            //its possible that the first ajax request takes longer than the last
            var finishedCount = 0;
            for(var i = 0; i<jsIdArray.length; i++)
            {
                loadTicketDataForId(jsIdArray[i], function(accObj, charObj, index)
                {
                    var charStateClass = 'OFFLINE';
                    if(charObj.online == 1)
                    {
                        charStateClass = 'ONLINE';
                    }
                    html = '<div class="ticketEntry">'
                    html +=     '<div class="ticketId">' + accObj.ticket_id + '</div>'
                    html +=     '<div class="ticketCharacterName">' + charObj.name + '</div>'
                    html +=     '<div class="ticketCharacterState">' + charStateClass + '</div>'
                    html +=     '<div class="ticketText">' + accObj.ticket_text + '</div>'
                    html +=     '<div class="ticketDelete"><img src="./img/delete.png" /></div>'
                    html +=     '<input type="hidden" name="charid" value="' + charObj.guid + '">'
                    html += '</div>'
                    ticketLoader.remove();
                    $('#ticketList').append(
                        html,ticketLoader
                    );
                    finishedCount++;
                    if(finishedCount >= jsIdArray.length-1)
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
            var ticketJsObj = eval('(' + data + ')');
            $.post('includes/ticketTracker.php', { c: '3', charid: ticketJsObj.guid }, function(charData) 
            {
                charData = removeLayerAd(charData);
                var charJsObj = eval('(' + charData + ')');
                func(ticketJsObj, charJsObj, index);
            });
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

    $(function()
    {   
        $('#loginForm').submit(function()
        {
            var username = $('#username').val();
            var password = $('#password').val();
            if(username == '')
            {
                $('#msg').html('Username field is empty !');
                $('#msg').addClass('info');
                return;
            }
            if(password == '')
            {
                $('#msg').html('Password field is empty !');
                $('#msg').addClass('info');
                return;
            }
            var encrPw = SHA1(username.toUpperCase() + ":" + password.toUpperCase());
            $.cookie("username", username);
            $.cookie("password", encrPw);
            login(username, encrPw, function(answer) {
                if(answer != 'true')
                {
                    $('#msg').html(answer);
                    $('#msg').addClass('info');
                }
                else if(answer == 'true')
                {
                    $('#msg').html('');
                    $('#msg').removeClass('info');
                    jQT.goTo('#ticket', 'slideleft');
                }
                $.unblockUI();
            });
        });
    
        $('#sendMailForm').submit(function()
        {
            var subject = $('#subject').val();
            var body = $('#body').val();
            var ticketID = selectedTicketEntry.find('.ticketId').text();
            var gmname = accountUsername;
            var charId = selectedTicketEntry.find('input[name=charid]').val();
            //"charid" "gmname" "subject" "ticketid" "body"
            $.post('includes/ticketTracker.php', { c: '5', charid: charId, gmname: gmname, ticketid: ticketID, subject: subject, body: body }, function(data) 
            {
                jQT.goTo('#ticket', 'slidedown');
            });
        });
    
    
        $('#logoutButton').click(function()
        {
            logout();
        });
        
        $('#refreshButton').click(function()
        {
            refreshTickets();
        });
        
        
        $(document).on('click', '.ticketEntry', function(event)
        {
            selectedTicketEntry = $(this);
            jQT.goTo('#mail', 'slideup');
        });
        
        $(document).on('click', '.ticketDelete', function(event)
        {
            var confirm_result = confirm('Are you sure you want to remove this ticket ?');
            if(confirm_result != true){
                return false;
            }
            var tickEntry = $(this).parent();
            var ticketID = tickEntry.find('.ticketId').text();
            $.post('includes/ticketTracker.php', { c: '4', ticketid: ticketID}, function(data) {
                tickEntry.remove();
            });
            event.stopImmediatePropagation();
        });
        
        $.ajaxSetup({
            error: function(xhr, status, error) {
                alert("An AJAX error occured: " + status + "\nError: " + error);
            }
        });
    
        $('#ticket').bind('pageAnimationEnd', function(event, info) {
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
        if(selectedPage == 'mail')
        {
            if(selectedTicketEntry == undefined)
            {
                jQT.goTo('#ticket', 'slidedown');
            }
        }
    });
})();
