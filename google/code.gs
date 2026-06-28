function doPost(e) {

  try {

    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var feuille;

    switch(data.formType){

      case "participant":
        feuille = ss.getSheetByName("Participants");
        break;

      case "benevole":
        feuille = ss.getSheetByName("Benevoles");
        break;

      case "contribution":
        feuille = ss.getSheetByName("Contributions");
        break;

      case "questionnaire":
        feuille = ss.getSheetByName("Questionnaires");
        break;

      case "satisfaction":
        feuille = ss.getSheetByName("Satisfaction");
        break;

      default:
        return ContentService
        .createTextOutput("Formulaire inconnu");
    }

    data.date = new Date();

    feuille.appendRow(Object.values(data));

    return ContentService
    .createTextOutput(
      JSON.stringify({
        success:true,
        message:"Enregistré avec succès"
      })
    )
    .setMimeType(ContentService.MimeType.JSON);

  }

  catch(err){

    return ContentService
    .createTextOutput(
      JSON.stringify({
        success:false,
        message:err.toString()
      })
    )
    .setMimeType(ContentService.MimeType.JSON);

  }

}