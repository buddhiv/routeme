/**
 * Created by Buddhi on 6/16/2016.
 */

describe('Tests', function () {
  beforeEach(module('starter'));

  describe('HtmlToTextFilter', function () {
    var text;

    beforeEach(inject(function ($filter) {
      text = $filter('HtmlToTextFilter', {});
    }));
    it("Should remove HTML tags", function () {
      expect(text("<b>This is a HTML code</b>").toBe("This is a HTML code"))
      expect(text("<strong>String</strong>").toBe("String"))
    });
  })
})
