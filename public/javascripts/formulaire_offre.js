
(function (window, document) {
    window.onload = init;

    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
    }

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

    function envoyer_offre() {
        if ($("#titre").val() == "") {
            alert("Veuillez entrer un titre");
        } else if ($("#description").val() == "") {
            alert("Veuillez entrer une description")
        } else if ($("#salaire").val() == "") {
            alert("Veuillez entrer un salaire")
        } else if ($("#lieu").val() == "") {
            alert("Veuillez entrer un lieu")
        } else {
            $.ajax({
                url: "/offres/addWithUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                data: JSON.stringify({ offre_titre: $("#titre").val(), offre_description: $("#description").val(), offre_salaire: $("#salaire").val(), offre_lieu: $("#lieu").val(), type_id: $("#select_type").val(), societe_id: urlParam("societe") }),
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

    function remplirSelect() {
        $.ajax({
            url: "/types",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            datatype: "JSON",
            success: function (result) {
                result.forEach(element => {
                    $("#select_type").append(`<option value="${element.type_id}">${element.type_nom}</option>`);
                });
            },
        });
    }

    function verifIsAdminForOffre() {
        $.ajax({
            url: "/employer/isAdminForOffre",
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

        verifIsAdminForOffre();
        remplirSelect();

        $("#bouton_validation").click(function () { envoyer_offre(); });
    }
})(window, document);