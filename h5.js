;
document.addEventListener('touchstart', function () {
}, false);
var h5 = {}
h5.loadCssImages = function () {
	var imgs = [];
	var k = 0;
	var sheets = document.styleSheets;
	for (var i = 0; i < sheets.length; i++) {
		var cssPile = '';
		var csshref = (sheets[i].href) ? sheets[i].href : 'window.location.href';
		var baseURLarr = csshref.split('/');
		baseURLarr.pop();
		var baseURL = baseURLarr.join('/');
		if (baseURL != "")baseURL += '/';

		if (document.styleSheets[i].cssRules) {
			var thisSheetRules = document.styleSheets[i].cssRules;
			for (var j = 0; j < thisSheetRules.length; j++) {
				cssPile += thisSheetRules[j].cssText
			}
		} else {
			cssPile += document.styleSheets[i].cssText
		}

		var imgUrls = cssPile.match(/[^(]+.(gif|jpg|jpeg|png)/g);
		if (imgUrls != null && imgUrls.length > 0 && imgUrls != '') {
			var arr = jQuery.makeArray(imgUrls);
			jQuery(arr).each(function () {
				if (!/^data\:image/.test(this)) {
					imgs[k] = new Image();
					imgs[k].src = (this[0] == '/' || this.match('http://') || this.match('https://')) ? this : baseURL + this;
					k++
				}
			})
		}
	}
	return imgs
}
h5.animate = function (elements, option) {
	$(elements).css({'-webkit-animation': 'none', 'display': 'none'});
	$(elements).each(function () {
		var $element = $(this);
		var settings = {
			animation: '',
			duration: 1000,
			function: 'ease',
			delay: 0,
			count: 1,
			animationEnd: null
		}

		var this_option = $.extend(settings, $element.data() || {}, option || {});
		$element.css({'display': 'block',
			'-webkit-animation-name': this_option.animation,
			'-webkit-animation-duration': this_option.duration + 'ms',
			'-webkit-animation-timing-function': 'ease',
			'-webkit-animation-timing-function': this_option.function,
			'-webkit-animation-delay': this_option.delay + 'ms',
			'-webkit-animation-fill-mode': 'both',
			'-webkit-animation-iteration-count': this_option.count == 0 ? 'infinite' : this_option.count
		});

		$element.one('webkitAnimationEnd', function (e) {
			$($element).removeAttr('style');
			if (typeof this_option.animationEnd == 'function') {
				this_option.animationEnd(e)
			}
			return false
		})

	})
}
/*
 h5.pageTo(1);
 h5.pageTo(1,pageInEndCallback);

 h5.pageTo(1, ['fadeOut', 'fadeIn']);
 h5.pageTo(1, ['fadeOut', 'fadeIn'],pageInEndCallback);

 h5.pageTo(1, ['fadeOut', {
 animation: 'slideInDown',
 duration: 600
 }],pageInEndCallback);

 */
h5.pageTo = function (pageId, animations, onPageInComplete) {
	var $current = $("[data-page].current");
	var $to = $("[data-page='" + pageId + "']");
	if (
		!$to.size()
			|| $current.size() && $current._pageAnimateActive
			|| $to._pageAnimateActive
		) {
		return;
	}

	var outOption = {
		animation: 'fadeOut',
		animationEnd: function () {
			$current._pageAnimateActive = false;
			$current.removeClass("h5-page-out");
			$current.trigger("pageOutEnd");
		}
	};
	var inOption = {
		animation: 'fadeIn',
		animationEnd: function () {
			$to._pageAnimateActive = false;
			$to.addClass("current");
			$to.removeClass("h5-page-in");
			$("[data-pages]").attr("data-current", $to.data("page"))
			$to.trigger("pageInEnd");
			onPageInComplete && onPageInComplete($to);
		}
	};

	if (animations instanceof Array) {
		var type;
		switch (typeof animations[0]) {
			case 'object':
				outOption = $.extend(outOption, animations[0]);
				break;
			case 'string':
				outOption['animation'] = animations[0];
				break;
		}
		switch (typeof animations[1]) {
			case 'object':
				inOption = $.extend(inOption, animations[1]);
				break;
			case 'string':
				inOption['animation'] = animations[1];
				break;
		}
	}
	if (typeof animations == 'function') {
		onPageInComplete = animations;
	}
	if ($current.size()) {
		$current._pageAnimateActive = true;
		$current.trigger("pageOutStart");
		$current.addClass("h5-page-out");
		$current.removeClass("current");
		h5.animate($current, outOption);
	}
	$to._pageAnimateActive = true;
	$to.addClass("h5-page-in");
	$to.trigger("pageInStart");
	h5.animate($to, inOption);
	h5.animate($to.find("[data-animation]"));
}

h5.getCurrentPage = function () {
	return $("[data-page].current");
}