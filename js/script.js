let editingMatchIndex = -1;
const matches = [];
const teams = [
  'Nimmt55',
  'Xayfhers',
  'HANAGUMI',
  'Hiems DandeLion',
  'CVent',
  'あしたはあしたのゆめをみて',
  'ANA',
  'Blast',
];

// 入力フォームクリア
const clearForm = () => {
  editingMatchIndex = -1;
  document.getElementById('hours').value = 22;
  document.getElementById('minutes').value = 0;
  document.getElementById('blue').value = 0;
  document.getElementById('orange').value = 0;
  document.getElementById('blue_twitch').value = '';
  document.getElementById('orange_twitch').value = '';
};

// 数値ゼロパディング
const zeroPadding = (value, length) => {
  return (Array(length).join('0') + value).slice(-length);
};

// groupBy
const groupBy = (items, key) => {
  return items.reduce((retValue, groups) => {
    (retValue[groups[key]] = retValue[groups[key]] || []).push(groups);
    return retValue;
  }, {});
};

// TwitchマルチビューURL取得
const getMultiTwitchURL = (urls) => {
  let url = 'https://www.multitwitch.tv';
  urls.forEach((u) => {
    url += u.replace('https://www.twitch.tv', '');
  });
  return url;
};

// 時間選択リスト生成
const createSelectTime = () => {
  const selectHours = document.getElementById('hours');
  for (let i = 17; i < 28; i++) {
    let option = document.createElement('option');
    option.classList.add('bg-gray-600', 'text-gray-200');
    option.text = zeroPadding(i, 2);
    option.value = i;
    selectHours.appendChild(option);
  }

  const selectMinutes = document.getElementById('minutes');
  [0, 30].forEach((min) => {
    let option = document.createElement('option');
    option.classList.add('px-2', 'bg-gray-600', 'text-gray-200');
    option.text = zeroPadding(min, 2);
    option.value = min;
    selectMinutes.appendChild(option);
  });
};

// チーム選択リスト生成
const createSelectTeam = () => {
  const selectBlue = document.getElementById('blue');
  const selectOrange = document.getElementById('orange');
  teams.forEach((team, i) => {
    let option = document.createElement('option');
    option.classList.add('bg-gray-600', 'text-gray-200');
    option.text = team;
    option.value = i;
    selectBlue.appendChild(option.cloneNode(true));
    selectOrange.appendChild(option.cloneNode(true));
  });
};

// ロード時
createSelectTime();
createSelectTeam();
clearForm();

// マッチ生成　編集ボタン
const createMatchEditButton = (match, index) => {
  let icon = document.createElement('i');
  icon.classList.add('far', 'fa-edit');

  let button = document.createElement('button');
  button.classList.add('px-2', 'bg-green-500', 'hover:bg-green-600', 'rounded-sm');
  button.appendChild(icon);

  button.addEventListener('click', () => {
    editingMatchIndex = index;
    document.getElementById('hours').value = match.hours;
    document.getElementById('minutes').value = match.minutes;
    document.getElementById('blue').value = teams.indexOf(match.blue);
    document.getElementById('orange').value = teams.indexOf(match.orange);
    document.getElementById('blue_twitch').value = match.blueTwitchUrl;
    document.getElementById('orange_twitch').value = match.orangeTwitchUrl;
  });
  return button;
};

// マッチ生成　削除ボタン
const createMatchDeleteButton = (match, index) => {
  let icon = document.createElement('i');
  icon.classList.add('fas', 'fa-trash');

  let button = document.createElement('button');
  button.classList.add('px-2', 'ml-1', 'bg-red-500', 'hover:bg-red-600', 'rounded-sm');
  button.appendChild(icon);

  button.addEventListener('click', () => {
    matches.splice(index, 1);
    createMatchOutput();
  });
  return button;
};

// マッチ生成　時間
const createMatchTime = (match) => {
  let icon = document.createElement('i');
  icon.classList.add('fas', 'fa-clock', 'mx-2');

  let textNode = document.createTextNode(`${match.hours}:${zeroPadding(match.minutes, 2)}`);

  let span = document.createElement('span');
  span.appendChild(icon);
  span.appendChild(textNode);
  return span;
};

// マッチ生成　チーム
const createMatchTeam = (name, url, classList) => {
  let iconTeam = document.createElement('i');
  iconTeam.classList.add('fas', 'fa-users', 'mx-2');
  let iconTwitch = document.createElement('i');
  iconTwitch.classList.add('fab', 'fa-twitch', 'mx-2');

  let textNodeName = document.createTextNode(name);
  let textNodeUrl = document.createTextNode(url ?? '');

  let span = document.createElement('span');
  span.classList.add(classList);
  span.appendChild(iconTeam);
  span.appendChild(textNodeName);
  span.appendChild(iconTwitch);
  span.appendChild(textNodeUrl);
  return span;
};

// マッチ出力イメージ生成
const createMatchOutput = () => {
  const matchesElement = document.getElementById('matches');
  matchesElement.textContent = '';

  matches.forEach((match, i) => {
    let matchElement = document.createElement('div');
    matchElement.classList.add(
      'flex',
      'items-center',
      'px-3',
      'py-2',
      'mb-2',
      'bg-gray-600',
      'rounded'
    );

    // ボタン
    matchElement.appendChild(createMatchEditButton(match, i));
    matchElement.appendChild(createMatchDeleteButton(match, i));

    // 時間
    matchElement.appendChild(createMatchTime(match));

    // チーム
    const teamsDiv = document.createElement('div');
    teamsDiv.classList.add('flex', 'flex-col');
    teamsDiv.appendChild(createMatchTeam(match.blue, match.blueTwitchUrl, ['text-blue-200']));
    teamsDiv.appendChild(createMatchTeam(match.orange, match.orangeTwitchUrl, ['text-red-200']));
    matchElement.appendChild(teamsDiv);

    matchesElement.appendChild(matchElement);
  });
};

// 保存ボタンクリック
document.getElementById('btn_save').addEventListener('click', () => {
  const hours = document.getElementById('hours').value;
  const minutes = document.getElementById('minutes').value;
  const time = `${zeroPadding(hours, 2)}:${zeroPadding(minutes, 2)}`;
  const teamBlue = document.getElementById('blue').value;
  const teamOrange = document.getElementById('orange').value;
  const blueTwitchUrl = document.getElementById('blue_twitch').value;
  const orangeTwitchUrl = document.getElementById('orange_twitch').value;

  const data = {
    hours: hours,
    minutes: minutes,
    time: time,
    blue: teams[teamBlue],
    orange: teams[teamOrange],
    blueTwitchUrl: blueTwitchUrl,
    orangeTwitchUrl: orangeTwitchUrl,
  };

  if (editingMatchIndex < 0) {
    matches.push(data);
  } else {
    matches[editingMatchIndex] = data;
  }

  clearForm();
  createMatchOutput();
});

// 送信ボタンクリック
document.getElementById('btn_send').addEventListener('click', () => {
  // 時間で集約
  matches.sort((a, b) => a.time - b.time);
  const matchGroups = groupBy(matches, 'time');

  let webhookData = JSON.parse(JSON.stringify(initWebhookData));
  let embeds = [];

  // 時間ごとに送信
  Object.keys(matchGroups).forEach((key) => {
    const groupMatches = matchGroups[key];
    let embed = {
      title: key,
      description: '',
      fields: [],
    };
    let streamingsMatchCount = 0;
    let streamings = [];

    groupMatches.forEach((m) => {
      const title = `:fire: ${m.blue} vs ${m.orange} :fire:`;
      let streaming = '';
      if (m.blueTwitchUrl && m.orangeTwitchUrl) {
        streaming = [
          `:eyes: ${m.blue} ${m.blueTwitchUrl}`,
          `:eyes: ${m.orange} ${m.orangeTwitchUrl}`,
          `:white_check_mark: 両チーム観たいよくばりな方はこちら`,
          `${getMultiTwitchURL([m.blueTwitchUrl, m.orangeTwitchUrl])}`,
        ].join('\n');

        embed.footer = {
          text: '※コメントする際はどちらのチャンネルか事前に必ず確認してください',
        };
        streamings.push(m.blueTwitchUrl);
        streamings.push(m.orangeTwitchUrl);
        streamingsMatchCount++;
      } else if (m.blueTwitchUrl) {
        streaming = `:eyes: ${m.blue} ${m.blueTwitchUrl}`;
        streamings.push(m.blueTwitchUrl);
        streamingsMatchCount++;
      } else if (m.orangeTwitchUrl) {
        streaming = `:eyes: ${m.orange} ${m.orangeTwitchUrl}`;
        streamings.push(m.orangeTwitchUrl);
        streamingsMatchCount++;
      } else {
        streaming = ':eyes: 配信なし';
      }

      embed.fields.push({
        name: title,
        value: streaming,
      });
    });

    if (streamingsMatchCount > 1) {
      embed.description = [
        `:white_check_mark: 全チーム観たいよくばりな方はこちら`,
        `${getMultiTwitchURL(streamings)}`,
      ].join('\n');

      embed.footer = {
        text: '※コメントする際はどちらのチャンネルか事前に必ず確認してください',
      };
    }
    embeds.push(embed);
  });

  webhookData.embeds = embeds;
  sendWebhook(webhookData);
});
