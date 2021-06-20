
function show(params) {
    if (params.hasClass("hide")) {
        params.removeClass("hide");
    }
}

function hide(params) {
    if (!params.hasClass("hide")) {
        params.addClass("hide");
    }
}

function deleteClass(element, classe) {
    if (element.hasClass(classe)) {
        element.removeClass(classe);
    }
}

function addClass(element, classe) {
    if (!element.hasClass(classe)) {
        element.addClass(classe);
    }
}

(function (window, document) {
    window.onload = init;

    function verifIsConnected(fonction) {
        $.ajax({
            url: "/users/isConnected",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                fonction(result);
            },
            error: function (err) {
                alert("Erreur: connexion()");
                console.log(err);
            }
        });
    }

    function gererLoginLogout(params) {
        if (params == "OK") {
            hide($("#login"));
            show($("#logout"));
            show($(".isConnected"));

            verifIsAdmin();
            verifIsInSocieteBis();
        } else {
            hide($("#logout"));
            show($("#login"));
            hide($(".isConnected"));
        }
    }

    function verifIsInSocieteBis() {
        $.ajax({
            url: "/employer/isEmployer",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    show($(".isInSociete"));
                } else {
                    hide($(".isInSociete"));
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
                    show($(".isAdmin"));
                } else {
                    hide($(".isAdmin"));
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
                alert("Erreur: connexion()");
                console.log(err);
            }
        });
    }

    function getSocietes(param) {
        if (param == "OK") {
            $.ajax({
                url: "/users/getUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                type: "GET",
                datatype: "JSON",
                success: function (resultBis) {
                    $.ajax({
                        url: "/employer/getByUserId",
                        contentType: "application/json", // Pour préciser le type de données qui transite
                        type: "POST",
                        datatype: "JSON",
                        data: JSON.stringify({ user_id: resultBis.id }),
                        success: function (result) {
                            for (let societe of result) {
                                $("ul#liste_societes").append(
                                    `<li id = ${societe.societe_id}>
                                        <div class="container">
                                            <div class="card">
                                                <div class="container">
                                                    <br>
                                                    <h3 class="texts nom text-center">${societe.societe_nom}</h3>
                                                    <input class="inputs input_nom hide" placeholder="Nom de l'entreprise" type="text">
                                                    <br>
                                                    <p class="siren texts">Numero de SIREN : ${societe.societe_siren}</p>
                                                    <p class="description texts">${societe.societe_description}</p>
                                                    <input class="inputs input_siren hide" placeholder="Numero de SIREN de l'entreprise" type="number">
                                                    <textarea class="inputs input_description hide" placeholder="Description de l'entreprise"></textarea>
                                                    <br>
                                                    <div class="div_button">
                                                        <button class="texts texts_button_success btn btn-success admin_gerant_offre" onclick="envoiToAddOffres(this)">Ajouter une offre</button>
                                                        <button class="texts texts_button_primary btn btn-primary" onclick="envoiToOffres(this)">Voir les offres pour cette entreprise</button>   
                                                        <button class="texts texts_button_warning btn btn-warning admin_societe" onclick="envoiToCrudSociete(this)">Gerer mes employer</button>   
                                                        <button class="texts texts_button_warning btn btn-warning admin_societe" onclick="button_modif(this)">Modifier</button>
                                                        <button class="texts texts_button_danger btn btn-danger admin_societe" onclick="supprimerSociete(this)">Supprimer</button>
                                                        <button class="inputs inputs_button_success hide" onclick="button_appliquer_modif(this)">Modifier</button>
                                                        <button class="inputs inputs_button_danger hide" onclick="button_cancel(this)">Annuler</button>
                                                    </div>
                                                    <br>
                                                </div>
                                            </div>
                                        </div>
                                        <br>
                                    </li>`
                                );

                                $.ajax({
                                    url: "/employer/isAdminForSociete",
                                    contentType: "application/json", // Pour préciser le type de données qui transite
                                    type: "POST",
                                    data: JSON.stringify({ societe_id: societe.societe_id }),
                                    success: function (result1) {
                                        $.ajax({
                                            url: "/employer/isAdminForOffre",
                                            contentType: "application/json", // Pour préciser le type de données qui transite
                                            type: "POST",
                                            data: JSON.stringify({ societe_id: societe.societe_id }),
                                            success: function (result2) {
                                                let inputsAdmins = $("#" + societe.societe_id).children().children().children().children(".div_button").children(".admin_societe");
                                                let inputsAdminsOffres = $("#" + societe.societe_id).children().children().children().children(".div_button").children(".admin_gerant_offre");

                                                if (result1 != "OK") {
                                                    hide(inputsAdmins);
                                                    deleteClass(inputsAdmins, "btn");
                                                    deleteClass(inputsAdmins, "btn-warning");
                                                    deleteClass(inputsAdmins, "btn-danger");
                                                }

                                                if (result2 != "OK") {
                                                    hide(inputsAdminsOffres);
                                                    deleteClass(inputsAdminsOffres, "btn");
                                                    deleteClass(inputsAdminsOffres, "btn-success");
                                                }
                                            },
                                            error: function (err) {
                                                alert("Erreur");
                                                console.log(err);
                                            }
                                        });
                                    },
                                    error: function (err) {
                                        alert("Erreur");
                                        console.log(err);
                                    }
                                });
                            }
                        },
                        error: function (err) {
                            alert("Erreur: connexion()");
                            console.log(err);
                        }
                    });
                },
                error: function (err) {
                    alert("Erreur: connexion()");
                    console.log(err);
                }
            });
        } else {
            console.log("erreur l'utilisateur ne doit pas etre la");
        }
    }

    function verifIsInSociete() {
        $.ajax({
            url: "/employer/isEmployer",
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
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        verifIsConnected(getSocietes);
        verifIsInSociete();
    }
})(window, document);

function envoiToOffres (input) {
    let id_societe = $(input).parent().parent().parent().parent().parent().attr("id");

    document.location.href = "/views/offres.html?societe=" + id_societe;
}

function envoiToAddOffres(input) {
    let id_societe = $(input).parent().parent().parent().parent().parent().attr("id");

    document.location.href = "/views/formulaire_offre.html?societe=" + id_societe;
}

function envoiToCrudSociete(input) {
    let id_societe = $(input).parent().parent().parent().parent().parent().attr("id");

    document.location.href = "/views/crud_societe.html?societe=" + id_societe;
}

function supprimerSociete(input) {
    let id_societe = $(input).parent().parent().parent().parent().parent().attr("id");

    if (confirm("Voulez vous supprimer cette societe")) {
        $.ajax({
            url: "/societe/removeWithUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "POST",
            data: JSON.stringify({ societe_id: id_societe }),
            success: function (result) {
                if (result == "OK") {
                    document.location.reload();
                } else {
                    console.log("ERREUR");
                }
            },
            error: function (err) {
                alert("Erreur");
                console.log(err);
            }
        }); 
    }
}

function toggleHideInputsAndTexts(input, params) {
    if (params) {
        hide($(input).parent().parent().children(".texts"));
        hide($(input).parent().children(".texts"));

        deleteClass($(input).parent().children(".texts"), "btn");
        deleteClass($(input).parent().children(".texts_button_success"), "btn-success");
        deleteClass($(input).parent().children(".texts_button_primary"), "btn-primary");
        deleteClass($(input).parent().children(".texts_button_warning"), "btn-warning");
        deleteClass($(input).parent().children(".texts_button_danger"), "btn-danger");

        show($(input).parent().parent().children(".inputs"));
        show($(input).parent().children(".inputs"));

        addClass($(input).parent().parent().children(".inputs"), "form-control");
        addClass($(input).parent().children(".inputs"), "btn");
        addClass($(input).parent().children(".inputs_button_success"), "btn-success");
        addClass($(input).parent().children(".inputs_button_danger"), "btn-danger");
    } else {
        hide($(input).parent().parent().children(".inputs"));
        hide($(input).parent().children(".inputs"));

        deleteClass($(input).parent().parent().children(".inputs"), "form-control");
        deleteClass($(input).parent().children(".inputs"), "btn");
        deleteClass($(input).parent().children(".inputs_button_success"), "btn-success");
        deleteClass($(input).parent().children(".inputs_button_danger"), "btn-danger");

        show($(input).parent().parent().children(".texts"));
        show($(input).parent().children(".texts"));

        addClass($(input).parent().children(".texts"), "btn");
        addClass($(input).parent().children(".texts_button_success"), "btn-success");
        addClass($(input).parent().children(".texts_button_primary"), "btn-primary");
        addClass($(input).parent().children(".texts_button_warning"), "btn-warning");
        addClass($(input).parent().children(".texts_button_danger"), "btn-danger");

        $.ajax({
            url: "/employer/isAdminForSociete",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "POST",
            data: JSON.stringify({ societe_id: $(input).parent().parent().parent().parent().parent().attr("id") }),
            success: function (result1) {
                $.ajax({
                    url: "/employer/isAdminForOffre",
                    contentType: "application/json", // Pour préciser le type de données qui transite
                    type: "POST",
                    data: JSON.stringify({ societe_id: $(input).parent().parent().parent().parent().parent().attr("id") }),
                    success: function (result2) {
                        let inputsAdmins = $(input).parent().children(".admin_societe");
                        let inputsAdminsOffres = $(input).parent().children(".admin_gerant_offre");

                        if (result1 != "OK") {
                            hide(inputsAdmins);
                            deleteClass(inputsAdmins, "btn");
                            deleteClass(inputsAdmins, "btn-warning");
                            deleteClass(inputsAdmins, "btn-danger");
                        }

                        if (result2 != "OK") {
                            hide(inputsAdminsOffres);
                            deleteClass(inputsAdminsOffres, "btn");
                            deleteClass(inputsAdminsOffres, "btn-success");
                        }
                    },
                    error: function (err) {
                        alert("Erreur");
                        console.log(err);
                    }
                });
            },
            error: function (err) {
                alert("Erreur");
                console.log(err);
            }
        });
    }
}

function button_modif(input) {
    function addValuesOnInputs(params) {
        $(input).parent().parent().children(".input_nom").val(params[0].societe_nom);
        $(input).parent().parent().children(".input_siren").val(params[0].societe_siren);
        $(input).parent().parent().children(".input_description").val(params[0].societe_description);
    }

    $.ajax({
        url: "/societe/getById",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "post",
        data: JSON.stringify({ id: $(input).parent().parent().parent().parent().parent().attr("id") }),
        datatype: "JSON",
        success: function (result) {
            addValuesOnInputs(result);
        },
        error: function (err) {
            alert("Erreur");
            console.log(err);
        }
    });

    toggleHideInputsAndTexts(input, true); 
}

function button_appliquer_modif(input) {
    let id = $(input).parent().parent().parent().parent().parent().attr("id");
    let nom = $(input).parent().parent().children(".input_nom").val();
    let siren = $(input).parent().parent().children(".input_siren").val();
    let description = $(input).parent().parent().children(".input_description").val();

    let dico = JSON.stringify({ societe_id: id, societe_nom: nom, societe_siren: siren, societe_description: description });
        
    if (nom == "") {
        alert("Veuillez entrer un titre");
    } else if (siren == "") {
        alert("Veuillez entrer un numero de SIREN")
    } else if (isNaN(siren) || siren.length != 9) {
        alert("Veuillez entrer un numero de SIREN valide")
    } else if (description == "") {
        alert("Veuillez entrer une description")
    } else {
        $.ajax({
            url: "/societe/updateWithUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            data: dico,
            type: "post",
            success: function (result) {
                if(result == "OK") {
                    window.location.reload();
                } else {
                    alert("ERREUR : Societe non modifiée");
                }
            },
        });
    }
}

function button_cancel(input) {
    toggleHideInputsAndTexts(input, false); 
}