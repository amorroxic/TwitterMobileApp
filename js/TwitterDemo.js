// Generated by CoffeeScript 1.3.3
(function() {
  var $;

  $ = jQuery;

  $.fn.extend({
    TwitterDemo: function(options) {
      var clearScreen, endPoint, generateResultsList, initializeSystem, locationFailure, locationSuccess, log, notifyApplication, performTwitterQuery, settings;
      settings = {
        debug: false,
        latitude: '',
        longitude: '',
        radius: '32.18688km',
        query: 'traffic'
      };
      settings = $.extend(settings, options);
      endPoint = "http://search.twitter.com/search.json";
      log = function(msg) {
        if (settings.debug) {
          return typeof console !== "undefined" && console !== null ? console.log(msg) : void 0;
        }
      };
      initializeSystem = function() {
        notifyApplication("Trying geolocation..");
        if (Modernizr.geolocation) {
          return navigator.geolocation.getCurrentPosition(locationSuccess, locationFailure, {
            timeout: 2000
          });
        } else {
          return notifyApplication('Please enable location sharing.', true);
        }
      };
      clearScreen = function() {
        return ($('#container'))[0].innerHTML = '';
      };
      locationSuccess = function(position) {
        var _this = this;
        settings.latitude = position.coords.latitude;
        settings.longitude = position.coords.longitude;
        notifyApplication('Location successfully detected.');
        ($('<a data-role="button" id="loadTweetsButton">Load tweets</a>')).appendTo('#container');
        ($('#loadTweetsButton')).button();
        return $('#loadTweetsButton').click(function() {
          return performTwitterQuery();
        });
      };
      locationFailure = function(error) {
        var message;
        message = 'A problem occured while trying to get your location.<br>';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message += 'Permission was denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            message += 'Location data not available.';
            break;
          case error.TIMEOUT:
            message += 'Location request timeout.';
            break;
          default:
            message += 'An unspecified error occurred.';
        }
        return notifyApplication(message, true);
      };
      notifyApplication = function(message, showRefreshButton) {
        var _this = this;
        if (showRefreshButton == null) {
          showRefreshButton = false;
        }
        log(message);
        ($('#container'))[0].innerHTML += message + '<br>';
        if (showRefreshButton) {
          ($('<a data-role="button" id="retryButton">Retry</a>')).appendTo('#container');
          ($('#retryButton')).button();
          return $('#retryButton').click(function() {
            return location.reload();
          });
        }
      };
      generateResultsList = function(inputData) {
        var listElementMarkup;
        clearScreen();
        if (!inputData.results.length) {
          return notifyApplication('No tweets found.', true);
        } else {
          listElementMarkup = "<li><div class='tweet_image clearfix'><img src='${profile_image_url}'/></div><h3>${from_user_name}</h3><p class='tweet_date'>at ${created_at}</p><p class='tweet_body'>${text}</p><div class='clear'></div></li>";
          $.template('listElementMarkup', listElementMarkup);
          ($('<ul id="tweets" data-role="listview" data-theme="d"></ul>')).appendTo('#container');
          $.tmpl('listElementMarkup', inputData.results).appendTo('#tweets');
          return ($('#tweets')).listview();
        }
      };
      performTwitterQuery = function() {
        var twitterQuery;
        clearScreen();
        notifyApplication("Querying Twitter.");
        twitterQuery = {
          q: settings.query,
          geocode: settings.latitude + ',' + settings.longitude + ',' + settings.radius
        };
        return $.ajax({
          url: endPoint,
          type: 'GET',
          dataType: 'jsonp',
          data: twitterQuery,
          error: function(jqXHR, textStatus, errorThrown) {
            return notifyApplication(textStatus, true);
          },
          success: function(data, textStatus, jqXHR) {
            return generateResultsList(data);
          }
        });
      };
      return this.each(function() {
        initializeSystem();
        return this;
      });
    }
  });

  /* --------------------------------------------
       Begin start.coffee
  --------------------------------------------
  */


  $(function() {
    return ($('#container')).TwitterDemo({
      'debug': true
    });
  });

}).call(this);
