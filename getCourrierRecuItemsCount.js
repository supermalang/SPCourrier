/**
 * Ce script permet de récupérer le nombre de courriers reçus les 30 derniers jours
 * Et mettra la valeur dans les éléments DOM ayant l'ID #recusItemCount
 */

// Nom de la bibliothèque de dépôt
var recusListTitle = "CourrierRecu";

// Les dates qu'on veut
var myDate = new Date();  
var today = myDate.getDate();
myDate.setDate(today - 30);  

// Filtre de la requête
var filter = "DateCourrier gt datetime'"+myDate.toISOString()+"'";

$(document).ready(function() {
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
});