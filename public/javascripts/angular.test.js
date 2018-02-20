describe("Unit tests", function() {

  beforeEach(angular.mock.module('gamingNews'));

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should have a MainCtrl controller', function() {
    expect(gamingNews.MainCtrl).toBeDefined();
  });

  it('should jump to the /home path when / is accessed', function() {
    browser().navigateTo('#/');
    expect(browser().location().path()).toBe("/login");
  });

  it('ensures user can log in', function() {
    browser().navigateTo('#/login');
    expect(browser().location().path()).toBe("/login");
    input('username').enter('MaartenTest');
    input('password').enter('MaartenTest');
    element('submit').click();

    expect(browser().location().path()).toBe("/home");

    expect(element('#currentUs').html()).toContain('MaartenTest');
  });

  it('should keep invalid logins on this page', function() {
    browser().navigateTo('#/login');
    expect(browser().location().path()).toBe("/login");

    input('email').enter('invalid@test.com');
    input('password').enter('wrong password');
    element('submit').click();

    expect(browser().location().path()).toBe("/login");

  });
});
