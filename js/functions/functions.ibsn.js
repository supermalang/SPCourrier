var getUrlParameter = function(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

/**
 * Renvoie un tableau contenant les URLs des éléments connexes de l'élément de liste donné en paramètre
 * @param {string} listId ID de la liste
 * @param {string} itemId ID de l'élément
 */
function getRelatedItems(listId, itemId){
    requestUrl = "/_api/web/lists(guid'"+listId.replace(/[{}]/g,'')+"')/items("+itemId+")/";
    relatedItems = $.Deferred();
    // Requête
    $.ajax({
        url: requestUrl,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  success: function(data) { relatedItems.resolve(data.d.RelatedItems); }});
    return relatedItems;
}

function getRelatedItemFileUrl(listId, itemId){
    requestUrl = "/_api/web/lists(guid'"+listId.replace(/[{}]/g,'')+"')/items("+itemId+")/file";
    fileReturn = $.Deferred();
    $.ajax({
        url: requestUrl,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  success: function(data) { console.log("Retourne : "+data.d.ServerRelativeUrl); fileReturn.resolve(data.d.ServerRelativeUrl); }});
    return fileReturn;
}