$(function()
{


    //Для примера: если авторизован
    if(getCookie('auth') == 'true')
    {
        $('.bal_text [data-id="user_name"]').text(getCookie('auth_name'));
    }


});