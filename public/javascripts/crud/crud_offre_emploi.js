
/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    let dico = {};
    dico.offre_titre = $("#" + id).children()[0].textContent.trim();
    dico.offre_salaire = $("#" + id).children()[1].textContent.trim();
    dico.offre_lieu = $("#" + id).children()[2].textContent.trim();
    dico.offre_description = $("#" + id).children()[3].textContent.trim();
    dico.societe_nom = $("#" + id).children()[4].textContent.trim();
    dico.type_nom = $("#" + id).children()[5].textContent.trim(); $("#" + id).children().remove();
    API_dico_select_ligne_modifier(id, dico);
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id, dico) {
    $.ajax({
        url: "/offres/getForForm", // METHOD GET par defaut
        contentType: "application/json", // Pour préciser le type de données qui transite
        dataType: 'json',
        success: function (result) {
            affichage_ligne_modifier(id, dico, result);
        },
        error: function (err) {
            console.log("erreur: API_dico_select_ligne_modifier");
        }
    })
}

function affichage_ligne_modifier(id, dico, dico_select = false) {
    afficher = "";
    afficher += `
    <td>
        <input class="form-control" type="text" id="offre_titre_input_${id}" value="${dico.offre_titre}">
      </td>
      <td>
      <input class="form-control" type="number" id="offre_salaire_input_${id}" value="${dico.offre_salaire}">
      </td>
      <td>
      <input class="form-control" type="text" id="offre_lieu_input_${id}" value="${dico.offre_lieu}">
      </td>
      <td>
        <textarea class="form-control" name="offre_description_textarea" id="offre_description_textarea_${id}">${dico.offre_description}</textarea>
      </td>
      <td>
      <select class="form-control" name="societe_nom" id="societe_nom_select_${id}">`;
    for (i = 0; i < dico_select[1].length; i++) {
        if (dico_select[1][i].societe_nom == dico.societe_nom) {
            afficher += `
        <option value="${dico_select[1][i].societe_id}" selected>${dico_select[1][i].societe_nom}</option>
        `;
        } else {
            afficher += `
        <option value="${dico_select[1][i].societe_id}">${dico_select[1][i].societe_nom}</option>
        `;
        }

    }
    afficher += `
      </select>
      </td>
      <td>
      <select class="form-control" name="type_nom" id="type_nom_select_${id}">`;
    for (i = 0; i < dico_select[0].length; i++) {
        if (dico_select[0][i].type_nom == dico.type_nom) {
            afficher += `
        <option value="${dico_select[0][i].type_id}" selected>${dico_select[0][i].type_nom}</option>
        `;
        } else {
            afficher += `
        <option value="${dico_select[0][i].type_id}">${dico_select[0][i].type_nom}</option>
        `;
        }

    }
    afficher += `
      </select>
      </td>
      <td>
      <button type="button" class="btn btn-warning" onclick="boutton_envoyer('${id}')">Envoyer</button>
      <button type="button" class="btn btn-danger" onclick="boutton_annuler('${id}')">Annuler</button>
    </td>
    `;
    $("#" + id).append(afficher);
}

function boutton_envoyer(id) {
    let dico = {};
    dico.offre_id = id;
    dico.offre_titre = $("#offre_titre_input_" + id)[0].value;
    dico.offre_salaire = $("#offre_salaire_input_" + id)[0].value;
    dico.offre_lieu = $("#offre_lieu_input_" + id)[0].value;
    dico.offre_description = $("#offre_description_textarea_" + id)[0].value;
    dico.societe_id = $("#societe_nom_select_" + id)[0].value;
    dico.type_id = $("#type_nom_select_" + id)[0].value;
    if (dico.offre_titre == "") {
        alert("Veuillez entrer un offre_titre")
    } else if (dico.offre_salaire == "") {
        alert("Veuillez entrer un offre_salaire")
    } else if (dico.offre_lieu == "") {
        alert("Veuillez entrer un offre_lieu")
    } else if (dico.offre_description == "") {
        alert("Veuillez entrer un offre_description")
    } else {
        callAPI_update(dico, "offres");
    }
}

function callAPI_update(dico) {
    $.ajax({
        url: "/offres/update",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            callAPI_getById(dico.offre_id);
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function callAPI_getById(id) {
    $.ajax({
        url: "/offres/getById",
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
    afficher += `
            <td>${element.offre_titre}</th>
            <td>${element.offre_salaire}</td>
            <td>${element.offre_lieu}</td>
            <td>${element.offre_description}</td>
            <td>${element.societe_nom}</td>
            <td>${element.type_nom}</td>
            <td>
              <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.offre_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${id}')">Supprimer</button>
            </td>
            `
    $("tr#" + id).append(afficher);
}

function boutton_supprimer(id) {
    if (confirm("Etes-vous sure de vouloir supprimer cette ligne de la base donnée ?")) {
        callAPI_remove(id);
    }
}

function callAPI_remove(id) {
    let envoyer;
    envoyer = JSON.stringify({ offre_id: id });

    $.ajax({
        url: "/offres/remove",
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
        dico.offre_titre = $("#offre_titre_input")[0].value;
        dico.offre_salaire = $("#offre_salaire_input")[0].value;
        dico.offre_lieu = $("#offre_lieu_input")[0].value;
        dico.offre_description = $("#offre_description_textarea")[0].value;
        dico.societe_id = $("#societe_nom_select")[0].value;
        dico.type_id = $("#type_nom_select")[0].value;
        if (dico.offre_titre == "") {
            alert("Veuillez entrer un offre_titre")
        } else if (dico.offre_salaire == "") {
            alert("Veuillez entrer un offre_salaire")
        } else if (dico.offre_lieu == "") {
            alert("Veuillez entrer un offre_lieu")
        } else if (dico.offre_description == "") {
            alert("Veuillez entrer un offre_description")
        } else {
            callAPI_ajout(dico, "offres");
        }
    }

    function callAPI_ajout(dico) {
        $.ajax({
            url: "/offres/add",
            contentType: "application/json",
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                $(".liste_information").remove();
                API_liste_information();
                $("#offre_titre_input")[0].value = "";
                $("#offre_salaire_input")[0].value = "";
                $("#offre_lieu_input")[0].value = "";
                $("#offre_description_textarea")[0].value = "";
                $("select").children().remove();
                API_liste_information_type();
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
    function API_liste_information() {
        $.ajax({
            url: "/offres", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information");
            }
        })
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations(liste_informations) {
        liste_informations.forEach(element =>
            $(".table").append(`
            <tbody class="liste_information">
              <tr id="${element.offre_id}">
                <td>${element.offre_titre}</th>
                <td>${element.offre_salaire}</td>
                <td>${element.offre_lieu}</td>
                <td>${element.offre_description}</td>
                <td>${element.societe_nom}</td>
                <td>${element.type_nom}</td>
                <td>
                  <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.offre_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.offre_id}')">Supprimer</button>
                </td>
              </tr>
            </tbody>
            `)
        );
    }

    /*
API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
*/
    function API_liste_information_type() {
        $.ajax({
            url: "/types", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations_type(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information_type");
            }
        })
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations_type(liste_informations) {
        liste_informations.forEach(element =>
            $("#type_nom_select").append(`
            <option value="${element.type_id}">${element.type_nom}</option>
        `)
        );
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
                console.log(result);
                affichage_liste_informations_societe(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information_societe");
            }
        })
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations_societe(liste_informations) {
        liste_informations.forEach(element =>
            $("#societe_nom_select").append(`
            <option value="${element.societe_id}">${element.societe_nom}</option>
        `)
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

    function init() {
        verifIsAdmin();

        API_liste_information_societe();
        API_liste_information_type();

        verifIsConnected();

        $("#logout").click(function () { deconnexion(); });

        $("#boutton_ajouter").click(function () {
            boutton_ajouter();
        })

        API_liste_information();

    }
})(window, document);