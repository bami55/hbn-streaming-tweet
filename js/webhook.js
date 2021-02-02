const WebhookURL =
  'https://discord.com/api/webhooks/418737759243730945/QjLcKINqiQFZnFeaanGY-F7a5--anqsCCUIATa1Gsfdxts1kEA1LvlZDqxFOVHKwfwZ-';

const sendWebhook = (data) => {
  data = data ?? {};
  fetch(WebhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

let initWebhookData = {
  username: 'Name',
  avatar_url: 'https://github.com/qiita.png',
  content: '',
};
