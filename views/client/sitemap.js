$(function()
{


    var	map = '';
    var	count = 0;

    //Выводит все разделы
    for(var key in routing)
    {
        count++;
        if(routing[key]['url'] != '/')
        {
            count++;
            //Есть вложенные страницы
            if(routing[key]['pages'])
            {
                map += '\
                <div class="DC_item">\
                    <div class="DCI_title">\
                        <span>' + routing[key]['title'] + '</span>\
                        <div>\
                            tpl/' + routing[key]['url'] + '/\
                        </div>\
                    </div>\
                    <div class="DCI_content">';

                for(var page in routing[key]['pages'])
                {
                    count++;
                    map += '\
                        <div class="DC_link">\
                            <a href="#!/' + routing[key]['url'] + '/' + routing[key]['pages'][page]['url'] + '">\
                                ' + routing[key]['pages'][page]['title'] + '\
                            </a>\
                            <span>\
                                tpl/' + routing[key]['url'] + '/' + routing[key]['pages'][page]['url'] + '.html\
                            </span>\
                        </div>\
                    ';
                }

                map += '\
                    </div>\
                </div>';
            }

            //Нет страниц
            else
            {
                map += '\
                <div class="DC_link">\
                    <a href="#!/' + routing[key]['url'] + '">\
                        ' + routing[key]['title'] + '\
                    </a>\
                    <span>\
                        tpl/' + routing[key]['url'] + '.html\
                    </span>\
                </div>';
            }

        }

    }

    $('.documents_container').html(map);


});