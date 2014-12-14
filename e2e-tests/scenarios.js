'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /search when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/search");
  });


  describe('view1', function() {

    beforeEach(function() {
      browser.get('index.html#/search');
    });


    it('should render search when user navigates to /search', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });

  });


  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/result');
    });


    it('should render result when user navigates to /result', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
