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

/**
 * Renvoie le contentTypeID (GUID) d'un type de contenu dont le nom est donné. Fonction asynchrone
 * @param {string} ctName Nom du type de contenu
 */
function getContentTypeID(ctName) {
    /** Le GUID du contentType retourné. Variable Asynchrone */
    var contentTypeID = $.Deferred();
    /** Requête Ajax */  
    var filter        = "Name eq '"+ctName+"'";
    $.ajax({
        url: "/_api/web/AvailableContentTypes?$select=Name,StringId&$filter="+filter,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },
        success: function(data) { contentTypeID.resolve(data.d.results[0].StringId); }
    });
    return contentTypeID;
};

/**
 * Permet de sélecionner un type de contenu par défaut, dans un EditForm
 * @param {string} contentTypeID le GUID du type de contenu qu'on veut sélectionner par défaut
 */
function autoselectContentType(contentTypeID){
    /** URL Absolue de la page */
    pagePath = location.href;
    /** On enlève de l'URL le paramètre 'TypeDeContenu=....' , sinon la page va se recharger indéfiniment */
    pagePath = pagePath.replace(/(TypeDeContenu=).*?(&)/,'$1' + '' + '$2');
    pagePath = pagePath.replace('&TypeDeContenu=', '');
    /** Selection du type de contenu par défaut */
    window.location = pagePath+"&ContentTypeId="+contentTypeID;

    /** Selection du type de contenu par défaut (En jQuery) */
    //$("[data-internal-name='ContentTypeChoice'] select option[value*='"+contentTypeID.replace(/[{}']/g,'')+"']").attr('selected','selected').change();
}

/**
 * Récupère le nombre d'éléments d'une liste ou d'une bibliothèque
 * @param {string} list le nom de la liste dont on veut compter les éléments
 * @param {string} filter le filtre à appliquer sur la requête
 */
function countListItems(list, filter=''){
    var nbItems = $.Deferred(); var _filter = '';
    if(filter.length > 0){ _filter = "?$filter="+filter; }

    $.ajax({
        url: "/_api/web/lists/GetByTitle('"+list+"')/items"+_filter,
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Accept', 'Application/json;odata=verbose');
            xhr.setRequestHeader('Content-Type', 'Application/json;odata=verbose');
        },  
        success: function(data){ nbItems.resolve(data.d.results.length); }, 
        error: function(XMLHttpRequest, textStatus, errorThrown){console.log("Statut: " + textStatus); console.log("Erreur: " + errorThrown); }
    });
    return nbItems;
}