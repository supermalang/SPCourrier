/**
 * Récupère le nombre de courriers reçus les 30 derniers jours.
 * Utilise l'API REST de SharePoint
 * La valeur retournée sera affichée dans l'élément DOM ayant l'ID #recusItemCount
 */
function countCourrierRecu() {
    // Nom de la bibliothèque des courriers reçus
    var recusListTitle = "CourrierRecu";

    // Calcul de la date la plus ancienne (J-30)
    var myDate = new Date();  
    var today = myDate.getDate();
    myDate.setDate(today - 30);  

    // Chaîne de filtre de la requête
    var filter = "DateCourrier gt datetime'"+myDate.toISOString()+"'";

    // Requête
    $.ajax({
        url: "/_api/web/lists/GetByTitle('"+recusListTitle+"')/items?$filter="+filter,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },
        success: function(data) { 
            var itemCount = data.d.results.length;
            $("#recusItemCount").html(itemCount);
        }
    });
};
_spBodyOnLoadFunctionNames.push("countCourrierRecu");   