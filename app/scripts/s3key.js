'use strict';
var S3App = S3App || {};

S3App.submitVideo = function() {
  event.preventDefault();
  $.ajax({
    url: 'http://localhost:3000/videos',
    type: 'POST',
    data: { video: {
      name: $('#video-name').val()
    }},
  })
  .done(function(results) {
    debugger;
    console.log(results.id);
    S3App.getKey(results.id);
    S3App.getMessage(results.id);
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

};

S3App.getKey = function(id){
  $.ajax({
    url: 'http://localhost:3000/amazon/sign_key',
    type: 'GET',
    dataType: 'JSON',
  })
  .done(function(data) {
    console.log('got key');
    $('#v-key').attr('value', data.key);
    $('#v-accesskey').attr('value', data.access_key);
    $('#v-policy').attr('value', data.policy);
    $('#v-sig').attr('value', data.signature);
    $('#videoForm').on('submit', function(){
      S3App.sendUrlToDb(id, data.key);
    });
  })
  .fail(function() {
    console.log("error");
  });

};


S3App.sendUrlToDb = function(id, key){
  // var postId = parseInt(event.target.id.replace(/\D/g, ''));
  //debugger;
  $.ajax({
    url: 'https://localhost:3000/videos/' + id ,
    type: 'POST',
    data: { video: {
     url: 'https://s3.amazonaws.com/rezzi/' + key }},
  })
  .done(function(data) {
    console.log(data);
    window.location.href = '/success.html';
  })
  .fail(function() {
    console.log("error");
  })
  .always(function() {
    console.log("complete");
  });

};




$(document).ready(function() {


  $('#videoForm').on('submit', function(){
    console.log('submitted');
    S3App.submitVideo();
  });

  $('#done').on('click', function() {
    window.location.href = '/success.html';
    // add to github pages when hosted
  });

});


