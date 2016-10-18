/*
По вопросам:
v.puchkin@bk.ru
*/


//Роутинг
//=================================================================
var	routing = {

	//Главная
	undefined: {
		url: '/',
		title: 'Главная',
		enabled_for_anauth: true
	},
	main: {
		url: 'main',
		title: 'Главная',
		enabled_for_anauth: true
	},

	//Тестовый раздел
	test: {
		url: 'test',
		title: 'Тестовый раздел',
		mainpage: 'index',
		pagonator: false,
		sort: false,
		enabled_for_anauth: false,
		oages: {

		}
	},

	//Новости
	news: {
		url: 'news',
		title: 'Новости',
		mainpage: 'index',
		paginator: true,
		sort: true,
		enabled_for_anauth: true,
		pages: {
			'utug_spas_rebenka': {
				'url': 'utug_spas_rebenka',
				'title': 'Утюг спас ребёнка от тюрьмы'
			},
			'kurtka_ubiyca': {
				'url': 'kurtka_ubiyca',
				'title': 'Куртка-убийца из Саратовской области всё ещё на свободе'
			},
			'krisy_mutanty_v_bashne_kremlya': {
				'url': 'krisy_mutanty_v_bashne_kremlya',
				'title': 'Крысы-мутанты в башне Кремля: городская легенда или реальность?'
			}
		}
	},
	
	//Поиск
	//пример: /search/query:запрос/category:auto/region:perm/what:provider/type:export/startdate:01.05.2016/enddate:31.08.2016/
	search: {
		url: 'search',
		title: 'Поиск',
		mainpage: 'index',
		paginator: true,
		sort: true,
		enabled_for_anauth: true,
		parameters: {
			query: {
				url: 'query'
			},
			category: {
				url: 'category'
			},
			region: {
				url: 'region'
			},
			what: {
				url: 'what'
			},
			type: {
				url: 'type'
			},
			startdate: {
				url: 'startdate'
			},
			enddate: {
				url: 'enddate'
			}
		}
	},

	//Правила предоставления услуг
	rules: {
		url: 'rules',
		title: 'Правила предоставления услуг',
		enabled_for_anauth: true
	},

	//Настройки
	settings: {
		url: 'settings',
		title: 'Настройки',
		enabled_for_anauth: false
	},

	//Карта сайта
	sitemap: {
		url: 'sitemap',
		title: 'Карта сайта',
		enabled_for_anauth: true
	}

};