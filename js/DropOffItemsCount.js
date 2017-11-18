/**
 * Récupère le nombre de courriers en attente d'indexation dans la boîte de dépôt
 * Utilise l'API REST de SharePoint
 * La valeur retournée sera affichée dans l'élément DOM ayant l'ID #dropOffItemCount
 */
function countCourrierDepose() {
    // Nom de la bibliothèque de dépôt
    var dropOffListTitle = "Boite de dépot";

    // Requete
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
};
_spBodyOnLoadFunctionNames.push("countCourrierDepose");   