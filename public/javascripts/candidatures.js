
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

    function gererLoginLogout(params) {
        if (params == "OK") {
            hide("#login");
            show("#logout");
            show(".isConnected");

            verifIsAdmin();
            verifIsInSocieteBis();
        } else {
            hide("#logout");
            show("#login");
            hide(".isConnected");
        }
    }

    function verifIsInSocieteBis() {
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
                alert("Erreur: connexion()");
                console.log(err);
            }
        });
    }

    function getCandidatures(param) {
        if (param == "OK") {
            $.ajax({
                url: "/cand/getByOffreId",
                contentType: "application/json", // Pour préciser le type de données qui transite
                type: "POST",
                datatype: "JSON",
                data: JSON.stringify({ offre_id: urlParam("offre"), societe_id: urlParam("societe") }),
                success: function (result) {
                    for (let cand of result) {
                        $("ul#liste_candidatures").append(
                            `<li id = ${cand.cand_id}>
                                <div class="container">
                                    <div class="card">
                                        <div class="container">
                                            <br>
                                            <h3 class="text-center">${cand.cand_titre}</h3>
                                            <br>
                                            <p>${cand.cand_description}</p>
                                            <p>Offre : ${cand.offre_titre}</p>
                                            <p>Username : ${cand.user_username}</p>
                                            <p>Nom : ${cand.user_nom}</p>
                                            <p>Prenom : ${cand.user_prenom}</p>
                                            <p>Email : ${cand.user_email}</p>
                                            <p>Telephone : ${cand.user_phone}</p>
                                            <p>Biographie : ${cand.user_biographie}</p>
                                            <button class="btn btn-danger admin_gerant_offre" onclick="supprimerCand(this)">Supprimer</button>
                                            <br><br>
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
                            data: JSON.stringify({ societe_id: urlParam("societe") }),
                            success: function (result1) {
                                let inputsAdminsOffres = $("#" + cand.cand_id).children().children().children().children(".admin_gerant_offre");

                                if (result1 != "OK") {
                                    hide(inputsAdminsOffres);
                                    deleteClass(inputsAdminsOffres, "btn");
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
        } else {
            console.log("erreur l'utilisateur ne doit pas etre la");
        }
    }

    function init() {
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        if (urlParam("societe") == false) {
            document.location.href = "/index.html"
        }

        if (urlParam("offre") == false) {
            document.location.href = "/index.html"
        }

        verifIsConnected(getCandidatures);
    }
})(window, document);

function supprimerCand(input) {
    let id_cand = $(input).parent().parent().parent().parent().attr("id");

    if (confirm("Voulez vous supprimer cette candidature")) {
        $.ajax({
            url: "/cand/removeWithUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "POST",
            data: JSON.stringify({ societe_id: urlParam("societe"), cand_id: id_cand }),
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