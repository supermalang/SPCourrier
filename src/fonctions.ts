import * as $ from "jquery"

export default class fonctions {
    /** Boîte de dialogue */
    private modalBox = null;  
    
    /**
     * Récupère la valeur d'un paramètre de l'URL
     * @param {string} sParam paramètre dont on veut récupérer la valeur
     */
    getUrlParameter(sParam) {
        let sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

    /**
     * Permet de sélecionner un type de contenu par défaut, dans un EditForm
     * @param {string} contentTypeID le GUID du type de contenu qu'on veut sélectionner par défaut
     */
    autoselectContentType(contentTypeID){
        /** URL Absolue de la page */
        let pagePath = location.href;
        /** On enlève de l'URL le paramètre 'TypeDeContenu=....' , sinon la page va se recharger indéfiniment */
        pagePath = pagePath.replace(/(TypeDeContenu=).*?(&)/,'$1' + '' + '$2');
        pagePath = pagePath.replace('&TypeDeContenu=', '');
        /** Selection du type de contenu par défaut */
        //window.location = pagePath+"&ContentTypeId="+contentTypeID;

        /** Selection du type de contenu par défaut (En jQuery) */
        //$("[data-internal-name='ContentTypeChoice'] select option[value*='"+contentTypeID.replace(/[{}']/g,'')+"']").attr('selected','selected').change();
    }

    /**
     * Affiche une prévisualisation d'un fichier image ou PDF à l'emplacement DOM donné
     * @param {string} url URL du fichier à affiche 
     * @param {string} displayLocation emplacement d'affichage du fichier
     * @param {string} errorMessage Message d'erreur à afficher en cas d'impossibilité d'affichier le fichier
     */
    displayFile(url:string, displayLocation:string, errorMessage?:string) {
        /** Extension du courrier */
        let extension = url.substr( (url.lastIndexOf('.') +1) );
        /** Seuls les images et les fichiers PDF seront prévisualisés */
        let imageExtensions = ["JPEG", "JPG", "PNG"];
        let pdfExtensions = ["PDF"];
        /** Emplacement de prévisualisation du courrier */
        let previewerpanel = $(displayLocation);
        /** Si le fichier connexe (le courrier scanné) est une image, on affiche une image */
        if($.inArray(extension.toUpperCase(), imageExtensions) >= 0) {
            previewerpanel.html('<img src="'+url+'"/>');
        }
        /** Si le fichier connexe (le courrier scanné) est un PDF, on affiche un iframe */
        else if($.inArray(extension.toUpperCase(), pdfExtensions) >= 0) {
            previewerpanel.html('<iframe src="'+url+'" allowfullscreen allowtransparency="true" frameborder="0" ></iframe>');
        }
        /** Si le fichier connexe n'est ni une image, ni un PDF, on affiche un message */
        else{
            errorMessage = errorMessage.length < 1 ? errorMessage : "<p>Le type de fichier uploadé ne peut être prévisualisé</p>";
            previewerpanel.html(errorMessage);
        }
    }

    /**
     * Renvoie le contentTypeID (GUID) d'un type de contenu dont le nom est donné. Fonction asynchrone
     * @param {string} ctName Nom du type de contenu
     */
    getContentTypeID(ctName) {
        /** Le GUID du contentType retourné. Variable Asynchrone */
        var contentTypeID = $.Deferred();
        /** Requête Ajax */  
        var filter        = "Name eq '"+ctName+"'";
        $.ajax({
            url: "_api/web/AvailableContentTypes?$select=Name,StringId&$filter="+filter,
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
     * Démarre le workflow
     * @param {string} messageAttente le message à afficher dans la boîte de dialogue
     * @param {any} subscriptionId l'ID de subcription du workflow : Le Subscription Service gère toutes les associations de workflow
     * @param {number?} itemId élément de liste sur lequel on démarre le workflow. Si cette variable est vide, SharePoint va lancer le WF en tant que WF de site
     */
    StartWorkflow(messageAttente:string, subscriptionId:any, itemId?:number) {
        this.showInProgressDialog(messageAttente);
        /** Contexte actif de SharePoint */
        var ctx = SP.ClientContext.get_current();
        /** Workflow Service Manager : Récupère tous les WF d'un site */
        var wfManager = SP.WorkflowServices.WorkflowServicesManager.newObject(ctx, ctx.get_web());
        /** Workflow Subscription Service : Gère toutes les associations de workflow  */
        var subscription = wfManager.getWorkflowSubscriptionService().getSubscription(subscriptionId);
        
        ctx.load(subscription, 'PropertyDefinitions');
        /** Exécution de la requête de chargement du workflow */
        ctx.executeQueryAsync(
            function (sender, args) { // On success : Chargement du workflow
                var params= new Object();
                /** Paramètres à passer au workflow lors de son démarrage*/
                var formData = subscription.get_propertyDefinitions()["FormData"];
                /** S'il y a des paramètres à passer au workflow */
                if (formData != null && formData != 'undefined' && formData != "") {
                    var assocParams = formData.split(";#");
                    for (var i = 0; i < assocParams.length; i++) {
                        params[assocParams[i]] = subscription.get_propertyDefinitions()[assocParams[i]];
                    }
                }
                /** Si 'itemId' est défini, on lance le WF sur l'élément */
                if (itemId) {
                    wfManager.getWorkflowInstanceService().startWorkflowOnListItem(subscription, itemId, params);
                }
                /** Sinon, on lance le WF en tant que WF de site */
                else {
                    wfManager.getWorkflowInstanceService().startWorkflow(subscription, params);
                }
                /** Exécution de la requête de démarrage du workflow */
                ctx.executeQueryAsync(
                    function (sender, args) { this.closeInProgressDialog(); },// On Success
                    function (sender, args) { this.closeInProgressDialog(); alert('Echec du démarrage du flux de travail'); } // On Fail
                );
            },
            function (sender, args) { this.closeInProgressDialog(); alert('Echec du démarrage du flux de travail'); } // On Fail : Chargement du workflow
        );
    }
    /** Ferme la boîte de dialogue */
    closeInProgressDialog(){ if (this.modalBox != null) { this.modalBox.close(); } }
    
    /** Affiche une boîte de dialogue */
    showInProgressDialog(message) {
        if (this.modalBox == null) {
            this.modalBox = SP.UI.ModalDialog.showWaitScreenWithNoClose(message, "Test", null, null);
        }
    }
}