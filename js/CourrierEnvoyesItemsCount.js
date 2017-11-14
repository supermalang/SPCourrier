/**
 * Ce script permet de récupérer le nombre de courriers envoyés les 30 derniers jours
 * Et mettra la valeur dans les éléments DOM ayant l'ID #envoyesItemCount
 */

// Nom de la bibliothèque de dépôt
var renvoyesListTitle = "CourrierEnvoye";

// Pour bien faire le filtre on veut calculer la date J-30
var myDate = new Date();  
var today = myDate.getDate();
myDate.setDate(today - 30);  

// Filtre de la requête
var filter = "DateCourrier gt datetime'"+myDate.toISOString()+"'";

// Exécution de la requête JQuery
$(document).ready(function() {
    $.ajax({
        url: "/_api/web/lists/GetByTitle('"+renvoyesListTitle+"')/items?$filter="+filter,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },
        success: function(data) { 
            var itemCount = data.d.results.length;
            $("#envoyesItemCount").html(itemCount);
        }
    });
});