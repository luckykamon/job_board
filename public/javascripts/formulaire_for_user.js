
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
    
    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }
    
    function affichage_offre_titre(result) {
        let afficher = `<p>Nom de l'offre: ${result[0].offre_titre}</p>`;
        $(".btn").before(afficher);
    }
    
    function envoyer_candidature() {
        if ($("#titre")[0].value == "") {
            alert("Veuillez entrer un titre");
        } else if ($("#description")[0].value == "") {
            alert("Veuillez entrer une description")
        } else {
            $.ajax({
                url: "/users/getUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                type: "get",
                success: function (result1) {
                    $.ajax({
                        url: "/cand/add",
                        contentType: "application/json", // Pour préciser le type de données qui transite
                        data: JSON.stringify({ cand_titre: $("#titre")[0].value, cand_description: $("#description")[0].value, offre_id: urlParam("offre_id"), user_id: result1.id }),
                        type: "post",
                        success: function (result2) {
                            if(result2 == "OK") {
                                window.location.href = "/index.html";
                            } else {
                                alert("Candidature non acceptée");
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                },
            });
        }
    }

    function envoiAjax() {
        $.ajax({
            url: "/users/getUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                let afficher = "";
                afficher += `<p>Nom d'utilisateur: ${result.name}</p>`
                $(".btn").before(afficher);
                $.ajax({
                    url: "/offres/getById",
                    contentType: "application/json", // Pour préciser le type de données qui transite
                    data: JSON.stringify({ id: urlParam("offre_id") }),
                    dataType: 'json',
                    type: "post",
                    success: function (result) {
                        affichage_offre_titre(result);
                    },
                    error: function (err) {
                        console.log(err);
                    }
                });
            },
            error: function (err) {
                alert("Erreur: connexion3()");
                console.log(err);
            }
        });
    }

    function init() {
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        $("#bouton_validation").click(function () { envoyer_candidature(); });

        envoiAjax();

        if(urlParam("offre_id") == false) {
            document.location.href = "/index.html";
        } 
    }
})(window, document);