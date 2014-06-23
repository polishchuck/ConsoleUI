function console (command,hide){
  if(command.trim() != ''){
    if(hide == 0 || typeof hide == "undefined"){
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
          VK.Auth.login(function() {
            VK.Auth.getLoginStatus(authInfo);
            VK.Api.call('users.get', {uids: user['mid']}, function(r) {
              if(r.response) {
                write('Привіт, ' + r.response[0].first_name + ' ' + r.response[0].last_name + '!');
                user['first_name'] = r.response[0].first_name;
                user['last_name'] = r.response[0].last_name;
              }
            });
          }, +4096+1024+2);
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
            '. clear\t\t\tОчистити консоль\n' +
            '. restart\t\tПерезавантажити консоль\n' +
            '.\n' +
            '. СТАТУС\n' +
            '. status\t\tВивести поточний статус\n' +
            '.'
          );
          break;
        case 'dialog':
          VK.Api.call('messages.getDialogs', {count:20}, function(r) {
            if(r.response) {
              var n = 0;
              status(user['mid']+'/dialog');
            }
          });
          break;
        case 'online':
          var offset = typeof par[1]  != "undefined" ? par[1] : 0;
          VK.Api.call('friends.getOnline', {user_id:user['mid'],list_id:0,offset:offset,online_mobile:0,count:1}, function(r) {
            if(r.response) {
                VK.Api.call('friends.get', {user_id: r.response[0]}, function(s) {
                  if(s.response) {
                    write(' ● ' + s.response[0].first_name + ' ' + s.response[0].last_name);
                  }
                });
              offset = parseInt(offset);
              offset += 1;
              console('online '+offset,0);
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