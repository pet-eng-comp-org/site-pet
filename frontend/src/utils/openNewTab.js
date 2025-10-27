function openNewTab(url) {
  let win = window.open(url, "_blank");
  win.focus();
}
export default openNewTab;
