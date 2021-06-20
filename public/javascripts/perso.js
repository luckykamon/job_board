
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

    function toggleHideInputsAndTexts (param) {
        if (param) {
            if ($(".inputs").hasClass("form-control")) {
                $(".inputs").removeClass("form-control");
            }
            $(".inputs").hide();
            $(".inputsBis").hide();
            $(".texts").show();
        } else {
            if (!$(".inputs").hasClass("form-control")) {
                $(".inputs").addClass("form-control");
            }
            $(".inputs").show();
            $(".inputsBis").show();
            $(".texts").hide();
        }
    }

    function getAllValues(fonction) {
        $.ajax({
            url: "/users/getUserAll",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            datatype: "JSON",
            success: function (result) {
                fonction(result);
            },
            error: function (err) {
                alert("Erreur");
                console.log(err);
            }
        });
    }

    function addValuesOnTexts(params) {
        $("#username_text").text("Nom d'utilisateur : " + params[0].user_username);
        $("#email_text").text("Email : " + params[0].user_email);
        $("#tel_text").text("Telephone : " + params[0].user_phone);
        $("#nom_text").text("Nom : " + params[0].user_nom);
        $("#prenom_text").text("Prenom : " + params[0].user_prenom);
        $("#bio_text").text("Biographie : " + params[0].user_biographie);
    }

    function addValuesOnInputs(params) {
        $("#username").val(params[0].user_username);
        $("#email").val(params[0].user_email);
        $("#tel").val(params[0].user_phone);
        $("#nom").val(params[0].user_nom);
        $("#prenom").val(params[0].user_prenom);
        $("#bio").val(params[0].user_biographie);
    }

    function deleteMe() {
        $.ajax({
            url: "/users/deleteUser",
            contentType: "application/json", // Pour préciser le type de données qui transite
            type: "get",
            success: function (result) {
                if (result == "OK") {
                    document.location.href = "/index.html";
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

    function validateEmail(email) {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }

    function verifTel(tel) {
        let reg = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
        return reg.test(tel);
    }

    function updateMe() {
        let dico = { user_username: $("#username").val(), user_password: $("#password").val(), user_email: $("#email").val(), user_phone: $("#tel").val(), user_nom: $("#nom").val(), user_prenom: $("#prenom").val(), user_biographie: $("#bio").val() };
        
        if (!(validateEmail(dico.user_email))) {
            console.log(dico.user_email)
            alert("Veuillez entrer une adresse email valide");
        }  else if (!verifTel(dico.user_phone)) {
            alert("Veuillez entrer un numéro de telephone valide")
        } else if (dico.user_username == "") {
            alert("Veuillez entrer un user_username")
        } else if (dico.user_nom == "") {
            alert("Veuillez entrer un user_nom")
        } else if (dico.user_prenom == "") {
            alret("Veuillez entrer un user_prenom")
        } else if (dico.user_biographie == "") {
            alert("Veuillez entrer un user_biographie")
        } else {
            $.ajax({
                url: "/users/updateUser",
                contentType: "application/json", // Pour préciser le type de données qui transite
                data: JSON.stringify(dico),
                type: "post",
                success: function (result) {
                    console.log(result)
                    if (result == "OK") {
                        document.location.reload();
                    } else {
                        alert("ERREUR");
                    }
                },
                error: function (err) {
                    alert("La modification n'as pas pu avoir lieu");
                    console.log(err);
                }
            });
        }
    }

    function init() {
        verifIsConnected(gererLoginLogout);
        $("#logout").click(function () { deconnexion(); });

        getAllValues(addValuesOnTexts);
        toggleHideInputsAndTexts(true);

        $("#button_modif").click(function () { 
            getAllValues(addValuesOnInputs);
            toggleHideInputsAndTexts(false); 
        });
        $("#button_supprimer").click(function () { 
            if (confirm("Etes vous sur de supprimer votre compte")) deleteMe(); 
        });
        $("#button_appliquer_modif").click(function () { updateMe(); });
        $("#button_cancel").click(function () { toggleHideInputsAndTexts(true); });
        $("#button_ajouter_societe").click(function () { document.location.href = "/views/formulaire_societe.html" });
    }
})(window, document);
