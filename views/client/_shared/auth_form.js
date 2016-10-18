$(function()
{


    //Проверка и отправка формы
    var $email = $('#auth_email'),
        $password = $('#auth_password'),
        $submit = $('#auth_submit'),
        email_ok = false,
        password_ok = false;

    $('#auth_email, #auth_password').poshytip({
        className: 'tip-twitter',
        showOn: 'none',
        alignTo: 'target',
        alignX: 'left',
        alignY: 'center',
        offsetX: 5,
        offsetY: 5,
        showTimeout: 100
    });

    //При фокусе убирать красную обводку
    $('#auth_email, #auth_password').focus(function()
    {
        $('#auth_email, #auth_password').removeClass('wrong').poshytip('hide');
    });

    //Отправка по энтеру
    $('#auth_email, #auth_password').keyup(function(event)
    {
        if(event.keyCode == 13)
        {
            $submit.click();
        }
    });

    //Клик по кнопке
    $submit.click(function()
    {

        //Проверка на заполненность и корректность

            //Почта
            var regEmail = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
            var resultEmail = regEmail.test($email.val());
            if($email.val() == '' || resultEmail == false)
            {
                email_ok = false;
            }
            else
            {
                email_ok = true;
            }

            //Пароль
            if($password.val() == '')
            {
                password_ok = false;
            }
            else
            {
                password_ok = true;
            }

        //Показ хинтов и подсказок

            //Почта
            if(email_ok == false)
            {
                $email.addClass('wrong').poshytip('show');
            }
            else if(email_ok == true)
            {
                $email.removeClass('wrong').poshytip('hide');
            }

            //Пароль
            if(password_ok == false)
            {
                $password.addClass('wrong').poshytip('show');
            }
            else if(password_ok == true)
            {
                $password.removeClass('wrong').poshytip('hide');
            }

        //Отправка
        if(email_ok == true && password_ok == true)
        {
            $('html').addClass('bal_loading');

            $.ajax({
                type: 'POST',
                url: 'http://puchk.in/work/finodin/db/@_auth.php',
                data: {
                    'email': $email.val(),
                    'password': $password.val()
                },
                success: function(data)
                {
                    window.setTimeout(function()
                    {
                        $('html').removeClass('bal_loading');

                        if(data.slice(0, 1) == 1)
                        {
                            //Авторизован
                            $('html').append(data.slice(1, data.length));
                            popup('auth', 'close');
                            $('#auth').removeClass('wrong');
                            $('#dev_server_vars').html(data.slice(1, data.length));
                            setCookie('auth', true);
                            setCookie('auth_name', name);
                            $('[data-id="user_name"]').text(getCookie('auth_name'));
                            $('html').addClass('auth');
                            window.location.reload();
                        }
                        else
                        {
                            //Неправильный логин и / или пароль
                            $('#auth').addClass('wrong');
                        }
                    }, 200);
                },
                error: function()
                {
                    //Ошибка на сервере
                    $('html').removeClass('bal_loading');

                    balAlert(
                        'Не удалось войти',
                        'Произошла ошибка на сервере. Попробуйте позже.'
                    );

                    $('html').removeClass('auth');
                    $('[data-id="user_name"]').empty();
                }
            });
        }

    });


    //Выход
    $('[data-id="exit"]').click(function()
    {
        $('html').addClass('bal_loading');

        window.setTimeout(function()
        {
            deleteCookie('auth');
            deleteCookie('auth_name');

            $('html').removeClass('bal_loading');
            $('html').removeClass('auth');
            $('[data-id="user_name"]').empty();
            window.location.href = path;
        }, 200);
    });


});