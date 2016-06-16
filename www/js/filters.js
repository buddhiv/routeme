/**
 * Created by Buddhi on 6/4/2016.
 */

angular.module('starter.filters', [])

  .filter('HtmlToTextFilter', function () {
    return function (text) {
      return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  })

.filter();
