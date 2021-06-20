
(function (window, document) {
    window.onload = init;

    function urlParam(name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);
        return (results !== null) ? results[1] || 0 : false;
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
    
    function button_valid(choix) {
        if (choix == 0) {
            utilisateur({ user_username: $("#user_name_input")[0].value });
        } else if (choix == 1) { //On valide le boutton pour le mot de passe
            connexion_compte();
        } else if (choix == 2) {
            create_compte();
        }
    }
    
    function affichage_connexion() {
        $(".user_name").after(`
        <p>Nom d'utilisateur: ${$("#user_name_input")[0].value}</p>
        `)
        hide(".user_name");//$(".user_name").hide();
        show(".user_password");//$(".user_password").show();
    }
    
    function affichage_creation() {
        hide(".user_name");//$(".user_name").hide();
        $("#user_name_input_create")[0].value = $("#user_name_input")[0].value;
        show(".formulaire");//$(".formulaire").show();
    }
    
    /*
    Renvoie true si user se trouve dans la base de donnée et false sinon
    */
    function utilisateur(dico) {
        if (dico.user_username == "") {
            alert("Veuillez entrer un nom d'utilisateur");
        } else {
            $.ajax({
                url: "/users/exist",
                contentType: "application/json", // Pour préciser le type de données qui transite
                data: JSON.stringify(dico),
                type: "post",
                success: function (result) {
                    if (result == "OK") {
                        affichage_connexion();
                    } else {
                        affichage_creation();
                    }
                },
                error: function (err) {
                    alert("Erreur: connexion()");
                    console.log(err);
                }
            });
        }
    }
    
    function connexion_compte() {
        let dico = { user_username: $("#user_name_input")[0].value, user_password: $("#user_password_input")[0].value };
    
        $.ajax({
            url: "/users/connexion",
            contentType: "application/json", // Pour préciser le type de données qui transite
            data: JSON.stringify(dico),
            type: "post",
            success: function (result) {
                if (result == "OK") {
                    if (urlParam("offre_id") == false) {
                        window.location.href = "/index.html";
                    } else {
                        document.location.href = "/views/formulaire_for_user.html?offre_id=" + urlParam("offre_id");
                    }
                } else {
                    alert("Votre mot de passe est mauvais");
                }
            },
            error: function (err) {
                alert("Erreur: connexion_compte()");
                console.log(err);
            }
        });
    }

    function verifTel(tel) {
        let reg = /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/;
        return reg.test(tel);
    }
    
    function create_compte() {
        let dico = { user_username: $("#user_name_input_create")[0].value, user_password: $("#user_password_input_create")[0].value, user_email: $("#user_email_input")[0].value, user_phone: $("#user_tel_input")[0].value, user_nom: $("#user_nom_input")[0].value, user_prenom: $("#user_prenom_input")[0].value, user_biographie: $("#user_biographie_textarea")[0].value };
        
        if (dico.user_name == "") {
            alert("Veuillez entrer un nom d'utilisateur")
        } else if (!validateEmail(dico.user_email)) {
            alert("Veuillez entrer un email valide")
        }  else if (!verifTel(dico.user_phone)) {
            alert("Veuillez entrer un numéro de telephone valide")
        } else if (dico.user_nom == "") {
            alert("Veuillez entrer un nom")
        } else if (dico.user_prenom == "") {
            alert("Veuillez entrer un prénom")
        } else if (dico.user_biographie == "") {
            alert("Veuillez entrer une description")
        } else if (dico.user_password == "") {
            alert("Veuillez entrer un mot de passe")
        } else {
            $.ajax({
                url: "/users/enregistrement",
                contentType: "application/json", // Pour préciser le type de données qui transite
                data: JSON.stringify(dico),
                type: "post",
                success: function (result) {
                    if (result == "OK") {
                        if (urlParam("offre_id") == false) {
                            window.location.href = "/index.html";
                        } else {
                            document.location.href = "/views/formulaire_for_user.html?offre_id=" + urlParam("offre_id");
                        }
                    } else {
                        console.log("ERREUR");
                    }
                },
                error: function (err) {
                    alert("Erreur: create_compte()");
                    console.log(err);
                }
            });
        }
    }
    
    function validateEmail(email) {
        let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
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
                } else {
                    hide("#logout");
                    show("#login");
                }
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

    function init() {
        verifIsConnected();
        $("#logout").click(function () { deconnexion(); });

        hide(".user_password");//$(".user_password").hide();
        hide(".formulaire");//$(".formulaire").hide();

        $("#button_valid_0").click(function () { button_valid(0); });
        $("#button_valid_1").click(function () { button_valid(1); });
        $("#button_valid_2").click(function () { button_valid(2); });
    }
})(window, document);
