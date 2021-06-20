
/*
Se lance losrque l'on clique sur un boutton de modification, prend en paramètre l'id du <tr> où se trouve le boutton modifier
Change l'affichage de la page pour permettre à l'utilisateur de modifier les informations
*/
function boutton_modifier(id) {
    $.ajax({
        url: "/users/getById", // METHOD GET par defaut
        contentType: "application/json", // Pour préciser le type de données qui transite
        dataType: 'json',
        type: "POST",
        data: JSON.stringify({ id: id }),
        success: function (result) {
            let dico = {};
            dico.user_username = result[0].user_username;
            dico.user_email = result[0].user_email;
            dico.user_phone = result[0].user_phone;
            dico.user_nom = result[0].user_nom;
            dico.user_prenom = result[0].user_prenom;
            dico.user_biographie = result[0].user_biographie;
            dico.user_droit_acces = result[0].user_droit_acces;
            dico.user_password = result[0].user_password;

            $("#" + id).children().remove();
            API_dico_select_ligne_modifier(id, dico);
        },
        error: function (err) {
            console.log("erreur: API_liste_information");
        }
    });
}

/*
API qui recupère la liste des informations de l'adresse choisi et affiche la ligne d'ajout
*/
function API_dico_select_ligne_modifier(id, dico) {
    affichage_ligne_modifier(id, dico);
}

function affichage_ligne_modifier(id, dico) {
    afficher = "";
    afficher += `
    <td>
    <input class="form-control" type="text" id="user_username_input_${id}" value="${dico.user_username}">
    </td>
    <td>
    <input class="form-control" type="email" id="user_email_input_${id}" value="${dico.user_email}">
    </td>
    <td>
    <input class="form-control" type="text" id="user_phone_input_${id}" value="${dico.user_phone}">
    </td>
    <td>
    <input class="form-control" type="text" id="user_nom_input_${id}" value="${dico.user_nom}">
    </td>
    <td>
    <input class="form-control" type="text" id="user_prenom_input_${id}" value="${dico.user_prenom}">
    </td>
    <td>
    <textarea class="form-control" name="user_biographie_textarea" id="user_biographie_textarea_${id}">${dico.user_biographie}</textarea>
    </td>
    <td>
    <select class="form-control" name="droit_acces" id="user_droit_acces_select_${id}">`
    if (dico.user_droit_acces == 1) {
        afficher += `
        <option value="0">Utilisateur</option>
        <option value="1" selected>Admin</option>
        `
    } else {
        afficher += `
        <option value="0" selected>Utilisateur</option>
        <option value="1">Admin</option>
        `
    }
    afficher += `
    </select>
    </td>
    <td>
    <input class="form-control" type="password" id="user_password_input_${id}">
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
    dico.user_id = id;
    dico.user_username = $("#user_username_input_" + id)[0].value;
    dico.user_email = $("#user_email_input_" + id)[0].value;
    dico.user_phone = $("#user_phone_input_" + id)[0].value;
    dico.user_nom = $("#user_nom_input_" + id)[0].value;
    dico.user_prenom = $("#user_prenom_input_" + id)[0].value;
    dico.user_biographie = $("#user_biographie_textarea_" + id)[0].value;
    dico.user_droit_acces = $("#user_droit_acces_select_" + id)[0].value;
    dico.user_password = $("#user_password_input_" + id)[0].value;
    if (!(validateEmail(dico.user_email))) {
        alert("Veuillez entrer une adresse valide");
    } else if (dico.user_username == "") {
        alert("Veuillez entrer un user_username")
    } else if (dico.user_nom == "") {
        alert("Veuillez entrer un user_nom")
    } else if (!(validatePhone(dico.user_phone))) {
        alert("Veuillez entrer un user_phone")
    } else if (dico.user_prenom == "") {
        alret("Veuillez entrer un user_prenom")
    } else if (dico.user_biographie == "") {
        alert("Veuillez entrer un user_biographie")
    } else {
        callAPI_update(dico, "users");
    }
}

function callAPI_update(dico) {
    $.ajax({
        url: "/users/update",
        contentType: "application/json", // Pour préciser le type de données qui transite
        data: JSON.stringify(dico),
        type: "post",
        success: function (result) {
            console.log(result);
            if (result != "NOK") {
                callAPI_getById(dico.user_id);
                verifIsAdminAfterUpdate();
            } else {
                alert("La modification n'as pas pu avoir lieu");
            }
        },
        error: function (err) {
            alert("La modification n'as pas pu avoir lieu");
            console.log(err);
        }
    });
}

function verifIsAdminAfterUpdate() {
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

function callAPI_getById(id) {
    $.ajax({
        url: "/users/getById",
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

    let access = null;
    switch (element.user_droit_acces) {
        case 1:
            access = "Administrateur";
            break;
        default:
            access = "Utilisateur";
            break;
    }

    let afficher = "";
    afficher +=
        `<td>${element.user_username}</th>
        <td>${element.user_email}</td>
        <td>${element.user_phone}</td>
        <td>${element.user_nom}</td>
        <td>${element.user_prenom}</td>
        <td>${element.user_biographie}</td>
        <td>${access}</td>
        <td></td>
        <td>
            <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.user_id}')">Modifier</button> 
            <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${id}')">Supprimer</button>
        </td>`;

    $("tr#" + id).append(afficher);
}

function boutton_supprimer(id) {
    if (confirm("Etes-vous sure de vouloir supprimer cette ligne de la base donnée ?")) {
        callAPI_remove(id);
    }
}

function callAPI_remove(id) {
    let envoyer;
    envoyer = JSON.stringify({ user_id: id });

    $.ajax({
        url: "/users/remove",
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

function validatePhone(num) {
    var re = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
    return re.test(num);
}

function validateEmail(email) {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
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
        dico.user_username = $("#user_username_input")[0].value;
        dico.user_email = $("#user_email_input")[0].value;
        dico.user_phone = $("#user_phone_input")[0].value;
        dico.user_nom = $("#user_nom_input")[0].value;
        dico.user_prenom = $("#user_prenom_input")[0].value;
        dico.user_biographie = $("#user_biographie_textarea")[0].value;
        dico.user_droit_acces = $("#user_droit_acces_select")[0].value;
        dico.user_password = $("#user_password_input")[0].value;
        if (!(validateEmail(dico.user_email))) {
            alert("Veuillez entrer une adresse valide");
        } else if (dico.user_username == "") {
            alert("Veuillez entrer un user_username")
        } else if (dico.user_nom == "") {
            alert("Veuillez entrer un user_nom")
        } else if (!(validatePhone(dico.user_phone))) {
            alert("Veuillez entrer un user_phone")
        } else if (dico.user_prenom == "") {
            alret("Veuillez entrer un user_prenom")
        } else if (dico.user_biographie == "") {
            alert("Veuillez entrer un user_biographie")
        } else if (dico.user_password == "") {
            alert("Veuillez entrer un user_password")
        } else {
            callAPI_ajout(dico, "users");
        }
    }

    function callAPI_ajout(dico) {
        $.ajax({
            url: "/users/add",
            contentType: "application/json",
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                $(".liste_information").remove();
                API_liste_information();
                $("#user_username_input")[0].value = "";
                $("#user_email_input")[0].value = "";
                $("#user_phone_input")[0].value = "";
                $("#user_nom_input")[0].value = "";
                $("#user_prenom_input")[0].value = "";
                $("#user_biographie_textarea")[0].value = "";
                $("#user_droit_acces_select")[0].value = "";
                $("#user_password_input")[0].value = "";
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
            url: "/users", // METHOD GET par defaut
            contentType: "application/json", // Pour préciser le type de données qui transite
            dataType: 'json',
            success: function (result) {
                affichage_liste_informations(result);
            },
            error: function (err) {
                console.log("erreur: API_liste_information");
            }
        });
    }

    /*
    Affiche les informations contenu dans la variable liste_informations et supprime les informations si il y en avait precedemment.
    Ajoute la ligne correspondant à l'ajout d'une donnée.
    */
    function affichage_liste_informations(liste_informations) {
        liste_informations.forEach(element => {
            let access = null;
            switch (element.user_droit_acces) {
                case 1:
                    access = "Administrateur";
                    break;
                default:
                    access = "Utilisateur";
                    break;
            }

            $(".table").append(
                `<tbody class="liste_information">
                <tr id="${element.user_id}">
                    <td>${element.user_username}</th>
                    <td>${element.user_email}</td>
                    <td>${element.user_phone}</td>
                    <td>${element.user_nom}</td>
                    <td>${element.user_prenom}</td>
                    <td>${element.user_biographie}</td>
                    <td>${access}</td>
                    <td></td>
                    <td>
                    <button type="button" class="btn btn-warning" onclick="boutton_modifier('${element.user_id}')">Modifier</button> <button type="button" class="btn btn-danger" onclick="boutton_supprimer('${element.user_id}')">Supprimer</button>
                    </td>
                </tr>
                </tbody>`
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
        verifIsConnected();
        $("#logout").click(function () { deconnexion(); });

        $("#boutton_ajouter").click(function () {
            boutton_ajouter();
        })

        API_liste_information();
        verifIsAdmin();
    }
})(window, document);