export function showTitleScreen(container: HTMLElement): void {
  container.replaceChildren();

  const panel = document.createElement("section");
  panel.className = "screen-panel";

  const name = document.createElement("h1");
  name.className = "title-screen-name";
  name.textContent = "STRATA";

  const tagline = document.createElement("p");
  tagline.className = "title-screen-tagline";
  tagline.textContent = "Dig through the history you made";

  const actions = document.createElement("div");
  actions.className = "column-stack";

  const connectButton = document.createElement("button");
  connectButton.className = "primary-action";
  connectButton.type = "button";
  connectButton.textContent = "Connect wallet";

  const demoButton = document.createElement("button");
  demoButton.className = "secondary-action";
  demoButton.type = "button";
  demoButton.textContent = "Try a demo wallet";

  actions.append(connectButton, demoButton);
  panel.append(name, tagline, actions);
  container.append(panel);
}
