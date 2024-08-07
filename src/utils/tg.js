const tgPre = "https://t.me/";

export default {
  openAuto(url) {
    if (url.indexOf(tgPre) == 0) {
      this.openTelegramLink(url);
    } else {
      this.openLink(url);
    }
  },
  openChat(uname) {
    const chatUrl = tgPre + encodeURIComponent(uname);
    // Telegram.WebApp
    this.openTelegramLink(chatUrl);
  },
  shareUrl(url, text = "") {
    this.openTelegramLink(
      `https://t.me/share/url?` +
        new URLSearchParams({ url, text }).toString().replace(/\+/g, "%20")
    );
  },
};
