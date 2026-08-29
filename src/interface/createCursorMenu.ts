import type { MenuController, MenuEntry } from "../types/menu";

const CURSOR_SYMBOL = "▶";

const KEYS_THAT_MOVE_UP = ["ArrowUp", "w", "W"];
const KEYS_THAT_MOVE_DOWN = ["ArrowDown", "s", "S"];
const KEYS_THAT_CHOOSE = ["Enter", " "];

export function createCursorMenu(entries: MenuEntry[]): MenuController {
  const list = document.createElement("ul");
  list.className = "menu-list";

  const rows: HTMLLIElement[] = [];
  let selectedIndex = 0;

  function highlightSelectedRow(): void {
    rows.forEach((row, rowIndex) => {
      row.classList.toggle("menu-entry-selected", rowIndex === selectedIndex);
    });
  }

  function moveSelection(step: number): void {
    selectedIndex = (selectedIndex + step + entries.length) % entries.length;
    highlightSelectedRow();
  }

  entries.forEach((entry, entryIndex) => {
    const row = document.createElement("li");
    row.className = "menu-entry";

    const cursor = document.createElement("span");
    cursor.className = "menu-cursor";
    cursor.setAttribute("aria-hidden", "true");
    cursor.textContent = CURSOR_SYMBOL;

    const button = document.createElement("button");
    button.className = "menu-button";
    button.type = "button";
    button.textContent = entry.label;
    button.addEventListener("click", entry.onChoose);
    button.addEventListener("mouseenter", () => {
      selectedIndex = entryIndex;
      highlightSelectedRow();
    });

    row.append(cursor, button);
    list.append(row);
    rows.push(row);
  });

  function handleKeyDown(event: KeyboardEvent): void {
    if (KEYS_THAT_MOVE_UP.includes(event.key)) {
      event.preventDefault();
      moveSelection(-1);
      return;
    }

    if (KEYS_THAT_MOVE_DOWN.includes(event.key)) {
      event.preventDefault();
      moveSelection(1);
      return;
    }

    if (KEYS_THAT_CHOOSE.includes(event.key)) {
      event.preventDefault();
      entries[selectedIndex].onChoose();
    }
  }

  window.addEventListener("keydown", handleKeyDown);
  highlightSelectedRow();

  return {
    element: list,
    stopListening(): void {
      window.removeEventListener("keydown", handleKeyDown);
    }
  };
}
