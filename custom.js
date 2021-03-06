/* Custom.js for machinon theme */

var theme = {};
var themeName = "";
var baseURL= "";
var switchState = {};
var isMobile;
var newVersionText = '';
var gitVersion;

// load files
isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

$.ajax({url: 'acttheme/js/themesettings.js', async: false, dataType: 'script'});
$.ajax({url: 'acttheme/js/functions.js', async: false, dataType: 'script'});

//need more simplycity
if (!isMobile){ 
var targetedNode = document;
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
	mutations.forEach(function(mutation) {	
		if ($('#main-view').contents().hasClass('container') ) {
			$('#main-view').contents().removeClass('container').toggleClass('container-fluid');
			console.log('change container class to container-fluid');
			var changeclass = true
		};
		
		if ($('#main-view div.row').next().length != 0 ){
			DelRow();
		} else {
			//console.log{'1 row found'};
			var delrowok = true
		};
		
		if (delrowok && changeclass){
			console.log('deconnexion observer');
			//observer.disconnect();
			
		};
	});
});

window.onhashchange = locationHashChanged;
}
document.addEventListener('DOMContentLoaded', function () {

});

(function() {

	$( document ).ready(function() {
		
		requirejs.config({ waitSeconds: 30 });
		// function adds the theme tab
		showThemeSettings();
		checkSettingsHTML();
		// load theme settings
		loadSettings();
		enableThemeFeatures();
		
			
		// Navbar menu and logo header
		let navBar =  $('.navbar').append('<button class="menu-toggle"></button>');
		let navBarInner = $(".navbar-inner");
		let navBarToggle = $('.menu-toggle');
		navBarToggle.click(function(){
			navBarInner.slideToggle(400);
		});

		let containerLogo = `
			<header class="logo">
				<div class="container-logo">
					<img class="header__icon" src="images/logo.png">
				</div>
			</header>')
		`;
		$(containerLogo).insertBefore('.navbar-inner');
		$('<input type="text" id="searchInput" onkeyup="searchFunction()" placeholder="Type to Search" title="Type to Search">').appendTo('.container-logo');
					
		// Features
		if (theme.features.footer_text_disabled.enabled === true) {
			$('#copyright p').remove();
		}
		if (theme.features.dashboard_show_last_update.enabled === true) {
			$('<style>#dashcontent #lastupdate{display: block;}</style>').appendTo('head');
		}
				
		// Replace settings dropdown button to normal button.
		/** This also disables the custom menu. Need find a workaround **/
		if (theme.features.custom_settings_menu.enabled === true) {
			$('#appnavbar li').remove('.dropdown');
			let mainMenu = $('#appnavbar');
			let mSettings = mainMenu.find('#mSettings');
			if (mainMenu.length && mSettings.length == 0) {
				mainMenu.append('<li id="mSettings" style="display: none;" has-permission="Admin"><a href="#Custom/Settings"><img src="images/setup.png"><span data-i18n="Settings">Settings</span></a></li>');
			}
		} else {
			$('#cSetup').click(function() {
				showThemeSettings();
				loadSettings();
				enableThemeFeatures();
			});
		}

/* 		// insert config-forms menu item into main navigation
		let configForms = mainMenu.find('#config-forms');
		if (mainMenu.length && configForms.length == 0) {
			mainMenu.append('<li class="divider-vertical"></li><li id="config-forms"><a href="#" class="active">Machinon</a></li>');
		} */
			
		$(document).ajaxSuccess(function (event, xhr, settings) {
			if (settings.url.startsWith('json.htm?type=devices') ||
				settings.url.startsWith('json.htm?type=scenes')) {
				let counter = 0;
				let intervalId = setInterval(function () {
					// console.log("Check DOM");
					if ($('#main-view').find('.item').length > 0) {
						applySwitchersAndSubmenus();
						clearInterval(intervalId);
					} else {
						counter++;
						if (counter >= 5) {
							clearInterval(intervalId);
						}
					}
				}, 1000);
			} else if (settings.url.startsWith('json.htm?type=command&param=switchscene')) {
				let id = settings.url.split('&')[2];
				id = id.substr(4); // from string 'idx=?'
				let scene = $('.item#' + id);
				let statusElem = scene.find('#status .wrapper');
				statusElem.hide();
				let switcher = statusElem.parent().siblings('.switch').find('input');
				if (switcher.length) {
					let statusText = settings.url.split('&')[3];
					statusText = statusText.substr(10); // from string 'switchcmd=?'
					switcher.attr('checked', (statusText == 'On'));
				}
			}
		});

	});

	window.onresize = function () {
		//show-hide navbar on window resize
		var nav = $(".navbar-inner");
		if (nav === null) {
			return;
		}
		let width = window.innerWidth;
		if (width > 992) {
			nav.css("display", "block");
		} else {
			nav.css("display", "none");
		}
	};

})();
