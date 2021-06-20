
/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    let dico = {};
    dico.cand_titre = $("#" + id).children()[0].textContent.trim(); //trim() supprime les espaces avant et après
    dico.cand_description = $("#" + id).children()[1].textContent.trim();
    dico.offre_titre = $("#" + id).children()[2].textContent.trim();
    dico.user_username = $("#" + id).children()[3].textContent.trim();
    $("#" + id).children().remove();
    API_dico_select_ligne_modifier(id, dico);
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id, dico) {
    $.ajax({
        url: "/cand/getForForm", // METHOD GET par defaut
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
            <input class="form-control" type="text" id="cand_titre_input_${id}" value="${dico.cand_titre}">
          </td>
          <td>
          <textarea class="form-control" name="cand_description_textarea" id="cand_description_textarea_${id}">${dico.cand_description}</textarea>
          </td>
          <td>
            <select class="form-control" name="offre_titre" id="offre_titre_select_${id}">`;
    for (i = 0; i < dico_select[0].length; i++) {
        if (dico_select[0][i].offre_titre == dico.offre_titre) {
            afficher += `
            <option value="${dico_select[0][i].offre_id}" selected>${dico_select[0][i].offre_titre}</option>
            `;
        } else {
            afficher += `
            <option value="${dico_select[0][i].offre_id}">${dico_select[0][i].offre_titre}</option>
            `;
        }
    }
    afficher += `
        </select>
      </td>
      <td>
        <select class="form-control" name="user_username" id="user_username_select_${id}">`;
    for (i = 0; i < dico_select[1].length; i++) {
        if (dico_select[1][i].user_username == dico.user_username) {
            afficher += `
    <option value="${dico_select[1][i].user_id}" selected>${dico_select[1][i].user_username}</option>
    `;
        } else {
            afficher += `
            <option value="${dico_select[1][i].user_id}">${dico_select[1][i].user_username}</option>
            `;
        }

    }
    afficher += `
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

    dico.cand_id = id;
    dico.cand_titre = $("#cand_titre_input_" + id)[0].value;
    dico.cand_description = $("#cand_description_textarea_" + id)[0].value;
    dico.offre_id = $("#offre_titre_select_" + id)[0].value;
    dico.user_id = $("#user_username_select_" + id)[0].value;
    //faire un if pour savoir si l'une des informations est vide
    if (dico.cand_titre == "") {
        alert("Veuillez ajouter un cand_titre");
    } else if (dico.cand_description == "") {
        alert("Veuillez ajouter un cand_description");
    } else {
        callAPI_update(dico);
    }
}

function callAPI_update(dico) {
    $.ajax({
        url: "/cand/update",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            callAPI_getById(dico.cand_id);
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function callAPI_getById(id) {
    $.ajax({
        url: "/cand/getById",
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
        <td>${element.cand_titre}</th>
        <td>${element.cand_description}</td>
        <td>${element.offre_titre}</td>
        <td>${element.user_username}</td>
        <td>
          <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.cand_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${id}')">Supprimer</button>
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
    envoyer = JSON.stringify({ cand_id: id });

    $.ajax({
        url: "/cand/remove",
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
        dico.cand_titre = $("#cand_titre_input")[0].value;
        dico.cand_description = $("#cand_description_textarea")[0].value;
        dico.offre_id = $("#offre_titre_select")[0].value;
        dico.user_id = $("#user_username_select")[0].value;
        if (dico.cand_titre == "") {
            alert("Veuillez ajouter un cand_titre");
        } else if (dico.cand_description == "") {
            alert("Veuillez ajouter un cand_description");
        } else {
            callAPI_ajout(dico, "cand");
        }
    }

    function callAPI_ajout(dico) {
        $.ajax({
            url: "/cand/add",
            contentType: "application/json",
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                $(".liste_information").remove();
                API_liste_information_cand();
                $("#cand_titre_input")[0].value = "";
                $("#cand_description_textarea")[0].value = "";
                $("select").children().remove();
                API_liste_information_users();
                API_liste_information_offre();
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
    function API_liste_information_cand() {
        $.ajax({
            url: "/cand", // METHOD GET par defaut
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
        liste_informations.forEach(element =>
            $(".table").append(`
            <tr id="${element.cand_id}" class="liste_information">
              <td>${element.cand_titre}</th>
              <td>${element.cand_description}</td>
              <td>${element.offre_titre}</td>
              <td>${element.user_username}</td>
              <td>
                <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.cand_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.cand_id}')">Supprimer</button>
              </td>
            </tr>`)
        );
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
        liste_informations.forEach(element =>
            $("#user_username_select").append(`
            <option value="${element.user_id}">${element.user_username}</option>
            `)
        );
    }

    /*
API qui recupère la liste des informations de l'adresse choisi et fait afficher les informations
*/
    function API_liste_information_offre() {
        $.ajax({
            url: "/offres", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations_offre(result);
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
    function affichage_liste_informations_offre(liste_informations) {
        liste_informations.forEach(element =>
            $("#offre_titre_select").append(`
        <option value="${element.offre_id}">${element.offre_titre}</option>
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

        API_liste_information_users();
        API_liste_information_offre();
        API_liste_information_cand();

        verifIsConnected();

        $("#logout").click(function () { deconnexion(); });

        $("#boutton_ajouter").click(function () {
            boutton_ajouter();
        })



    }
})(window, document);