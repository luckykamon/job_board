
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

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
        .exec(window.location.search);
    return (results !== null) ? results[1] || 0 : false;
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

    function getOffres(param) {
        if (param == "OK") {
            $.ajax({
                url: "/users/getUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                type: "GET",
                datatype: "JSON",
                success: function (resultBis) {
                    $.ajax({
                        url: "/employer/getByUserAndSocieteId",
                        contentType: "application/json", // Pour préciser le type de données qui transite
                        type: "POST",
                        datatype: "JSON",
                        data: JSON.stringify({ societe_id: urlParam("societe") }),
                        success: function (result) {
                            for (let offre of result) {
                                $("ul#liste_offres").append(
                                    `<li id = ${offre.offre_id}>
                                        <div class="container">
                                            <div class="card">
                                                <div class="container">
                                                    <br>
                                                    <h3 class="texts titre text-center">${offre.offre_titre}</h3>
                                                    <input class="inputs input_titre hide" placeholder="Titre de l'offre" type="text">
                                                    <br>
                                                    <p class="texts description">${offre.offre_description}</p>
                                                    <p class="texts salaire">Salaire : ${offre.offre_salaire}€</p>
                                                    <p class="texts lieu">Lieu : ${offre.offre_lieu}</p>
                                                    <p class="texts type">Type : ${offre.type_nom}</p>
                                                    <p class="texts societe">Societe : ${offre.societe_nom}</p>
                                                    <textarea class="inputs input_description hide" placeholder="Description de l'offre"></textarea>
                                                    <input class="inputs input_salaire hide" placeholder="Salaire" type="number" min="0">
                                                    <input class="inputs input_lieu hide" placeholder="Lieu de l'offre" type="text">                                
                                                    <select class="inputs input_type hide"></select>
                                                    <br>
                                                    <div class="div_button">
                                                        <button class="texts texts_button_primary btn btn-primary" onclick="envoiToCand(this)">Voir les candidatures pour cette offre</button> 
                                                        <button class="texts texts_button_warning btn btn-warning admin_gerant_offre" onclick="button_modif(this)">Modifier</button>
                                                        <button class="texts texts_button_danger btn btn-danger admin_gerant_offre" onclick="supprimerOffre(this)">Supprimer</button>
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
                                    url: "/employer/isAdminForOffre",
                                    contentType: "application/json", // Pour préciser le type de données qui transite
                                    type: "POST",
                                    data: JSON.stringify({ societe_id: offre.societe_id }),
                                    success: function (result1) {
                                        let inputsAdminsOffres = $("#" + offre.offre_id).children().children().children().children(".div_button").children(".admin_gerant_offre");

                                        if (result1 != "OK") {
                                            hide(inputsAdminsOffres);
                                            deleteClass(inputsAdminsOffres, "btn");
                                            deleteClass(inputsAdminsOffres, "btn-warning");
                                            deleteClass(inputsAdminsOffres, "btn-danger");
                                        }
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
            url: "/employer/isEmployerById",
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

    function init() {
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        verifIsConnected(getOffres);
        verifIsInSociete();

        if (urlParam("societe") == false) {
            document.location.href = "/index.html"
        }
    }
})(window, document);

function envoiToCand (input) {
    let id_offre = $(input).parent().parent().parent().parent().parent().attr("id");

    document.location.href = "/views/candidatures.html?societe=" + urlParam("societe") + "&offre=" + id_offre;
}

function supprimerOffre(input) {
    let id_offre = $(input).parent().parent().parent().parent().parent().attr("id");

    if (confirm("Voulez vous supprimer cette offre")) {
        $.ajax({
            url: "/offres/removeWithUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "POST",
            data: JSON.stringify({ societe_id: urlParam("societe"), offre_id: id_offre }),
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
            url: "/employer/isAdminForOffre",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "POST",
            data: JSON.stringify({ societe_id: urlParam("societe")}),
            success: function (result1) {
                let inputsAdminsOffres = $(input).parent().children(".admin_gerant_offre");

                if (result1 != "OK") {
                    hide(inputsAdminsOffres);
                    deleteClass(inputsAdminsOffres, "btn");
                    deleteClass(inputsAdminsOffres, "btn-warning");
                    deleteClass(inputsAdminsOffres, "btn-danger");
                }
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
        $(input).parent().parent().children(".input_titre").val(params[0].offre_titre);
        $(input).parent().parent().children(".input_description").val(params[0].offre_description);
        $(input).parent().parent().children(".input_salaire").val(params[0].offre_salaire);
        $(input).parent().parent().children(".input_lieu").val(params[0].offre_lieu);
    }

    $.ajax({
        url: "/offres/getById",
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

    $.ajax({
        url: "/types",
        contentType: "application/json", // Pour préciser le type de données qui transite
        type: "get",
        datatype: "JSON",
        success: function (result) {
            result.forEach(element => {
                $(input).parent().parent().children(".input_type").append(`<option value="${element.type_id}">${element.type_nom}</option>`);
            });
        },
    });

    toggleHideInputsAndTexts(input, true); 
}

function button_appliquer_modif(input) {
    let id = $(input).parent().parent().parent().parent().parent().attr("id");
    let titre = $(input).parent().parent().children(".input_titre").val();
    let description = $(input).parent().parent().children(".input_description").val();
    let salaire = $(input).parent().parent().children(".input_salaire").val();
    let lieu = $(input).parent().parent().children(".input_lieu").val();
    let type = $(input).parent().parent().children(".input_type").val();
    let societe = urlParam("societe");

    let dico = JSON.stringify({ offre_id: id, offre_titre: titre, offre_description: description, offre_salaire: salaire, offre_lieu: lieu, type_id: type, societe_id: societe });
        
    if (titre == "") {
        alert("Veuillez entrer un titre");
    } else if (description == "") {
        alert("Veuillez entrer une description")
    } else if (salaire == "") {
        alert("Veuillez entrer un salaire")
    } else if (lieu == "") {
        alert("Veuillez entrer un lieu")
    } else {
        $.ajax({
            url: "/offres/updateWithUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            data: dico,
            type: "post",
            success: function (result) {
                if(result == "OK") {
                    window.location.reload();
                } else {
                    alert("ERREUR : Offre non modifiée");
                }
            },
        });
    }
}

function button_cancel(input) {
    toggleHideInputsAndTexts(input, false); 
}