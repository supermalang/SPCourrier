/**
 * Organise le placement des champs des formulaires de courrier dans le formulaire courrierForm.html
 */
function moveCourrierFields(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);
        elemLabel = elem.prev('.ibsn-standardheader');

        /** Parcourt les champs du formulaire par défaut présenté par SharePoint */
        $("table.ms-formtable td").each(function(){
            /** Pour les champs de courrier simple */
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                $(this).prev().contents().appendTo(elemLabel);
                $(this).contents().appendTo(elem);
            }

            /** Si le champ est le champ du fichier de scanné, on l'ajoute dans le panneau de prévisualisation */
            else if(this.innerHTML.indexOf('FieldInternalName="FileLeafRef"') != -1){
                var urlFichierCourrier = $(this).find("[rel=sp_DialogLinkNavigate]").attr("href");

                /** Si on est dans la boîte de dépot, on construit l'URL du fichier */
                if(urlFichierCourrier==null){
                    urlFichierCourrier = "/DropOffLibrary/" + $(this).find("input[id*=FileLeafRef]").val() + $(this).find("input[id*=FileLeafRef] + .ms-fileField-fileExt").html();
                }

                /** On vérifie l'extension du fichier */
                var extension = urlFichierCourrier.substr( (urlFichierCourrier.lastIndexOf('.') +1) );

                /** On accepte d'afficher seulement les fichiers PDF et les Images */
                var imageExtensions = ["JPEG", "JPG", "PNG"];
                var pdfExtensions = ["PDF"];

                /** Si le fichier du courrier est une image, on affiche une image */
                if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
                    $(".ibsn-file-previewer").html('<img class="ibsn-courrier-file" src="'+urlFichierCourrier+'"/>');
                }
                /** Si le fichier du courrier est un PDF, on affiche un iframe */
                else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
                    $(".ibsn-file-previewer").html('<iframe class="ibsn-courrier-file" src="'+urlFichierCourrier+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
                }
                else{
                    /** Sinon */
                    $(".ibsn-file-previewer").html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
                }
            }

            /** Pour le champ qui permet de sélectionner le type de courrier (Dans la boîte de dépôt ) */
            else if(this.innerHTML.indexOf('ContentTypeChoice') != -1){
                $(".ibsn-file-previewer").css("width", "58%");
                $(".ibsn-courrier-metadata").css("width", "41%");
                $(this).contents().appendTo("span[data-internal-name='ContentTypeChoice']");

                /** On en profite pour cacher cet élément */
                $("table.ms-formtoolbar").parent().hide();
            }
        });

        /**
         * Si le champ du formulaire n'est pas utilisé, on le cache
         * Ex : Certains champs de courriers reçu ne sont pas utilisés dans le courrier envoyé
         */
        if (elem.is(':empty')){
            elem.parent().hide();
        }
    });

    /** On déplace les boutons d'action vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-field-actionbuttons"));
    $("table.ms-formtoolbar").eq(1).find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-field-actionbuttons"));
    /** On déplace les information de système SharePoint vers leur emplacement de destination sur le template */
    $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
    $("table.ms-formtoolbar").eq(1).contents().appendTo($(".ibsn-system-data"));
    
    /**
     * On cache les autres éléments de la page retournés par défaut par SharePoint
     */
    $("table.ms-formtable").hide();
    $("table.ms-formtable + table").hide();
    $(".ms-recommendations-panel").hide();
    $(".ms-formline").hide();

    /** Si on ne se trouve pas dans la page de répertoire de dépôt */
    if(!location.pathname.substring(1).includes("DropOffLibrary")){
        $(".ibsn-system-data > tbody:nth-child(2)").hide();
    }
};

/** Document ready */
$(function(){
    ExecuteOrDelayUntilScriptLoaded(moveCourrierFields, "sp.js");
});