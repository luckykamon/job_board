
/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    $.ajax({
        url: "/employer/getById", // METHOD GET par defaut
        contentType: "application/json", // Pour préciser le type de données qui transite
        dataType: 'json',
        type: "POST",
        data: JSON.stringify({ id: id }),
        success: function (result) {
            $("#" + id).children().remove();
            API_dico_select_ligne_modifier(id, result);
        },
        error: function (err) {
            console.log("erreur: API_liste_information_cand");
        }
    })
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id, dico) {
    $.ajax({
        url: "/employer/getForForm", // METHOD GET par defaut
        contentType: "application/json", // Pour préciser le type de données qui transite
        dataType: 'json',
        success: function (result) {
            affichage_ligne_modifier(id, dico[0], result);
        },
        error: function (err) {
            console.log("erreur: API_dico_select_ligne_modifier");
        }
    })
}

function affichage_ligne_modifier(id, dico, dico_select = false) {
    afficher = "";
    afficher += `<td><select class="form-control" name="utilisateur" id="user_select_${id}">`;
    for (i = 0; i < dico_select[1].length; i++) {
        if (dico_select[1][i].user_username == dico.user_username) {
            afficher += `<option value="${dico_select[1][i].user_id}" selected>${dico_select[1][i].user_username}</option>`;
        } else {
            afficher += `<option value="${dico_select[1][i].user_id}">${dico_select[1][i].user_username}</option>`;
        }

    }
    afficher += `</select></td><td><select class="form-control" name="societe" id="societe_select_${id}">`;
    for (i = 0; i < dico_select[0].length; i++) {
        if (dico_select[0][i].societe_nom == dico.societe_nom) {
            afficher += `<option value="${dico_select[0][i].societe_id}" selected>${dico_select[0][i].societe_nom}</option>`;
        } else {
            afficher += `<option value="${dico_select[0][i].societe_id}">${dico_select[0][i].societe_nom}</option>`;
        }
    }               
    
    afficher += `</select></td>
        <td>
            <select class="form-control" name="droit_access" id="caccess_select_${id}">
                <option value="0">Employer</option>
                <option value="1">Gerant offres</option>
                <option value="2">Gerant societe</option>
            </select>
        </td>
        <td>
            <button type="button" class="btn btn-warning" onclick="boutton_envoyer('${id}')">Envoyer</button>
            <button type="button" class="btn btn-danger" onclick="boutton_annuler('${id}')">Annuler</button>
        </td>`;

    $("#" + id).append(afficher);
}

function boutton_envoyer(id) {
    let dico = {};

    dico.emploi_id = id;
    dico.user_id = $("#user_select_" + id)[0].value;
    dico.societe_id = $("#societe_select_" + id)[0].value;
    dico.emploi_access = $("#caccess_select_" + id)[0].value;
    //faire un if pour savoir si l'une des informations est vide
    callAPI_update(dico);
}

function callAPI_update(dico) {
    $.ajax({
        url: "/employer/updateAdmin",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            callAPI_getById(dico.emploi_id);
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function callAPI_getById(id) {
    $.ajax({
        url: "/employer/getById",
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

function ajouter_ligne_ById(id, element) {
    $("tr#" + id).children().remove();
    let afficher = "";

    let type_access = null;
    switch (element.emploi_access) {
        case 1:
            type_access = "Gerant offres";
            break;
        case 2:
            type_access = "Gerant societe";
            break;
        default:
            type_access = "Employer";
            break;
    }
    
    afficher += 
        `<td>${element.user_username}</th>
        <td>${element.societe_nom}</td>
        <td>${type_access}</td>
        <td>
            <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.emploi_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.emploi_id}')">Supprimer</button>
        </td>`;
    $("tr#" + id).append(afficher);
}

function boutton_supprimer(id) {
    if (confirm("Etes-vous sure de vouloir supprimer cette ligne de la base donnée ?")) {
        callAPI_remove(id);
    }
}

function callAPI_remove(id) {
    let envoyer = JSON.stringify({ emploi_id: id });

    $.ajax({
        url: "/employer/removeAdmin",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: envoyer,
        type: "post",
        success: function (result) {
            if (result == "OK") {
                $("tr#" + id).remove();
            } else {
                alert("La suppression n'as pas pu avoir lieu");
            }
        },
        error: function (err) {
            alert("La suppression n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function boutton_annuler(id) {
    callAPI_getById(id);
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

    function boutton_ajouter() {
        let dico = {};
        dico.user_id = $("#user_select")[0].value;
        dico.societe_id = $("#societe_select")[0].value;
        dico.emploi_access = $("#caccess_select")[0].value;
        
        callAPI_ajout(dico);
    }

    function callAPI_ajout(dico) {
        $.ajax({
            url: "/employer/addAdmin",
            contentType: "application/json",
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                $(".liste_information").remove();
                API_liste_information_employers();
                $(".deletable").children().remove();
                API_liste_information_users();
                API_liste_information_societe();
            },
            error: function (err) {
                alert("L'ajout n'as pas pu avoir lieu");
                console.log(err);
            }
        });
    }



    /*
    API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
    */
    function API_liste_information_employers() {
        $.ajax({
            url: "/employer", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information_cand");
            }
        })
    }

    /*
Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
Ajoute la ligne correspondant à l'ajout d'une donnée.
*/
    function affichage_liste_informations(liste_informations) {
        liste_informations.forEach(element => {
            let type_access = null;
            switch (element.emploi_access) {
                case 1:
                    type_access = "Gerant offres";
                    break;
                case 2:
                    type_access = "Gerant societe";
                    break;
                default:
                    type_access = "Employer";
                    break;
            }

            $(".table").append(
                `<tr id="${element.emploi_id}" class="liste_information">
                    <td>${element.user_username}</th>
                    <td>${element.societe_nom}</td>
                    <td>${type_access}</td>
                    <td>
                        <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.emploi_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.emploi_id}')">Supprimer</button>
                    </td>
                </tr>`
            );
        });
    }

    /*
    API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
    */
    function API_liste_information_users() {
        $.ajax({
            url: "/users", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations_user(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information_users");
            }
        })
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations_user(liste_informations) {
        liste_informations.forEach(element => {
            $("#user_select").append (
                `<option value="${element.user_id}">${element.user_username}</option>`
            );
        });
    }

    /*
API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
*/
    function API_liste_information_societe() {
        $.ajax({
            url: "/societe", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations_societe(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information_offre");
            }
        })
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations_societe(liste_informations) {
        liste_informations.forEach(element => {
            $("#societe_select").append (
                `<option value="${element.societe_id}">${element.societe_nom}</option>`
            );
        });
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

    function init() {

        verifIsAdmin();

        API_liste_information_users();
        API_liste_information_societe();
        API_liste_information_employers();

        verifIsConnected();

        $("#logout").click(function () { deconnexion(); });

        $("#boutton_ajouter").click(function () {
            boutton_ajouter();
        })
    }
})(window, document);