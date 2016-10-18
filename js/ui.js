/*
Автор: Пучкин В., 2016.
v.puchkin@bk.ru
*/


//Функция открытия попапа
//=================================================================
function popup(id, action)
{
	if(action == 'open')
	{
		$('.bal_popups_bg').addClass('open');
		$('#' + id).addClass('open');
	}
	else if(action == 'close')
	{
		if(id == 'all')
		{
			$('.bal_popups_bg').removeClass('open');
			$('.bal_popup').removeClass('open');
		}
		else
		{
			$('.bal_popups_bg').removeClass('open');
			$('#' + id).removeClass('open');
		}
	}
}


//Показ алерта
//=================================================================
function balAlert(title, text)
{
	popup('all', 'close');
	$('#alert').children('.bal_title').html(title);
	$('#alert').children('.bal_text').html(text);
	popup('alert', 'open');
}


function ui()
{


	//Кнопка «Назад»
	//=================================================================
	if($('.bal_back').length > 0)
	{
		$('.bal_back').click(function()
		{
			history.back();
		});
	}


	//Попапы
	//=================================================================

		//Открытие попапов по клику на элементы с атрибутом data-open-popup
		if($('[data-bal-popup]').length > 0)
		{
			$('[data-bal-popup]').each(function()
			{
				var	$e = $(this),
					popupId = $e.attr('data-bal-popup');

				$e.click(function()
				{
					popup(popupId, 'open');
				});
			});
		}

		//События при клике на крестик, «отмена» или фон для попапов
		if($('.bal_popup').length > 0)
		{
			$('.bal_popup').each(function()
			{
				var	$e = $(this),
					$close = $e.find('[data-bal-action="close"]');

				$close.click(function()
				{
					$('input, button, select, button').removeClass('wrong').poshytip('hide');
					popup($e.attr('id'), 'close');
				});
			});

			$('.bal_popups_bg').click(function()
			{
				$('input, button, select, button').removeClass('wrong').poshytip('hide');
				popup('all', 'close');
			});

			$(document).keyup(function(event)
			{
				if(event.keyCode == 27)
				{
					$('input, button, select, button').removeClass('wrong').poshytip('hide');
					popup('all', 'close');
				}
			});
		}


	//Выбор в группе комбобоксов и передача значения
	//=================================================================
	if($('.multiple_checkboxes').length > 0)
	{

		$('.multiple_checkboxes').each(function()
		{

			var $e = $(this),
				$checkboxes = $e.find('input[type="checkbox"][value]');

			function getCheckboxesValue()
			{
				var value = '';

				$checkboxes.each(function()
				{
					if($(this).is(':checked'))
					{
						value += ',' + $(this).val();
					}
				});

				$e.attr('data-value', value.slice(1, value.length));
			}
			getCheckboxesValue();

			$checkboxes.each(function()
			{
				var $c = $(this);

				$c.change(function()
				{
					getCheckboxesValue();
				});
			});

		});

	}


	//Двухуровневый аккордион
	//=================================================================
	if($('.DC_item').length > 0)
	{
		$('.DC_item').each(function()
		{
			var	$e = $(this),
				$trigger = $e.children('.DCI_title').children('span'),
				$content = $e.children('.DCI_content');

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
	
	
}


$(window).bind('hashchange', function()
{
	$('input, button, select, button').removeClass('wrong').poshytip('hide');
	popup('all', 'close');
});