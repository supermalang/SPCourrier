/**
 * Ce script, associé au formulaire html courrierForm, permet de mettre en forme les formulaires de gestion de courrier
 */

$(document).ready(function(){
    $(".ibsn-field-value").each(function(){
        internalName = $(this).attr("data-internal-name");
        elem = $(this);

        $("table.ms-formtable td").each(function(){
            if(this.innerHTML.indexOf('FieldInternalName="'+internalName+'"') != -1 ){
                $(this).contents().appendTo(elem);
            }
            if(this.innerHTML.indexOf('FieldInternalName="FileLeafRef"') != -1){
                urlFichierCourrier = $(this).find("[rel=sp_DialogLinkNavigate]").attr("href");
                $('.ibsn-courrier-file').attr('src',urlFichierCourrier);
            }
            if(this.innerHTML.indexOf('ContentTypeChoice') != -1){
                $(this).contents().appendTo("span[data-internal-name='ContentTypeChoice']");
            }
        });

        if (elem.is(':empty')){
            elem.parent().hide();
        }

        $("table.ms-formtable").hide();
        $("table.ms-formtable + table").first().contents().appendTo($(".ibsn-system-data"));
        $("table.ms-formtable + table").hide();
        $(".ms-recommendations-panel").hide();
    });
});