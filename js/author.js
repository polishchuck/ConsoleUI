var host = 'http://c.mesija.net/';
var key = '4390069';
var sKey = 'WYAf68dOCDK5RSDqyteX';

$(document).ready(function(){
  $("#write").keypress(function(e){
    if(e.keyCode==13){
      console($('#write').val());
    }
  });
});

setTimeout(start,500);

function start (){
  var code = getCookie('code');
  if (code == null){
    write('Вітаємо Гість!\n' +
      'Для початку авторизуйтесь у соціальній мережі ВКонтакті використовуючи команду login\n' +
      'Щоб отримати список усіх команд виконайте команду help');
  }
  else {
    var rec = $.get('https://oauth.vk.com/access_token?' +
      'client_id=' + key + '&' +
      'client_secret=' + sKey + '&' +
      'code=' + code + '&' +
      'redirect_uri=' + host
    );
    write(rec);
  }
}

function write(text,add){
  add = typeof add !== 'undefined' ? add : '';
  $('#console').text($('#console').text() == '\n' ? text+add : $('#console').text()+text+add);
  $('#write').val('');
}

function console (command){
  $('#console').text($('#console').text()+'\n'+$('#status').text().trim()+' ');
  write(command,'\n');
  command = command.split(' ');
  var com = command[0].toLowerCase().trim();
  if(com != '')
  switch (com) {
    case 'hi':
      write('Привіт невідомий користувач :)');
      break;
    case 'login':
      location.href = 'https://oauth.vk.com/authorize?' +
        'client_id=' + key + '&scope=friends,video,offline,notify,nohttps&' +
        'redirect_uri=' + host + '&' +
        'response_type=code&v=5.21';
      break;
    case 'help':
      write('Наразі доступні такі команди:\n.\n' +
        '. login\t\tВиконує вхід у соціальну мережу ВКонтакті\n' +
        '.'
        );
      break;
    case 'cls':
      $('#console').text('');
      $('#write').val('');
      break;
    default:
      write('Команда "'+com+'" не знайдена\n' +
        'Щоб переглянути список усіх команд напишіть help\n' +
        'Щоб отримати детальну інформацію по команді напишіть help назва_команди');
    break;
  }
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