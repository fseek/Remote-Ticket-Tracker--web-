var jQT = new $.jQTouch(
{
	icon: '../img/jqtouch.png',
	icon4: '../img/jqtouch4.png',
	addGlossToIcon: false,
	startupScreen: '../img/jqt_startup.png',
	statusBar: 'black-translucent',
	themeSelectionSelector: '#jqt #themes ul',
	preloadImages: []
});

$(function()
{
	function login(username, password)
	{
		//test stuff
		$('#msg').html(
			'<a> Login successful with ' + username + ':' + password + '.'
		);
	}
	
	$('#loginForm').submit(function()
	{
		var username = $('#username').val();
		var password = $('#password').val();
		login(username, password);
	});
});