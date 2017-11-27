/**
 * Organise le placement des champs des formulaires de tâche de courrier reçu dans le formulaire tacheCourrierRecu.form.html
 */
function moveCourrierRecuTaskFields(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);
        elemLabel = elem.prev('h3');

        $("table.ms-formtable td").each(function(){
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                if(internalName!="RelatedItems"){
                    $(this).prev().contents().appendTo(elemLabel);
                    $(this).contents().appendTo(elem);
                }

                /** Si le champ est le champ du fichier de scanné, on l'ajoute dans le panneau de prévisualisation */
                else{
                    var urlFichierCourrier ="/CourrierRecu/DD%20CF%20D_NC_2011_06_01-27-image.jpeg" //$(".ms-relateditems-title").find("a").attr("href");

                    /** On vérifie l'extension du fichier */
                    try {
                        var extension = urlFichierCourrier.substr( (urlFichierCourrier.lastIndexOf('.') +1) );
                    } catch (error) {
                        console.log("Erreur : "+error);
                    }

                    /** On accepte d'afficher seulement les fichiers PDF et les Images */
                    var imageExtensions = ["JPEG", "JPG", "PNG"];
                    var pdfExtensions = ["PDF"];

                    /** Si le fichier du courrier est une image, on affiche une image */
                    if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
                        elem.html('<img src="'+urlFichierCourrier+'"/>');
                    }
                    /** Si le fichier du courrier est un PDF, on affiche un iframe */
                    else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
                        elem.html('<iframe src="'+urlFichierCourrier+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
                    }
                    else{
                        /** Sinon */
                        elem.html("<p>Le type de fichier uploadé ne peut être prévisualisé</p>");
                    }
                }
            }
        });

        $("table.ms-formtable + table").first().find("td.ms-toolbar[width='99%']").nextAll().appendTo($(".ibsn-task-outcome-editform"));
        $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
        
        /**
         * On cache les autres éléments de la page retournés par défaut par SharePoint
         */
        $("table.ms-formtable").hide();
        $("table.ms-formtable + table").hide();
        $(".ms-recommendations-panel").hide();
    });
};
_spBodyOnLoadFunctionNames.push("moveCourrierRecuTaskFields");