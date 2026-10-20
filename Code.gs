const ROTATION_SHEET_NAME = "Rotacion";
const ROTATION_SPREADSHEET_ID = "1gvm2an7NxFBqnDxCo8oFOWQ83H25iwHt5cdnJlr67YU";
const ROTATION_CALLBACK_PATTERN = /^parfumClubCallbacks\.cb_[A-Za-z0-9_]+$/;

function doGet(event) {
  const callback = event && event.parameter && event.parameter.callback;
  if (!callback || !ROTATION_CALLBACK_PATTERN.test(callback)) {
    return ContentService.createTextOutput("/* Invalid callback */")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  try {
    const destination = getNextDestination_();
    return jsonp_(callback, { destination: destination });
  } catch (error) {
    console.error(error);
    return jsonp_(callback, { error: "rotation_unavailable" });
  }
}

function getNextDestination_() {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.openById(ROTATION_SPREADSHEET_ID);

    let sheet = spreadsheet.getSheetByName(ROTATION_SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.getSheetByName("Hoja 1") || spreadsheet.insertSheet(ROTATION_SHEET_NAME);
      if (sheet.getName() !== ROTATION_SHEET_NAME) {
        sheet.setName(ROTATION_SHEET_NAME);
      }
    }

    if (!sheet.getRange("A1").getValue()) {
      sheet.getRange("A1:A2").setValues([["ultimo_destino_usado"], [2]]);
    }

    const lastDestination = Number(sheet.getRange("A2").getValue());
    if (lastDestination !== 1 && lastDestination !== 2) {
      throw new Error("The last WhatsApp destination in Rotacion!A2 must be 1 or 2.");
    }

    const nextDestination = lastDestination === 1 ? 2 : 1;
    sheet.getRange("A2").setValue(nextDestination);
    SpreadsheetApp.flush();
    return nextDestination;
  } finally {
    lock.releaseLock();
  }
}

function jsonp_(callback, payload) {
  return ContentService.createTextOutput(callback + "(" + JSON.stringify(payload) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
