var jQT = new $.jQTouch(
{
    icon: '../img/jqtouch.png',
    icon4: '../img/jqtouch4.png',
    startupScreen: '../img/jqt_startup.png',
});

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

    function login(username, password)
    {
        $.post('includes/ticketTracker.php', { username: username, password: password, c: '0' }, function(data) 
        {
            // true == valid login | false == unvalid logn -> error msg
            if(startsWith('true', data))
            {
                jQT.goTo('#ticket', 'slideleft');
            }
            else
            {
                $('#msg').html(
                    data
                );
            }
        });
        
    }
    
    function loadTicketData()
    {
        
    }
    
    function logout()
    {
        $.post('includes/ticketTracker.php', { c: '6' });
        jQT.goTo('#home', 'slideright');
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
        login(username, encrPw);
    });
    
    $('#logoutButton').click(function()
    {
        logout();
    });
});

