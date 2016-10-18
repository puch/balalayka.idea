$(function()
{


    //Для примера: если есть параметры запроса, выводим их на страницу
    var search_parameters = '';

    $('#dev_parameters input').each(function()
    {
        search_parameters += '<p>' + $(this).attr('name') + ': <b>' + decodeURIComponent($(this).val()) + '</b>';
    });

    $(content_selector).append(search_parameters);


    //Для примера: отправка формы
    $('.bal_form').each(function()
    {
        var $e = $(this),
                $inputs = $e.find('input[type="text"]'),
                $controls = $e.find('input[type="text"], select, .multiple_checkboxes'),
                $submit = $e.find('button[type="submit"]');

        $submit.click(function()
        {

            search_string = '!/search';

            $controls.each(function()
            {
                var $c = $(this),
                        name = ($c.attr('name')) ? $c.attr('name') : $c.attr('data-name'),
                        value = ($c.val()) ? $c.val() : $c.attr('data-value');

                value = (value == '' || value == undefined) ? null : value;

                search_string += '/' + name + ':' + value;
            });

            window.location.hash = search_string;

        });

        $inputs.keyup(function(event)
        {
            if(event.keyCode == 13)
            {
                $submit.click();
            }
        })
    });


    //Для примера: получение параметров из адресной строки и их подстановка в форму
    //=================================================================
    if($('body').hasClass('search') && $('body').hasClass('index'))
    {

        //Запрос
        if($('#dev_parameters input[name="query"]').length > 0)
            $('.bal_form input[name="query"]').val(($('#dev_parameters input[name="query"]').val() != 'null') ? $('#dev_parameters input[name="query"]').val() : '');

        //Категория
        if($('#dev_parameters input[name="category"]').length > 0)
        {
            if($('#dev_parameters input[name="category"]').val() != 'null')
            {
                $('.bal_form select[name="category"] option').removeAttr('selected');
                $('.bal_form select[name="category"] option[value="' + $('#dev_parameters input[name="category"]').val() + '"]').attr('selected', 'selected');
            }
        }

        //Регион
        if($('#dev_parameters input[name="region"]').length > 0)
        {
            if($('#dev_parameters input[name="region"]').val() != 'null')
            {
                $('.bal_form select[name="region"] option').removeAttr('selected');
                $('.bal_form select[name="region"] option[value="' + $('#dev_parameters input[name="region"]').val() + '"]').attr('selected', 'selected');
            }
        }

        //Регион
        if($('#dev_parameters input[name="what"]').length > 0)
        {
            if($('#dev_parameters input[name="what"]').val() != 'null')
            {
                $('.bal_form select[name="what"] option').removeAttr('selected');
                $('.bal_form select[name="what"] option[value="' + $('#dev_parameters input[name="what"]').val() + '"]').attr('selected', 'selected');
            }
        }

        //Тип
        if($('#dev_parameters input[name="type"]').length > 0 && $('#dev_parameters input[name="type"]').val() != '' && $('#dev_parameters input[name="type"]').val() != 'null')
        {
            var types = $('#dev_parameters input[name="type"]').val().split(',');
            $('.multiple_checkboxes[data-name="type"]').find('input[type="checkbox"][value]').each(function()
            {
                var $e = $(this),
                    value = $e.attr('value');

                $e.removeAttr('checked');

                for(i = 0; i < types.length; i++)
                {
                    if(value == types[i])
                    {
                        $e.attr('checked', 'checked');
                    }
                }
            });
        }
        else
        {
            $('.multiple_checkboxes[data-name="type"]').find('input[type="checkbox"][value]').removeAttr('checked');
        }

    }


});