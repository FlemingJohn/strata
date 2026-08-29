import { showTitleScreen } from "./interface/showTitleScreen";

function startApplication(): void {
  const applicationElement = document.getElementById("application");

  if (!applicationElement) {
    throw new Error("The application element was not found in the page");
  }

  applicationElement.className = "application-frame";
  showTitleScreen(applicationElement);
}

startApplication();
