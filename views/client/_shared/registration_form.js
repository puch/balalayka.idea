$(function()
{


    //Проверка и отправка формы
    var $name = $('#reg_name'),
        $email = $('#reg_email'),
        $password = $('#reg_password'),
        $password_repeat = $('#reg_password_repeat'),
        $accept_rules = $('#reg_accept_rules'),
        $submit = $('#reg_submit'),
        name_ok = false,
        email_ok = false,
        password_ok = false,
        password_repeat_ok = false,
        accept_rules_ok = false;

    $('#reg_name, #reg_email, #reg_password, #reg_accept_rules').poshytip({
        className: 'tip-twitter',
        showOn: 'none',
        alignTo: 'target',
        alignX: 'left',
        alignY: 'center',
        offsetX: 5,
        offsetY: 5,
        showTimeout: 100
    });
    $('#reg_password_repeat').poshytip({
        className: 'tip-twitter',
        showOn: 'none',
        alignTo: 'target',
        alignX: 'right',
        alignY: 'center',
        offsetX: 5,
        offsetY: 5,
        showTimeout: 100
    });

    //При фокусе убирать красную обводку
    $('#reg_name, #reg_email, #reg_password, #reg_password_repeat, #reg_accept_rules').focus(function()
    {
        $('#reg_name, #reg_email, #reg_password, #reg_password_repeat, #reg_accept_rules').removeClass('wrong').poshytip('hide');
    });

    //Отправка по энтеру
    $('#reg_name, #reg_email, #reg_password, #reg_password_repeat').keyup(function(event)
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

        //Имя
        if($name.val() == '')
        {
            name_ok = false;
        }
        else
        {
            name_ok = true;
        }

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
        if($password.val() == '' || $password.val().length < 4)
        {
            password_ok = false;
        }
        else
        {
            password_ok = true;
        }

        //Повтор пароля
        if($password_repeat.val() == '' || $password_repeat.val() != $password.val())
        {
            password_repeat_ok = false;
        }
        else
        {
            password_repeat_ok = true;
        }

        //Согласие с правилами
        if(!$accept_rules.is(':checked'))
        {
            accept_rules_ok = false;
        }
        else
        {
            accept_rules_ok = true;
        }

        //Показ хинтов и подсказок

        //Имя
        if(name_ok == false)
        {
            $name.addClass('wrong').poshytip('show');
        }
        else if(name_ok == true)
        {
            $name.removeClass('wrong').poshytip('hide');
        }

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

        //Повтор пароля
        if(password_repeat_ok == false)
        {
            $password_repeat.addClass('wrong').poshytip('show');
        }
        else if(password_repeat_ok == true)
        {
            $password_repeat.removeClass('wrong').poshytip('hide');
        }

        //Согласие с правилами
        if(accept_rules_ok == false)
        {
            $accept_rules.addClass('wrong').poshytip('show');
        }
        else if(accept_rules_ok == true)
        {
            $accept_rules.removeClass('wrong').poshytip('hide');
        }

        //Отправка
        if(name_ok == true && email_ok == true && password_ok == true && password_repeat_ok == true && accept_rules_ok == true)
        {
            $('html').addClass('bal_loading');

            $.ajax({
                type: 'POST',
                url: 'http://puchk.in/work/finodin/db/@_registration.php',
                data: {
                    'name': $name.val(),
                    'email': $email.val(),
                    'password': $password.val()
                },
                success: function(data)
                {
                    $('html').removeClass('bal_loading');

                    if(data == 1)
                    {
                        //Зарегистрирован, сразу входим
                        balAlert(
                            'Успешно!',
                            '<p class="bal_text">Мы зарегистрировали вас.</p><a href="' + path + '" class="bal_button green">Начать пользоваться</a>'
                        );

                        $('[data-id="user_name"]').text($name.val());
                        $('html').addClass('auth');
                        setCookie('auth', true);
                        setCookie('auth_name', $name.val());
                        $('[data-bal-action="close"], .bal_popups_bg').click(function()
                        {
                            window.location.href = path;
                        });
                    }
                    else
                    {
                        //Такой email уже зарегистрирован
                        balAlert(
                            'Не удалось зарегистрироваться',
                            'Пользователь с таким адресом эл. почты уже зарегистрирован.'
                        );

                        $('html').removeClass('auth');
                        $('[data-id="user_name"]').empty();
                    }
                },
                error: function()
                {
                    //Ошибка на сервере
                    $('html').removeClass('bal_loading');

                    balAlert(
                        'Не удалось зарегистрироваться',
                        'Произошла ошибка на сервере. Попробуйте позже.'
                    );

                    $('html').removeClass('auth');
                    $('[data-id="user_name"]').empty();
                }
            });
        }

    });


});