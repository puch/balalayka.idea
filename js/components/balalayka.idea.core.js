/*
 По вопросам:
 v.puchkin@bk.ru
 */


//Настройки
//=================================================================
var

	//Название системы
	system_name = 'Balalayka.IDEA',

	//Путь до сайта от корня домена
	path = '',

	//Путь до JS
	client_path = 'views/client/',

	//Путь до HTML
	server_path = 'views/server/',

	//Куда вставляем содержимое страницы
	content_selector = '.content',

	//Перечислить через запятую все ссылки, на которые навешиваются классы active, то есть, которые подсвечиваются при переходе в соответствующий их пути раздел
	links_selector = '.logo, .menu_item',

	//Режим разработки: включен или нет, true | false, если true, то появляется карта сайта и консоль
	dev_mode = true,

	//Консоль всегда видна: да или нет, true | false
	dev_tools_always_visible = false;

//Создаём элемент для инклюдов
document.createElement('include');


//Куки
//=================================================================
	//Установка
	function setCookie(name, val)
	{
		var date = new Date( new Date().getTime() + 1000*60*60*4 );

		document.cookie = name + '=' + val + '; path=/; expires=' + date.toUTCString();
	}
	//Чтение
	function getCookie(name)
	{
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));

		return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	//Удаление
	function deleteCookie(name)
	{
		document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}


//Собирает страницу
//=================================================================
function page()
{


	//Основные блоки и переменные
	var	$title = $('title'),
		$html = $('html'),

		$content = $(content_selector),

		$links = $(links_selector),

		server_url,//Сюда пойдёт адрес серверной страницы
		client_url,//Сюда пойдёт адрес js для этой страницы
		demo_server_url,

		key,
		i = 0,
		url_sign,
		p_clean,
			p_array,
				p_a_parts,
					p_a_name,
					p_a_value,

		$parameters = $('#dev_parameters'),
		$dev_tools = (dev_mode == true) ? $('#dev_tools') : null,
			$dev_tools_content = (dev_mode == true) ? $dev_tools.children('.DT_content') : null,
		$dev_sitemap = (dev_mode == true) ? $('#dev_sitemap') : null,

		dev_parameters = '',

		classes,
			first_class,
			second_class,

		page,//Номер страницы
		parameters = '',//Параметры, передаваемые в get
		parameter,//Отдельный параметр из урла
			p_parts,//Массив из имени параметра и его значения из урла
				p_name,//Имя параметра
				p_value,//Значение параметра

		include;


	//Хэш-адрес
	var	hash = window.location.hash.slice(2, window.location.hash.length),
		hash = hash.split('/'),//массив из хэша
		section = hash[1],//раздел
		sub = hash[2];//подраздел


	//UI-скрипты
	function uiloaded()
	{
		ui();
		if(dev_mode == true)
			$('#dev_tools .DT_content').prepend('<div class="DT_accent green"><b>UI-скрипты <span>загружены и отработали</span>.</b></div>');
	}


	//Нет хэша — показываем главную
	if(!window.location.hash || window.location.hash.length < 3)
	{

		window.location.hash = '#!/main';

	}
	else
	{


		//Плавно скрывает страницу и показывает лоадер
		$html.addClass('bal_loading_step_1');
		window.setTimeout(function()
		{
			$html.addClass('bal_loading_step_2');
		}, 100);


		window.setTimeout(function()
		{


			//Сбрасывает подсветку выбранных разделов
			$links.removeClass('active');
			if(dev_mode == true)
			{
				$dev_sitemap.find('.DSC_link').children('a').removeClass('active');
				$('.DSC_item').removeClass('open');
				$('.DSCI_content').slideUp(200);
			}


			//1. РАЗДЕЛ
			//=====================================================================

			//1.1. Если такой раздел есть
			if(routing[section])
			{


				//Устанавливает title «заголовок раздела | название системы»
				if(routing[section]['title'] != 'Главная')//Не главная страница
				{
					$title.text(routing[section]['title'] + ' | ' + system_name);
				}
				else//Главная
				{
					$title.text(system_name);
				}


				//Подсвечивает нужный пункт меню
				$('[href="#!/' + section + '"]').addClass('active');


				//2. ПОДРАЗДЕЛ
				//=====================================================================

				//2.1. Есть подразделы
				if(routing[section]['pages'])
				{

					//Такая страница есть в роутинге
					if(routing[section]['pages'][sub])
					{
						$('[href^="#!/' + section + '/' + sub + '"]').addClass('active');
						if(dev_mode == true)
						{
							$('[href^="#!/' + section + '/' + sub + '"]').closest('.DSC_item').addClass('open');
							$('[href^="#!/' + section + '/' + sub + '"]').closest('.DSC_item').children('.DSCI_content').slideDown(200);
						}

						page = routing[section]['url'] + '/' + sub;

						//Устанавливает title «заголовок подраздела | заголовок раздела | название системы»
						$title.text(routing[section]['pages'][sub]['title'] + ' | ' + $title.text());
					}

					//Такой страницы нет в роутинге
					else
					{

						//В урле есть подраздел
						if(sub && sub.length > 0)
						{
							//Подраздел page (пагинатор) или sortby (сортировка)
							if(sub.slice(0, 4) == 'page' || sub.slice(0, 6) == 'sortby')
							{
								page = routing[section]['url'] + '/' + routing[section]['mainpage'];
							}

							//Подраздел не pages, не sortby и он не нашёлся в роутинге
							else
							{
								page = '404';
							}
						}

						//В урле нет подраздела, перекидываем на главную раздела
						else
						{
							page = routing[section]['url'] + '/' + routing[section]['mainpage'];
						}
					}
				}

				//2.2. Подразделов нет, но есть mainpage
				else if(!routing[section]['pages'] && routing[section]['mainpage'])
				{

					page = routing[section]['url'] + '/' + routing[section]['mainpage'];

				}

				//2.3. Подразделов нет, нет mainpage
				else if(!routing[section]['pages'] && !routing[section]['mainpage'])
				{

					page = routing[section]['url'];

				}


				//3. Параметры (фильтры), пагинатор и сортировка
				//=====================================================================

				//3.1. Страница с фильтрами (например, поиск)

				//3.1.1. На странице есть параметры
				if(routing[section]['parameters'])
				{

					//Ищем фильтры в урле
					i = 0;

					for(key in hash)
					{

						if(i > 1)
						{
							parameter = hash[key],
								p_parts = hash[key].split(':'),
								p_name = p_parts[0],
								p_value = p_parts[1];

							//Если такой параметр (фильтр) есть в роутинге
							if(routing[section]['parameters'][p_name] && p_value)
							{
								//Формируем запрос по каждому параметру
								url_sign = (i == 2) ? '?' : '&amp;';
								parameters += url_sign + p_name + '=' + p_value;
							}
						}

						i++;

					}

				}

				//3.1.2. На странице нет параметров, не передаём их
				else
				{
					parameters = '';
				}


				//3.2. Страница с пагинатором
				if(routing[section]['paginator'] && routing[section]['paginator'] == true)
				{
					//Ищем метку страницы в урле
					i = 0;

					for(key in hash)
					{

						if(i > 1)
						{
							parameter = hash[key],
								p_parts = hash[key].split(':'),
								p_name = p_parts[0],
								p_value = p_parts[1];

							//Если это метка страницы
							if(p_name == 'page')
							{
								//Добавляем к параметрам урла ещё страницу
								url_sign = (i == 2) ? '?' : '&amp;';
								url_sign = (parameters == '') ? '?' : '&amp;';
								parameters += url_sign + p_name + '=' + p_value;
							}
						}

						i++;

					}
				}


				//3.3. Страница с сортировкой
				if(routing[section]['sort'] && routing[section]['sort'] == true)
				{
					//Ищем метку сортировки в урле
					i = 0;

					for(key in hash)
					{

						if(i > 1)
						{
							parameter = hash[key],
								p_parts = hash[key].split(':'),
								p_name = p_parts[0],
								p_value = p_parts[1];

							//Если это метка страницы
							if(p_name == 'sortby')
							{
								//Добавляем к параметрам урла ещё страницу
								url_sign = (i == 2) ? '?' : '&amp;';
								url_sign = (parameters == '') ? '?' : '&amp;';
								parameters += url_sign + p_name + '=' + p_value;
							}
						}

						i++;

					}
				}


			}

			//1.2. Такого раздела нет
			else
			{

				if(section == '')
				{
					window.location.hash = '#!/main';
				}
				else
				{
					page = '404';
					parameters = '';
				}

			}


			//Переформируем урл

				//Если раздел доступен для незарегистрированных пользователей
				if(getCookie('auth'))
				{
					if(getCookie('auth') == 'true')
					{
						server_url = server_path + page + '.html' + parameters;
						client_url = client_path + page + '.js';
					}
					else if(getCookie('auth') == 'false' && routing[section]['enabled_for_anauth'] == true)
					{
						server_url = server_path + 'enabled_for_anauth.html' + parameters;
						client_url = client_path + 'enabled_for_anauth.js';
					}
				}
				else
				{
					if(routing[section] && routing[section]['enabled_for_anauth'] == true)
					{
						server_url = server_path + page + '.html' + parameters;
						client_url = client_path + page + '.js';
					}
					else if(routing[section] && routing[section]['enabled_for_anauth'] == false)
					{
						server_url = server_path + 'enabled_for_anauth.html' + parameters;
						client_url = client_path + 'enabled_for_anauth.js';
					}
					else
					{
						server_url = server_path + '404.html' + parameters;
						client_url = client_path + '404.js';
					}
				}


			//4. Запрос страницы с сервера
			//=====================================================================

			if(dev_mode == true)
			{
				$dev_tools.removeClass('show');
				$dev_tools_content.empty();
			}

			//4.1. Грузим страницу
			$.get(server_url)
				.done(function(data)
				{

					$content.empty().html(data);

					window.setTimeout(function()
					{

						$('html, body').animate({scrollTop:0},200);

						window.setTimeout(function()
						{
							$html.removeClass('bal_loading_step_1');
							$html.removeClass('bal_loading_step_2');
							$html.removeClass('bal_loading');
						}, 100);

						//Парсим параметры и выводим на страницу
						$parameters.empty();

						classes = page.split('/'),
							first_class = classes[0],
							second_class = classes[1];

						$('body').removeClass().addClass(first_class).addClass(second_class);

						if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent green"><b>Разметка страницы <span>загружена</span>.</b></div>');
						if(dev_mode == true)
						{
							demo_server_url = server_url.split('?'),
								demo_server_url = demo_server_url[0];
							$dev_tools_content.prepend('<div class="DT_accent"><b>Путь до страницы:</b><span>' + demo_server_url + '</span></div>');
							$dev_tools_content.prepend('<div class="DT_accent"><b>Путь до скриптов:</b><span>' + client_url + '</span></div>');
						}

						//Параметры есть
						if(parameters != '' && parameters.length > 0)
						{
							p_clean = parameters.slice(1, parameters.length),
								p_clean = p_clean.split('&amp;');

							$parameters.append('<input type="hidden" name="parameters" value="true"/>');

							if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent"><b>Получены параметры.</b><span>Не выведенные из урла параметры не поддерживаются в роутинге.</span></div>');
							if(dev_mode == true)
							{
								$dev_tools_content.prepend('<div class="DT_accent"><b>Запрос целиком:</b><span>' + parameters + '</span></div>');
								dev_parameters += '<div class="DT_accent"><b>Разобранные параметры:</b>';
							}

							for(key in p_clean)
							{
								p_array = p_clean[key],
									p_a_parts = p_clean[key].split('='),
									p_a_name = decodeURIComponent(p_a_parts[0]),
									p_a_value = decodeURIComponent(p_a_parts[1]);

								//Выводим на страницу
								$parameters.append('<input type="hidden" name="' + p_a_name + '" value="' + p_a_value + '"/>');
								if(dev_mode == true) dev_parameters += '<p><b>' + p_a_name + '</b>: ' + p_a_value + '</p>';
							}

							if(dev_mode == true) $dev_tools_content.prepend(dev_parameters);
						}

						//Параметров нет
						else
						{
							$parameters.append('<input type="hidden" name="parameters" value="false"/>');
							if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent"><b>Запрос передан без параметров.</b><span>Или ни один из параметров не поддерживается в роутинге.</span></div>');
						}

						//Грузим скрипты этой страницы
						$.get(client_url)

							//Загрузился
							.done(function()
							{

								if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent green"><b>Скрипты страницы <span>загружены</span>.</b></div>');

							})

							//Не загрузился
							.fail(function(data)
							{
								if(dev_mode == true)
								{
									//Потому что не найден
									if(data.status != '404')
									{
										var	msg = 'В файле ' + client_url + ' ошибка.';
									}
									//Потому что ошибка
									else
									{
										var	msg = 'Файла ' + client_url + ' не существует.';
									}
									$dev_tools_content.prepend('<div class="DT_accent red"><b>Скрипты страницы <span>не удалось загрузить</span>.</b><span>' + msg + '</span></div>');
								}
							})

							//В любом случае грузим остальные скрипты
							.always(function()
							{

								//Грузим инклюды
								var include;

								if($('include').not('.done').length > 0)
								{

									$('include').not('.done').each(function()
									{
										var	$e = $(this),
											src = $e.attr('src');

										if(dev_mode == true) $e.attr('data-info', 'Инклюд расположен по адресу: ' + server_path + src + '.html');

										$.get(server_path + src + '.html')
											.done(function(data)
											{
												$e.html(data);

												if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent green"><b>Инклюд ' + server_path + src + '.html <span>загружен</span>.</b></div>');

												//Грузим скрипты инклюда
												$.get(client_path + src + '.js')
													.done(function()
													{
														if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent green"><b>Скрипты инклюда ' + client_path + src + '.js <span>загружены</span>.</b></div>');
													})
													.fail(function()
													{
														if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent red"><b>Скрипты инклюда ' + client_path + src + ' <span>не удалось загрузить</span>.</b></div>');
													});
											})
											.fail(function()
											{
												$e.html('Не удалось загрузить инклюд' + server_path + src);
												if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent red"><b>Инклюд ' + server_path + src + ' <span>не удалось загрузить</span>.</b></div>');
											})
											.always(function()
											{
												$e.addClass('done');
												if($('include').not('.done').length == 0)
												{
													//Грузим общие скрипты
													uiloaded();
												}
											});

									});
								}
								else
								{
									//Грузим общие скрипты
									uiloaded();
								}

							});


					}, 100);

				})

				//4.2. В случае ошибки показываем 404
				.fail(function() {

					if(dev_mode == true) $dev_tools_content.prepend('<div class="DT_accent red"><b>Разметку страницы <span>не удалось получить</span>.</b></div>');

					$.get('views/server/404.html')
						.done(function(data)
						{
							$content.empty().html(data);

							$('body').removeClass().addClass('404');

							window.setTimeout(function()
							{
								uiloaded();
								$('html, body').animate({scrollTop:0},200);
								$html.removeClass('bal_loading_step_1');
								$html.removeClass('bal_loading_step_2');
								$html.removeClass('bal_loading');
							}, 100);
						})
				});

			if(dev_mode == true) $dev_tools.addClass('show');
			if(dev_mode == true) $dev_sitemap.addClass('show');


		}, 100);


	}


}


//Запускает первый раз
//=================================================================
$(function()
{

	$('html').append('<div id="dev_parameters"></div>');//Блок для передаваемых в урле параметров

	//Для разработчика
	if(dev_mode == true)
	{

		//Вывод информации о загружаемой странице
		var addit_class = (dev_tools_always_visible == true) ? 'show' : 'hide';
		$('html').append('<div id="dev_tools" class="' + addit_class + '"><button></button><div class="DT_content"></div></div>');
		//Обработчик
		$('#dev_tools > button').click(function()
		{
			$('#dev_tools').toggleClass('hide');
		});


		//Карта сайта
		$('html').append('<div id="dev_sitemap" class="hide"><button></button><div class="DS_content"></div></div>');
		//Обработчик
		$('#dev_sitemap > button').click(function()
		{
			$('#dev_sitemap').toggleClass('hide');
		});

		var	map = '';
		var	count = 0;

		//Выводит все разделы
		for(var s_key in routing)
		{
			count++;
			if(routing[s_key]['url'] != '/')
			{
				count++;
				//Есть вложенные страницы
				if(routing[s_key]['pages'])
				{
					map += '\
					<div class="DSC_item">\
						<div class="DSCI_title">\
							<span>' + routing[s_key]['title'] + '</span>\
							<div>\
								views/server/' + routing[s_key]['url'] + '/\
							</div>\
						</div>\
						<div class="DSCI_content">';

					for(var s_page in routing[s_key]['pages'])
					{
						count++;
						map += '\
							<div class="DSC_link">\
								<a href="#!/' + routing[s_key]['url'] + '/' + routing[s_key]['pages'][s_page]['url'] + '">\
									' + routing[s_key]['pages'][s_page]['title'] + '\
								</a>\
								<span>\
									views/server/' + routing[s_key]['url'] + '/' + routing[s_key]['pages'][s_page]['url'] + '.html\
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
					<div class="DSC_link">\
						<a href="#!/' + routing[s_key]['url'] + '">\
							' + routing[s_key]['title'] + '\
						</a>\
						<span>\
							views/server/' + routing[s_key]['url'] + '.html\
						</span>\
					</div>';
				}

			}

		}

		$('#dev_sitemap > .DS_content').html(map);

		//Обработчик аккордиона в карте сайта
		$('#dev_sitemap .DSC_item').each(function()
		{
			var	$e = $(this),
				$trigger = $e.children('.DSCI_title').children('span'),
				$content = $e.children('.DSCI_content');

			if(!$e.hasClass('open'))
			{
				$content.hide();
			}

			$trigger.click(function()
			{
				if(!$e.hasClass('open'))
				{
					$content.slideDown(200);
					$e.addClass('open');
				}
				else
				{
					$content.slideUp(200);
					$e.removeClass('open');
				}
			});
		});

	}

	page();

});


//Запускает при каждой смене урла
//=================================================================
$(window).bind('hashchange', function()
{
	page();
});