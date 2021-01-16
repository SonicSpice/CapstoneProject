function triggerAlert(alertElement, alertMessage) {
  alertElement.style.display = "block";
  alertElement.innerHTML = alertMessage;
}

function closeAlert(alertElement, alertMessage) {
  alertElement.style.display = "none";
  alertElement.innerHTML = alertMessage;
}

export { triggerAlert, closeAlert };
