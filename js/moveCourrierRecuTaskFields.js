/**
 * Organise le placement des champs des formulaires de tâche de courrier reçu dans le formulaire tacheCourrierRecu.form.html
 */
function moveCourrierRecuTaskFields(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);
        elemLabel = elem.prev('h3');

        /** Parcourt les champs du formulaire par défaut présenté par SharePoint */
        $("table.ms-formtable td").each(function(){
            /** On déplace chaque champ par défaut vers son emplacement sur le template personnalisé */
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                /** Pour les champs de tâche de courrier */
                if(internalName!="RelatedItems"){
                    $(this).prev().contents().appendTo(elemLabel);
                    $(this).contents().appendTo(elem);
                }

                /** On prévisualise l'élément connexe */
                else{
                    var urlFichierCourrier = $(".ms-relateditems-title").find("a:first").attr("href");
                    console.log(urlFichierCourrier);

                    /** On vérifie l'extension du fichier */
                    try {
                        var extension = urlFichierCourrier.substr( (urlFichierCourrier.lastIndexOf('.') +1) );
                        
                        /** Seuls les images et les fichiers PDF seront prévisualisés */
                        var imageExtensions = ["JPEG", "JPG", "PNG"];
                        var pdfExtensions = ["PDF"];
                        
                        /** Si le fichier connexe (le courrier scanné) est une image, on affiche une image */
                        if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
                            elem.html('<img src="'+urlFichierCourrier+'"/>');
                        }
                        /** Si le fichier connexe (le courrier scanné) est un PDF, on affiche un iframe */
                        else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
                            elem.html('<iframe src="'+urlFichierCourrier+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
                        }
                        /** Si le fichier connexe n'est ni une image, ni un PDF, on affiche un message */
                        else{
                            /** Sinon */
                            elem.html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
                        }
                    } catch (error) {
                        console.log("Erreur : "+error);
                    }
                }
            }
        });
    });

    /** On déplace les boutons d'action vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-task-outcome-editform"));
    /** On déplace les information de système SharePoint vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
    
    /**
     * On cache les autres éléments de la page retournés par défaut par SharePoint
     */
    $("table.ms-formtable").hide();
    $("table.ms-formtable + table").hide();
    $(".ms-recommendations-panel").hide();
};

/** Document ready */
$(function(){
    ExecuteOrDelayUntilScriptLoaded(moveCourrierRecuTaskFields, "sp.js");
});