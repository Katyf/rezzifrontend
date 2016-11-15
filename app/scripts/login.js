/*global $:false*/
'use strict';
var rezziApp = (function(){
  var authToken, apiHost;

  var init = function(){
    authToken = localStorage.getItem('authToken');
    apiHost = 'http://localhost:3000';
    setupAjaxRequests();
    $('#signin-form').on('submit', submitLogin);
    $('#signup-form').on('submit', submitRegistration);
    //$('#sign-out').on('click', signOut);
  };

  var submitRegistration = function(event){
    console.log('submit reg');
    event.preventDefault();
    $.ajax({
      url: apiHost + '/users',
      type: 'POST',
      data: {user: {
        name: $('#name').val(),
        email: $('#email').val(),
        password: $('#password').val()
      }},
    }).done(loginSuccess).fail(function(){
      console.log("error");
    });
    return false;
  };

  var loginSuccess = function(userData){
    debugger;
    localStorage.setItem('authToken', userData.token);
    console.log('Logged in!');
    window.location.href = '/upload.html';
    console.log('Logged in!');
  };

  var submitLogin = function(){
    var $form;
    event.preventDefault();
    $form = $(this);
    $.ajax({
      url: apiHost + '/users/sign_in',
      type: 'POST',
      data: $form.serialize()
    }).done(loginSuccess).fail(function(){
      console.log('error');
    });
    return false;
  };

  var setupAjaxRequests = function(){
    $.ajaxPrefilter(function(options){
      options.headers = {};
      options.headers['AUTHORIZATION'] = 'Token token='+ authToken;
    });
  };

  var acceptFailure = function(error){
    if(error.status === 401){
      console.log('send to login screen');
      window.location.href = '/signin.html';
    }
  };

  var signOut = function(event){
    event.preventDefault();
    localStorage.removeItem('authToken');
    authToken = undefined;
    window.location.href = '/signin.html';
  };
  return {init: init};
})();

$(document).ready(function(){
  rezziApp.init();
});
