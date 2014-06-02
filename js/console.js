function console (command){
  if(command.trim() != ''){
    if(log[log_pos - 1] != command)
    log[log.length] = command;
    log_pos = log.length;
    $('#console').text($('#console').text()+$('#status').text().trim()+' ');
    write(command);
    command = command.split(' ');
    var com = command[0].toLowerCase();
    var n = 1;
    var par =[];
    while(typeof command[n] !=="undefined"){
      par[n] = command[n].toLowerCase();
      n = n + 1;
    }
    if(com != '')
      switch (com) {
        case 'hi':
          if(user['mid'] == 0)
            write('Привіт невідомий користувач :)');
          else
            write('Привіт ' + user['first_name'] + ' ' + user['last_name'] + ' :)');
          break;
        case 'login':
          VK.Api.call('account.getAppPermissions', {user_id: user['mid']}, function(r) {
            print_r(r);
            if(r.error) {
              print_r(r.error);
            }
          });
          VK.Auth.login(function() {
            VK.Auth.getLoginStatus(authInfo);
            VK.Api.call('users.get', {uids: user['mid']}, function(r) {
              if(r.response) {
                write('Привіт, ' + r.response[0].first_name + ' ' + r.response[0].last_name + '!');
                user['first_name'] = r.response[0].first_name;
                user['last_name'] = r.response[0].last_name;
              }
            });
          }, +1+2+1024+4096+524288);
          break;
        case 'exit':
          VK.Auth.logout(function(response) {
            VK.Auth.getLoginStatus(authInfo);
          });
          user['mid'] = 0;
          break;
        case 'help':
          write('Наразі доступні такі команди:\n' +
            '.\n' +
            '. АВТОРИЗАЦІЯ\n' +
            '. login\t\t\tВиконує вхід у соціальну мережу ВКонтакті\n' +
            '. exit\t\t\tВийти з ВКонтакті\n' +
            '.\n' +
            '. КОНСОЛЬ\n' +
            '. cls\t\t\tОчистити консоль\n' +
            '. restart\t\tПерезавантажити консоль\n' +
            '.\n' +
            '. СТАТУС\n' +
            '. status\t\tВивести поточний статус\n' +
            '.'
          );
          break;
        case 'dialog':
          VK.Api.call('messages.getDialogs', {count:20}, function(r) {
            print_r(r);
            if(r.response) {
              var n = 0;
              print_r(r.response);
              status(user['mid']+'/dialog');
            }
          });
          break;
        case 'online':
          VK.Api.call('friends.getOnline', {user_id:user['mid'],count:100}, function(r) {
            if(r.response) {
              var n = 0;
              while(typeof r.response[n] != "undefined"){
                VK.Api.call('users.get', {uids: r.response[n]}, function(s) {
                  if(s.response) {
                    write(' ● ' + s.response[n].first_name + ' ' + s.response[n].last_name);
                  }
                });
                n = n + 1;
              }
            }
          });
          break;
        case 'status':
          VK.Api.call('status.get', {}, function(r) {
            if(r.response) {
              write('Ваш поточний статус:\n' + r.response.text);
            }
          });
          break;
        case 'cls':
          $('#console').text('');
          $('#write').val('');
          break;
        case 'restart':
          location.reload();
          break;
        case 'reload':
          location.reload();
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