/**
 * Organise le placement des champs des formulaires de courrier dans le formulaire courrierForm.html
 */
function moveCourrierFields(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);

        $("table.ms-formtable td").each(function(){
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                $(this).contents().appendTo(elem);
            }
            if(this.innerHTML.indexOf('FieldInternalName="FileLeafRef"') != -1){
                var urlFichierCourrier = $(this).find("[rel=sp_DialogLinkNavigate]").attr("href");
                
                if(urlFichierCourrier==null){
                    urlFichierCourrier = "/DropOffLibrary/" + $(this).find("input[id*=FileLeafRef]").val() + $(this).find("input[id*=FileLeafRef] + .ms-fileField-fileExt").html();
                }

                $('.ibsn-courrier-file').attr('src',urlFichierCourrier);
            }
            if(this.innerHTML.indexOf('ContentTypeChoice') != -1){
                $(this).contents().appendTo("span[data-internal-name='ContentTypeChoice']");
            }
        });

        /**
         * Si le champ du formulaire n'est pas utilisé, on le cache
         */
        if (elem.is(':empty')){
            elem.parent().hide();
        }

        /**
         * On cache les autres éléments de la page retournés par défaut par SharePoint
         */
        $("table.ms-formtable").hide();
        $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
        $("table.ms-formtable + table").hide();
        $(".ms-recommendations-panel").hide();
    });
};
_spBodyOnLoadFunctionNames.push("moveCourrierFields");

