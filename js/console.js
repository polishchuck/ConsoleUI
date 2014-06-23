function console (command,hide){
  if(command.trim() != ''){
    if(hide == 0 || typeof hide == 'undefined'){
      if(log[log_pos - 1] != command)
        log[log.length] = command;
      log_pos = log.length;
      $('#console').text($('#console').text()+$('#status').text().trim()+' ');
      write(command);
    }
    command = command.split(' ');
    var com = command[0].toLowerCase();
    var n = 1;
    var par =[];
    while(typeof command[n] !== 'undefined'){
      par[n] = command[n].toLowerCase();
      n = n + 1;
    }
    if(com != '')
      switch (com) {
        case 'hi':
          if(user['mid'] == 0)
            write('Привіт невідомий користувач :)\nДумаю вам краще авторизуватися, для цього виконайте у консолі команду login');
          else
            write('Привіт ' + user['first_name'] + ' ' + user['last_name'] + '!');
          break;
        case 'login':
          VK.Auth.login(function() {
            VK.Auth.getLoginStatus(authInfo);
          }, +4096+1024+2);
          break;
        case 'exit':
          VK.Auth.logout(function(response) {
            VK.Auth.getLoginStatus(authInfo);
          });
          user['mid'] = 0;
          break;
        case 'dialog':
          VK.Api.call('messages.getDialogs', {count:20}, function(r) {
            if(r.response) {
              var n = 0;
              status(user['mid']+'/dialog');
            }
            print_r(r.error);
          });
          break;
        case 'online':
          VK.Api.call('friends.getOnline', {user_id:user['mid']}, function(r) {
            if(r.response) {
              var n = 0, uid = [];
              while(typeof r.response[n] !== 'undefined'){
                uid[n] = r.response[n];
                n += 1;
              }
              VK.Api.call('users.get', {user_ids: uid.join()}, function(u) {
                if(u.response) {
                  write('Друзів онлайн: '+ r.response.length);
                  var n = 0, sort = [];
                  while(typeof u.response[n] !== 'undefined'){
                    sort[n] = u.response[n].first_name+'|'+ u.response[n].last_name;
                    n += 1;
                  }
                  sort.sort();
                  n = 0;
                  while(typeof sort[n] !== 'undefined'){
                    wuser = sort[n].split('|');
                    write(' ● ' + wuser[0] + ' ' + wuser[1]);
                    n += 1;
                  }
                }
                else write("Помилка зв`язку з сервером");
              });
            }
            else write("Помилка зв`язку з сервером");
          });
          break;
        case 'status':
          if(par[1] == 'set'){
            par[0] = ' ';
            par[1] = ' ';
            var status = par.join(' ');
            status = status.trim();
            VK.Api.call('status.set', {text:status}, function(r) {
              if(r.response) {
                write('Ваш статус змінено на:\n' + status);
              }
              else {
                write('Помилка зміни статусу. Код помилки '+r.error['error_code']+'\n'+r.error['error_msg']);
              }
            });
          }
          else{
            VK.Api.call('status.get', {}, function(r) {
              if(r.response) {
                write('Ваш поточний статус:\n' + r.response.text);
              }
            });
          }
          break;
        case 'clear':
          $('#console').text('');
          $('#write').val('');
          break;
        case 'restart':
          location.reload();
          break;
        case 'reload':
          location.reload();
          break;
        case 'help':
          write('Наразі доступні такі команди:\n' +
            '.\n' +
            '. АВТОРИЗАЦІЯ\n' +
            '. login\t\t\tВиконує вхід у соціальну мережу ВКонтакті\n' +
            '. exit\t\t\tВийти з ВКонтакті\n' +
            '.\n' +
            '. КОНСОЛЬ\n' +
            '. clear\t\t\tОчистити консоль\n' +
            '. restart\t\tПерезавантажити консоль\n' +
            '.\n' +
            '. СТАТУС\n' +
            '. status\t\tВивести поточний статус\n' +
            '.'
          );
          break;
        default:
          write('Команда "'+com+'" не знайдена\n' +
            'Щоб переглянути список усіх команд напишіть help\n' +
            'Щоб отримати детальну інформацію по команді напишіть help назва_команди');
          break;
      }
  }
  else $('#write').val('');
  stb(0);
}