$(function()
{


    //Подставляем имя пользователя
    if(getCookie('auth') == 'true')
	{
		$('[data-id="user_name"]').text(getCookie('auth_name'));
		$('html').removeClass('auth').addClass('auth');
	}
	else
	{
		$('[data-id="user_name"]').empty();
		$('html').removeClass('auth');
	}


});