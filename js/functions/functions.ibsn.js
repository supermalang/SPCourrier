/**
 * Récupère la valeur d'un paramètre de l'URL
 * @param {string} sParam paramètre dont on veut récupérer la valeur
 */
function getUrlParameter(sParam) {
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
 * Renvoie un tableau contenant les éléments connexes de l'élément de liste donné en paramètre
 * @param {string} listId GUID de la liste
 * @param {string} itemId ID de l'élément
 */
function getRelatedItems(listId, itemId){
    relatedItems = $.Deferred();
    /** Requête Ajax */
    requestUrl = "/_api/web/lists(guid'"+listId.replace(/[{}]/g,'')+"')/items("+itemId+")/";
    $.ajax({
        url: requestUrl,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  success: function(data) { relatedItems.resolve(data.d.RelatedItems); }});
    return relatedItems;
}

/**
 * Renvoie l'URL d'un élément connexe
 * @param {string} listId GUID de la liste de l'élément connexe
 * @param {number} itemId ID de l'élément connexe
 */
function getRelatedItemFileUrl(listId, itemId){
    fileReturn = $.Deferred();
    /** Requete AJAX */
    requestUrl = "/_api/web/lists(guid'"+listId.replace(/[{}]/g,'')+"')/items("+itemId+")/file";
    $.ajax({
        url: requestUrl,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  success: function(data) { fileReturn.resolve(data.d.ServerRelativeUrl); }});
    return fileReturn;
}

/**
 * Renvoie l'ID du propriétaire d'un élément
 * @param {string} listID GUID de la liste de l'élément dont on veut récupérer l'ID du propriétaire
 * @param {number} itemID ID de l'élément dont on veut récupérer l'ID du propriétaire
 */
function getItemOwnerID(listID, itemID) {
    ownerID = $.Deferred();
    /** Requete AJAX */
    requestUrl = "/_api/web/lists(guid'"+listID.replace(/[{}]/g,'')+"')/items("+itemID+")/";
    $.ajax({
        url: requestUrl,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  success: function(data) { ownerID.resolve(data.d.AuthorId); }});
    return ownerID;
}