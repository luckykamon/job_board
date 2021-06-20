
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
    
    function envoyer_candidature() {
        if ($("#nom")[0].value == "") {
            alert("Veuillez entrer un titre");
        } else if ($("#siren")[0].value == "") {
            alert("Veuillez entrer un numero de SIREN")
        } else if (isNaN($("#siren")[0].value) || $("#siren")[0].value.length != 9) {
            alert("Veuillez entrer un numero de SIREN valide")
        } else if ($("#description")[0].value == "") {
            alert("Veuillez entrer une description")
        } else {
            $.ajax({
                url: "/societe/addWithUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                data: JSON.stringify({ societe_nom: $("#nom")[0].value, societe_siren: $("#siren")[0].value, societe_description: $("#description")[0].value }),
                type: "post",
                success: function (result) {
                    if(result == "OK") {
                        window.location.href = "/index.html";
                    } else {
                        alert("Societe non acceptée");
                    }
                },
            });
        }
    }

    function init() {
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        $("#bouton_validation").click(function () { envoyer_candidature(); });
    }
})(window, document);