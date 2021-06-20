
function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);
    return (results !== null) ? results[1] || 0 : false;
}

/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    $("#" + id).children().remove();
    API_dico_select_ligne_modifier(id);
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id) {
    $.ajax({
        url: "/employerBis/getEmployersForSocieteById",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "post",
        data: JSON.stringify({ societe_id: urlParam("societe"), emploi_id: id }),
        success: function (result) {
            affichage_ligne_modifier(id, result);
        },
        error: function (err) {
            console.log("Erreur: API_liste_information()");
            console.log(err);
        }
    });
}

function affichage_ligne_modifier(id, liste_informations) {
    let afficher;
    liste_informations.forEach(element => {
        afficher = ``;
        afficher += `
            <td>${element.user_username}</td>
            <td>${element.user_nom}</td>
            <td>${element.user_prenom}</td>
            <td>
            <select class="form-control" name="emploi_access" id="emploi_access_select_${element.emploi_id}">
            `
        if (element.emploi_access == 0) {
            afficher += `
            <option value="0" selected>Employer</option>
            <option value="1">Gérant des offres</option>
            <option value="2">Gérant de société</option>
            `;
        } else if (element.emploi_access == 1) {
            afficher += `
            <option value="0">Employer</option>
            <option value="1" selected>Gérant des offres</option>
            <option value="2">Gérant de société</option>
            `;
        } else {
            afficher += `
            <option value="0">Employer</option>
            <option value="1">Gérant des offres</option>
            <option value="2" selected>Gérant de société</option>
            `;
        }
        afficher += `
        </select>
        </td>
        <td>
        <button type="button" class="btn btn-warning" onclick="boutton_envoyer('${id}')">Envoyer</button>
        <button type="button" class="btn btn-danger" onclick="boutton_annuler('${id}')">Annuler</button>
        </td>`;
        $("tr#" + id).append(afficher);
    }
    );
}

function boutton_envoyer(id) {
    let dico = {};
    dico.emploi_id = id;
    dico.emploi_access = $("#emploi_access_select_" + id)[0].value;
    dico.societe_id = urlParam("societe");
    callAPI_update(dico, "compe");
}

function callAPI_update(dico) {
    $.ajax({
        url: "/employerBis/updateEmploiAcces",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            if (result == "NOK") {
                console.log("Il faut qu'il reste au minimum un gérant de société");
            } else {
                mise_a_jour_ligne(dico);
            }
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function mise_a_jour_ligne(dico) {
    API_annuler(dico.emploi_id);
}

function callAPI_getById(id) {
    $.ajax({
        url: "/compe/getById",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify({ id: id }),
        dataType: 'json',
        type: "post",
        success: function (result) {
            //TODO actualiser les informations
            ajouter_ligne_ById(id, result[0]);
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function boutton_supprimer(id) {
    if (confirm("Etes-vous sure de vouloir retirer cet employer ?")) {
        callAPI_remove(id);
    }
}

function callAPI_remove(id) {
    let envoyer;
    envoyer = JSON.stringify({ emploi_id: id, societe_id: urlParam("societe")});

    $.ajax({
        url: "/employerBis/remove",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: envoyer,
        type: "post",
        success: function (result) {
            $("tr#" + id).remove();
        },
        error: function (err) {
            alert("La suppression n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function boutton_annuler(id) {

    API_annuler(id);
}

function API_annuler(id) {
    $.ajax({
        url: "/employerBis/getEmployersForSocieteById",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "post",
        data: JSON.stringify({ societe_id: urlParam("societe"), emploi_id: id }),
        success: function (result) {
            affichage_ligne_annuler(id, result);
        },
        error: function (err) {
            console.log("Erreur: API_liste_information()");
            console.log(err);
        }
    });
}

function affichage_ligne_annuler(id, liste_informations) {
    let afficher;
    $("#" + id).children().remove();
    liste_informations.forEach(element => {
        afficher = ``;
        afficher += `
            <td>${element.user_username}</td>
            <td>${element.user_nom}</td>
            <td>${element.user_prenom}</td>
            `
        if (element.emploi_access == 0) {
            afficher += `
            <td>Employer</td>
            `;
        } else if (element.emploi_access == 1) {
            afficher += `
            <td>Gérant des offres</td>
            `;
        } else {
            afficher += `
            <td>Gérant de société</td>
            `;
        }
        afficher += `
        <td>
        <button type="button" class="btn btn-warning" onclick="boutton_modifier(${id})">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer(${id})">Retirer</button>
        </td>`;
        $("tr#" + id).append(afficher);
    }
    );
}

function boutton_ajouter() {
    let dico = {"user_id" : $("#nom_utilisateur_select_ajout")[0].value, "societe_id": urlParam("societe"), "emploi_access": $("#emploi_access_select_ajout")[0].value};
    $.ajax({
        url: "/employer/add",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "post",
        data: JSON.stringify(dico),
        success: function (result) {
            document.location.reload()
        },
        error: function (err) {
            console.log("Erreur: API_liste_information()");
            console.log(err);
        }
    });
}

(function (window, document) {
    window.onload = init;

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

                    verifIsAdminBis();
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

    function verifIsAdminBis() {
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
            contentType: "application/json",
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

    /*
    API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
    */
    function API_liste_information() {
        $.ajax({
            url: "/employer/getEmployersForSociete",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "post",
            data: JSON.stringify({ societe_id: urlParam("societe") }),
            success: function (result) {
                affichage_liste_informations(result);
            },
            error: function (err) {
                console.log("Erreur: API_liste_information()");
                console.log(err);
            }
        });
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations(liste_informations) {
        let afficher;
        liste_informations.forEach(element => {
            afficher = ``;
            afficher += `
            <tbody class="liste_information">
              <tr id="${element.emploi_id}">
                <td>${element.user_username}</td>
                <td>${element.user_nom}</td>
                <td>${element.user_prenom}</td>
                `
            if (element.emploi_access == 0) {
                afficher += `<td>Employer</td>`;
            } else if (element.emploi_access == 1) {
                afficher += `<td>Gérant des offres</td>`;
            } else {
                afficher += `<td>Gérant de société</td>`;
            }
            afficher += `
                <td>
                  <button type="button" class="btn btn-warning" onclick="boutton_modifier(${element.emploi_id})">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer(${element.emploi_id})">Retirer</button>
                </td>
              </tr>
            </tbody>`;
            $(".table").append(afficher);
        }
        );
    }

    function verifIsAdmin() {
        $.ajax({
            url: "/users/isAdmin",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result != "OK") {
                    document.location.href = "/index.html";
                }
            },
            error: function (err) {
                alert("Erreur: connexion1()");
                console.log(err);
            }
        });
    }

    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }

    function verifIsAdminForOffre() {
        $.ajax({
            url: "/employer/isAdminForOffre",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "post",
            data: JSON.stringify({ societe_id: urlParam("societe") }),
            success: function (result) {
                if (result != "OK") {
                    document.location.href = "/index.html";
                }
            },
            error: function (err) {
                alert("Erreur: connexion1()");
                console.log(err);
            }
        });
    }

    function remplissage_select_username() {
        $.ajax({
            url: "/users/",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                result.forEach(element => {
                    $("#nom_utilisateur_select_ajout").append (
                        `<option value="${element.user_id}">${element.user_username}</option>`
                    );
                });
            },
            error: function (err) {
                alert("Erreur: remplissage_select_username()");
                console.log(err);
            }
        });
    }

    function init() {
        verifIsAdminForOffre();
        verifIsAdmin();
        verifIsConnected();

        $("#logout").click(function () { deconnexion(); });

        API_liste_information();

        if (urlParam("societe") == false) {
            document.location.href = "/index.html";
        }

        remplissage_select_username();
    }
})(window, document);