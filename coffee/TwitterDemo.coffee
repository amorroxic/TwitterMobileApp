$ = jQuery

$.fn.extend

	TwitterDemo: (options) ->

		settings =
			debug: false
			latitude: ''
			longitude: ''
			radius: '32.18688km' #20 miles
			query: 'traffic'

		settings = $.extend settings, options
		endPoint = "http://search.twitter.com/search.json"

		log = (msg) ->
			console?.log msg if settings.debug

		initializeSystem = () ->
			notifyApplication "Trying geolocation.."
			if Modernizr.geolocation
				navigator.geolocation.getCurrentPosition locationSuccess, locationFailure, {timeout:2000}
			else
				notifyApplication 'Please enable location sharing.', true

		clearScreen = () ->
			($ '#container')[0].innerHTML = ''

		locationSuccess = (position) ->
			settings.latitude = position.coords.latitude
			settings.longitude = position.coords.longitude
			notifyApplication 'Location successfully detected.'
			($ '<a data-role="button" id="loadTweetsButton">Load tweets</a>').appendTo '#container'
			do ($ '#loadTweetsButton').button;
			$('#loadTweetsButton').click =>
				do performTwitterQuery

		locationFailure = (error) ->
			message = 'A problem occured while trying to get your location.<br>'
			switch error.code
				when error.PERMISSION_DENIED then message += 'Permission was denied.'
				when error.POSITION_UNAVAILABLE then message += 'Location data not available.'
				when error.TIMEOUT then message += 'Location request timeout.'
				else message += 'An unspecified error occurred.'
			notifyApplication message, true

		notifyApplication = (message, showRefreshButton = false) ->
			log message
			($ '#container')[0].innerHTML += message + '<br>'
			if showRefreshButton
				($ '<a data-role="button" id="retryButton">Retry</a>').appendTo '#container'
				do ($ '#retryButton').button;
				$('#retryButton').click =>
					do location.reload

		generateResultsList = (inputData) ->
			do clearScreen
			if not inputData.results.length
				notifyApplication 'No tweets found.', true
			else
				listElementMarkup = "<li><div class='tweet_image clearfix'><img src='${profile_image_url}'/></div><h3>${from_user_name}</h3><p class='tweet_date'>at ${created_at}</p><p class='tweet_body'>${text}</p><div class='clear'></div></li>"
				$.template 'listElementMarkup', listElementMarkup
				($ '<ul id="tweets" data-role="listview" data-theme="d"></ul>').appendTo '#container'
				$.tmpl('listElementMarkup', inputData.results).appendTo '#tweets'
				($ '#tweets').listview();

		performTwitterQuery = () ->
			do clearScreen
			notifyApplication "Querying Twitter."
			twitterQuery =
				q: settings.query
				geocode: settings.latitude+','+settings.longitude+','+settings.radius

			$.ajax
				url: endPoint
				type: 'GET'
				dataType: 'jsonp'
				data: twitterQuery
				error: (jqXHR, textStatus, errorThrown) ->
					notifyApplication textStatus, true
				success: (data, textStatus, jqXHR) ->
					generateResultsList data


		return @each ()->
			do initializeSystem
			@
