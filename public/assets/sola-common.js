// sola — 共通ヘッダー注入スクリプト
// 使い方:
//   <div id="sola-header"></div>
//   <script src="/assets/sola-common.js"></script>
//   <script>renderSolaHeader();</script>

function renderSolaHeader() {
  const html = `
    <div class="sola-hdr">
      <div class="sola-hdr-left">
        <a href="/" class="sola-logo">sola</a>
        <span class="sola-subtitle">建設業向け 総合業務管理システム</span>
      </div>
      <div class="sola-hdr-right">
        <a href="/" class="sola-menu-link">← メニュー</a>
        <span class="sola-user">西川 公大 ｜ 0.9.9.17341</span>
      </div>
    </div>
  `;
  const target = document.getElementById('sola-header');
  if (target) {
    target.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('afterbegin', html);
  }
}
