export interface MenuEntry {
  label: string;
  onChoose: () => void;
}

export interface MenuController {
  element: HTMLElement;
  stopListening: () => void;
}
