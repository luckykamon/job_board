
/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    let dico = {};
    dico.type_nom = $("#" + id).children()[0].textContent.trim();
    $("#" + id).children().remove();
    API_dico_select_ligne_modifier(id, dico);
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id, dico) {
    affichage_ligne_modifier(id, dico);
}

function affichage_ligne_modifier(id, dico, dico_select = false) {
    afficher = "";
    afficher += `
    <td>
    <input class="form-control" type="text" id="type_nom_input_${id}" value="${dico.type_nom}">
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
    dico.type_id = id;
    dico.type_nom = $("#type_nom_input_" + id)[0].value;
    if (dico.type_nom == "") {
        alert("Veuillez entrer un type_nom")
    } else {
        callAPI_update(dico, "types");
    }
}

function callAPI_update(dico) {
    $.ajax({
        url: "/types/update",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            callAPI_getById(dico.type_id);
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function callAPI_getById(id) {
    $.ajax({
        url: "/types/getById",
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
    <td>${element.type_nom}</th>
    <td>
      <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.type_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${id}')">Supprimer</button>
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
    envoyer = JSON.stringify({ type_id: id });

    $.ajax({
        url: "/types/remove",
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
        dico.type_nom = $("#type_nom_input")[0].value;
        if (dico.type_nom == "") {
          alert("Veuillez entrer un type_nom")
        } else {
          callAPI_ajout(dico, "types");
        }
    }

    function callAPI_ajout(dico) {
        $.ajax({
            url: "/types/add",
            contentType: "application/json",
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                $(".liste_information").remove();
                API_liste_information();
                $("#type_nom_input")[0].value = "";
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
            url: "/types", // METHOD GET par defaut
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
              <tr id="${element.type_id}">
                <td>${element.type_nom}</th>
                <td>
                  <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.type_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.type_id}')">Supprimer</button>
                </td>
              </tr>
            </tbody>
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
        verifIsConnected();
        $("#logout").click(function () { deconnexion(); });

        $("#boutton_ajouter").click(function () {
            boutton_ajouter();
        })

        API_liste_information();
        verifIsAdmin();
    }
})(window, document);