const sendWebhook = async (data, webhookUrl) => {
  data = data ?? {};
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (res.ok) {
    alert('送信しました');
  } else {
    alert('送信に失敗しました');
  }
};

let initWebhookData = {
  username: '試合情報',
};
