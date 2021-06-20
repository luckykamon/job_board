
(function (window, document) {
    window.onload = init;


    function affichage(tab0) {
        for (let offre of tab0) {
            $("ul#liste_offres").append("<li><div class=\"card\"><div class=\"card\"><div class=\"row align-items-center\"><div class=\"col-md-4 text-center\"><h3>" + offre.offre_titre + "</h3></div><div class=\"col-md-6\"><p class=\"text-justify\">" + offre.offre_description.substr(0, 100) + "...</p></div><div class=\"col-md-2 text-right\"><div class=\"container\"><button id=\"button_" + offre.offre_id + "\" class=\"button_annonce btn btn-primary\" onclick=\"cc(this)\">En savoir plus</button></div></div></div></div></div><br></li>");
        }
    }

    function callAPI() {
        // Fonction ajax qui execute notre requete HTTP
        $.ajax({
            url: "/offres", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) { // fonction callback en cas de requete reussie
                affichage(result);
            },
            error: function (err) { // fonction callback en cas de requete echouée
                console.log(err)
            }
        })
    }

    function show(params) {
        if ($(params).hasClass("hide")) {
            $(params).removeClass("hide");
        }
    }

    function hide(params) {
        if (!$(params).hasClass("hide")) {
            $(params).addClass("hide");
        }
    }

    function verifIsConnected() {
        $.ajax({
            url: "/users/isConnected",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    hide("#login");
                    show("#logout");
                    show(".isConnected");

                    verifIsAdmin();
                    verifIsInSociete();
                } else {
                    hide("#logout");
                    hide(".isConnected");
                    show("#login");
                }
            },
            error: function (err) {
                alert("Erreur: connexion1()");
                console.log(err);
            }
        });
    }

    function verifIsInSociete() {
        $.ajax({
            url: "/employer/isEmployer",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    show(".isInSociete");
                } else {
                    hide(".isInSociete");
                }
            },
            error: function (err) {
                alert("Erreur: connexion1()");
                console.log(err);
            }
        });
    }

    function verifIsAdmin() {
        $.ajax({
            url: "/users/isAdmin",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    show(".isAdmin");
                } else {
                    hide(".isAdmin");
                }
            },
            error: function (err) {
                alert("Erreur: connexion1()");
                console.log(err);
            }
        });
    }

    function deconnexion() {
        $.ajax({
            url: "/users/deconnexion",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    document.location.href = "/index.html";
                }
            },
            error: function (err) {
                alert("Erreur: connexion2()");
                console.log(err);
            }
        });
    }

    function init() {
        verifIsConnected();
        $("#logout").click(function () { deconnexion(); });

        callAPI();
    }
})(window, document);

function apply(offre_id) {
    $.ajax({
        url: "/users/isConnected",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "get",
        success: function (result) {
            if (result == "NOK") {
                document.location.href = "/views/connexion.html?offre_id=" + offre_id; //TODO: Faire la page formulaire
            } else {
                document.location.href = "/views/formulaire_for_user.html?offre_id=" + offre_id;
            }
        },
        error: function (err) {
            alert("Erreur: connexion3()");
            console.log(err);
        }
    });
}

function cc(id_button) {
    function execButton(tab0, input) {
        let idBis = input.attr("id");
        let id = idBis.substr(7);
        if ($("#informations_" + id).get(0) == undefined) {
            div = $(input).parent().parent().parent().parent();
            //On met dans la variable tab le tableau qui a un offre_id egal à id
            let choix_tab = 0;
            for (let tab of tab0) {
                if (tab.offre_id == id) {
                    break;
                }
                choix_tab++;
            }
            let tab = tab0[choix_tab];

            let description = tab.offre_description;
            let salaire = tab.offre_salaire;
            let lieu = tab.offre_lieu;
            let nomSociete = tab.societe_nom;
            let typeOffre = tab.type_nom;
            div.after("<div class='container align-items-center' id=\"informations_" + id + "\"><br><p class='text-justify'>Description: " + description + "</p><p class='text-justify'>Salaire: " + salaire + "€</p><p class='text-justify'>Lieu: " + lieu + "</p><p class='text-justify'>Type de contrat: " + typeOffre + "</p><p class='text-justify'>Societe: " + nomSociete + "</p><button class=\"btn btn-primary\" id=\"button_apply_" + id + "\" onclick=\"apply(" + id + ")\">Apply</button><br><br></div>");
        } else {
            $("#informations_" + id).remove();
        }
    }

    function callAPI(input) {
        // Fonction ajax qui execute notre requete HTTP
        $.ajax({
            url: "/offres", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) { // fonction callback en cas de requete reussie
                execButton(result, input);
            },
            error: function (err) { // fonction callback en cas de requete echouée
                console.log(err)
            }
        })
    }

    callAPI($(id_button));
}
