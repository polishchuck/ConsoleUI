var host = 'http://c.mesija.net/';
var user = [];
user['mid'] = 0;
var log = [];
var log_pos = 0;

$(document).ready(function(){
  $("#write").keydown(function(e){
    if(e.keyCode==13){
      console($('#write').val());
    }
    if(e.keyCode==38){
      console_log('up');
    }
    if(e.keyCode==40){
      console_log('down');
    }
  });
});

setTimeout(start,0);

function authInfo(response) {
  if (response.session) {
    status(response.session.mid);
    user['mid'] = response.session.mid;
  } else {
    status('console');
  }
}

function console_log(type){
  if(type == 'up'){
    if(log_pos != 0){
      log_pos = log_pos - 1;
      $('#write').val(log[log_pos]);
    }
  }
  if(type == 'down'){
    if(log_pos != log.length){
      log_pos = log_pos + 1;
      $('#write').val(log[log_pos]);
    }
  }
}

function print_r (array){
  $.each(array, function(index, value) {
    alert(index + ': ' + value);
  });
}

function start (){
  VK.init({
    apiId: 4390729
  });
  VK.Auth.getLoginStatus(authInfo);
  VK.Api.call('users.get', {uids: user['mid']}, function(r) {
    if(r.response) {
      write('Привіт ' + r.response[0].first_name + ' ' + r.response[0].last_name + '!');
      user['first_name'] = r.response[0].first_name;
      user['last_name'] = r.response[0].last_name;
    }
  });
  write('Вітаємо у Console UI!\n' +
    'Для авторизації у соціальній мережі ВКонтакті використовуйте команду login\n' +
    'Щоб отримати список усіх команд виконайте команду help');
}

function write(text,add){
  add = typeof add !== 'undefined' ? add : '';
  $('#console').text($('#console').text() == '\n' ? text+add : $('#console').text()+text+add+'\n');
  $('#write').val('');
}

$('*').click(function(){
  $('#write').focus();
});

function status (text){
  $('#status').text('['+text+']#');
}

function getCookie(name) {
  var cookie = " " + document.cookie;
  var search = " " + name + "=";
  var setStr = null;
  var offset = 0;
  var end = 0;
  if (cookie.length > 0) {
    offset = cookie.indexOf(search);
    if (offset != -1) {
      offset += search.length;
      end = cookie.indexOf(";", offset)
      if (end == -1) {
        end = cookie.length;
      }
      setStr = unescape(cookie.substring(offset, end));
    }
  }
  return(setStr);
}

function stb(speed) {
  var height= $("body").height();
  $('html,body').animate({"scrollTop":height},speed);
}