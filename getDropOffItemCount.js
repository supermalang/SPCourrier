/**
 * Ce script permet de récupérer le nombre d'éléments dans la  bibliothèque de dépôt
 * Et mettra la valeur dans les éléments DOM ayant l'ID #dropOffItemCount
 */

// Nom de la bibliothèque de dépôt
var dropOffListTitle = "Boite de dépot";
$(document).ready(function() {
    $.ajax({
        url: "/_api/web/lists/GetByTitle('"+dropOffListTitle+"')/itemcount",
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },
        success: function(data) { 
            var itemCount = data.d.ItemCount;
            $("#dropOffItemCount").html(itemCount);
        }
    });
});