
var express = require("express");
var router = express.Router();
var bdd = require("./module/bdd");
var passwordHash = require("password-hash");

function isAdmin(param) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null) {
            bdd.query("SELECT user_droit_acces FROM utilisateur WHERE user_id = ?", [
                param.cookies.userData.id
            ], function (err, result) {
                if (err) return reject(err);

                if (result != null && result[0] != null && result[0].user_droit_acces != null && result[0].user_droit_acces == 1) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            });
        } else {
            return resolve(false);
        }
    })
}

router.get("/", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        bdd.query("SELECT user_phone, user_id, user_username, user_email, user_nom, user_prenom, user_biographie, user_droit_acces FROM utilisateur", [], function (err, result) {
            if (err) throw err;

            res.send(result);
        });
    });
});

router.post("/getById", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        if (req.body.id != null && !isNaN(req.body.id)) {
            bdd.query("SELECT user_phone, user_id, user_username, user_email, user_nom, user_prenom, user_biographie, user_droit_acces FROM utilisateur WHERE user_id = ?", [
                req.body.id
            ], function (err, result) {
                if (err) throw err;
                res.send(result);
            })
        } else {
            res.sendStatus(404);
        }
    });
});

router.post("/connexion", function (req, res, next) {
    let username = req.body.user_username;
    let password = req.body.user_password;

    if (username != null && password != null) {
        bdd.query('SELECT user_id, user_username, user_password FROM utilisateur WHERE user_username = ?', [
            username
        ], function (err, result) {
            if (err) throw err;

            if (passwordHash.verify(password, result[0].user_password)) {
                res.cookie("userData", { name: result[0].user_username, id: result[0].user_id }, { expire: (400000 + Date.now()) });
                res.send("OK");
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.send("NOK");
    }
});

router.post("/enregistrement", function (req, res, next) {
    let username = req.body.user_username;
    let email = req.body.user_email;
    let nom = req.body.user_nom;
    let prenom = req.body.user_prenom;
    let bio = req.body.user_biographie;
    let password = passwordHash.generate(req.body.user_password);
    let phone = req.body.user_phone;

    if (username != null && phone != null && email != null && nom != null && prenom != null && bio != null && password != null) {
        bdd.query("SELECT * FROM utilisateur WHERE user_username = ? OR user_email = ? OR user_phone = ?", [
            username, email, phone
        ], function (err, result) {
            if (err) throw err;

            if (result.length == 0) {
                bdd.query("INSERT INTO utilisateur (user_username, user_email, user_nom, user_prenom, user_biographie, user_password, user_phone) VALUES ( ?, ?, ?, ?, ?, ?, ?)", [
                    username, email, nom, prenom, bio, password, phone
                ], function (err, result) {
                    if (err) throw err;

                    bdd.query('SELECT user_id, user_username FROM utilisateur WHERE user_username = ?', [
                        username
                    ], function (err, result) {
                        if (err) throw err;

                        res.cookie("userData", { name: result[0].user_username, id: result[0].user_id }, { expire: (400000 + Date.now()) });
                        res.send("OK");
                    });
                });
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.send("NOK");
    }
});

router.get("/getUserAll", function (req, res, next) {
    if (req.cookies.userData != null) {
        bdd.query("SELECT user_phone, user_id, user_username, user_email, user_nom, user_prenom, user_biographie, user_phone FROM utilisateur WHERE user_id = ?", [
            req.cookies.userData.id
        ], function (err, result) {
            if (err) throw err;

            res.send(result);
        });
    } else {
        res.sendStatus(404);
    }
});

router.post("/updateUser", function (req, res, next) {
    if (req.cookies.userData != null) {

        let phone = req.body.user_phone;
        let id = req.cookies.userData.id;
        let username = req.body.user_username;
        let email = req.body.user_email;
        let nom = req.body.user_nom;
        let prenom = req.body.user_prenom;
        let bio = req.body.user_biographie;

        if (req.body.user_password != null && req.body.user_password != "") {
            let password = passwordHash.generate(req.body.user_password);

            if (username != null && email != null && phone != null && nom != null && prenom != null && bio != null && password != null && id != null && !isNaN(id)) {
                bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
                    id
                ], function (err, result) {
                    if (err) throw err;

                    if (result.length == 1) {
                        bdd.query(`SELECT * FROM utilisateur WHERE (user_id != ? AND user_username = ?) or (user_id != ? AND user_email = ?) or (user_id != ? AND user_phone = ?)`, [
                            id, username, id, email, id, phone
                        ], function (err, result) {
                            if (err) throw err;

                            if (result.length == 0) {
                                bdd.query(`UPDATE utilisateur SET user_username = ?, user_email = ?, user_phone = ?, user_nom = ?, user_prenom = ?, user_biographie = ?, user_password = ? WHERE user_id = ?`, [
                                    username, email, phone, nom, prenom, bio, password, id
                                ], function (err, result) {
                                    if (err) throw err;
                                    res.send("OK");
                                });
                            } else {
                                res.send("NOK");
                            }
                        });
                    } else {
                        res.send("NOK");
                    }
                });
            } else {
                res.send("NOK");
            }
        } else {
            if (username != null && email != null && phone != null && nom != null && prenom != null && bio != null && id != null && !isNaN(id)) {
                bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
                    id
                ], function (err, result) {
                    if (err) throw err;

                    if (result.length == 1) {
                        bdd.query(`SELECT * FROM utilisateur WHERE (user_id != ? AND user_username = ?) or (user_id != ? AND user_email = ?) or (user_id != ? AND user_phone = ?)`, [
                            id, username, id, email, id, phone
                        ], function (err, result) {
                            if (err) throw err;

                            if (result.length == 0) {
                                bdd.query(`UPDATE utilisateur SET user_username = ?, user_email = ?, user_phone = ?, user_nom = ?, user_prenom = ?, user_biographie = ? WHERE user_id = ?`, [
                                    username, email, phone, nom, prenom, bio, id
                                ], function (err, result) {
                                    if (err) throw err;
                                    res.send("OK");
                                });
                            } else {
                                res.send("NOK");
                            }
                        });
                    } else {
                        res.send("NOK");
                    }
                });
            } else {
                res.send("NOK");
            }
        }
    } else {
        res.sendStatus(404);
    }
});

router.get("/deleteUser", function (req, res, next) {
    if (req.cookies.userData != null) {
        bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
            req.cookies.userData.id
        ], function (err, result) {
            if (err) throw err;

            if (result.length == 1) {
                bdd.query(`DELETE FROM utilisateur WHERE user_id = ?`, [
                    req.cookies.userData.id
                ], function (err, result) {
                    if (err) throw err;
                    res.clearCookie("userData");
                    res.send("OK");
                });
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.get("/getUser", function (req, res, next) {
    if (req.cookies.userData != null) {
        res.send(req.cookies.userData);
    } else {
        res.sendStatus(404);
    }
});

router.get("/deconnexion", function (req, res, next) {
    if (req.cookies.userData != null) {
        res.clearCookie("userData");
        res.send("OK");
    } else {
        res.send("NOK");
    }
});

router.get("/isConnected", function (req, res, next) {
    if (req.cookies.userData != null) {
        res.send("OK");
    } else {
        res.send("NOK");
    }
});

router.get("/isAdmin", function (req, res, next) {
    if (req.cookies.userData != null) {
        bdd.query("SELECT user_droit_acces FROM utilisateur WHERE user_id = ?", [
            req.cookies.userData.id
        ], function (err, result) {
            if (err) throw err;

            if (result != null && result[0] != null && result[0].user_droit_acces != null && result[0].user_droit_acces == 1) {
                res.send("OK");
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.send("NOK");
    }
});

router.post("/exist", function (req, res, next) {
    let username = req.body.user_username;

    if (username != null) {
        bdd.query(`SELECT * FROM utilisateur WHERE user_username = ?`, [
            username
        ], function (err, result) {
            if (err) throw err;

            if (result.length == 1) {
                res.send("OK");
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.post("/add", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        let phone = req.body.user_phone;
        let username = req.body.user_username;
        let email = req.body.user_email;
        let nom = req.body.user_nom;
        let prenom = req.body.user_prenom;
        let bio = req.body.user_biographie;
        let access = req.body.user_droit_acces;
        let password = passwordHash.generate(req.body.user_password);

        if (username != null && phone != null && email != null && nom != null && prenom != null && bio != null && password != null && access != null && !isNaN(access)) {
            bdd.query(`SELECT * FROM utilisateur WHERE user_username = ? OR user_email = ? OR user_phone = ?`, [
                username, email, phone
            ], function (err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO utilisateur (user_username, user_email, user_phone, user_nom, user_prenom, user_biographie, user_password, user_droit_acces) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)`, [
                        username, email, phone, nom, prenom, bio, password, access
                    ], function (err, result) {
                        if (err) throw err;
                        res.send("OK");
                    });
                } else {
                    res.send("NOK");
                }
            });
        } else {
            res.send("NOK");
        }
    });
});

router.post("/update", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        let phone = req.body.user_phone;
        let id = req.body.user_id;
        let username = req.body.user_username;
        let email = req.body.user_email;
        let nom = req.body.user_nom;
        let prenom = req.body.user_prenom;
        let access = req.body.user_droit_acces;
        let bio = req.body.user_biographie;

        if (req.body.user_password != null && req.body.user_password != "") {
            let password = passwordHash.generate(req.body.user_password);

            if (username != null && email != null && phone != null && nom != null && prenom != null && bio != null && password != null && id != null && !isNaN(id) && access != null && !isNaN(access)) {
                bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
                    id
                ], function (err, result) {
                    if (err) throw err;

                    if (result.length == 1) {
                        bdd.query(`SELECT * FROM utilisateur WHERE (user_id != ? AND user_username = ?) or (user_id != ? AND user_email = ?) or (user_id != ? AND user_phone = ?)`, [
                            id, username, id, email, id, phone
                        ], function (err, result) {
                            if (err) throw err;

                            if (result.length == 0) {

                                bdd.query(`SELECT user_id FROM utilisateur WHERE user_droit_acces = 1`, [
                                ], function (err, result) {
                                    if (err) throw err;
                                    if (!(result.length == 1 && result[0].user_id == id && access == 0)) {
                                        bdd.query(`UPDATE utilisateur SET user_username = ?, user_email = ?, user_phone = ?, user_nom = ?, user_prenom = ?, user_biographie = ?, user_password = ?, user_droit_acces = ? WHERE user_id = ?`, [
                                            username, email, phone, nom, prenom, bio, password, access, id
                                        ], function (err, result) {
                                            if (err) throw err;
                                            res.send("OK");
                                        });
                                    } else {
                                        res.send("NOK"); // Si on update on n'aura plus d'admin, donc il ne faut pas update
                                    }
                                });


                            } else {
                                res.send("NOK");
                            }
                        });
                    } else {
                        res.send("NOK");
                    }
                });
            } else {
                res.send("NOK");
            }
        } else {
            if (username != null && email != null && phone != null && nom != null && prenom != null && bio != null && id != null && !isNaN(id) && access != null && !isNaN(access)) {
                bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
                    id
                ], function (err, result) {
                    if (err) throw err;

                    if (result.length == 1) {
                        bdd.query(`SELECT * FROM utilisateur WHERE (user_id != ? AND user_username = ?) or (user_id != ? AND user_email = ?) or (user_id != ? AND user_phone = ?)`, [
                            id, username, id, email, id, phone
                        ], function (err, result) {
                            if (err) throw err;
                            if (result.length == 0) {
                                bdd.query(`SELECT user_id FROM utilisateur WHERE user_droit_acces = 1`, [
                                ], function (err, result) {
                                    if (err) throw err;
                                    if (!(result.length == 1 && result[0].user_id == id && access == 0)) {
                                        bdd.query(`UPDATE utilisateur SET user_username = ?, user_email = ?, user_phone = ?, user_nom = ?, user_prenom = ?, user_biographie = ?, user_droit_acces = ? WHERE user_id = ?`, [
                                            username, email, phone, nom, prenom, bio, access, id
                                        ], function (err, result) {
                                            if (err) throw err;
                                            res.send("OK");
                                        });
                                    } else {
                                        res.send("NOK"); // Si on update on n'aura plus d'admin, donc il ne faut pas update
                                    }
                                });
                            } else {
                                res.send("NOK");
                            }
                        });
                    } else {
                        res.send("NOK");
                    }
                });
            } else {
                res.send("NOK");
            }
        }
    });
});

router.post("/remove", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        let id = req.body.user_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM utilisateur WHERE user_id = ?`, [
                id
            ], function (err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM utilisateur WHERE user_id = ?`, [
                        id
                    ], function (err, result) {
                        if (err) throw err;
                        res.send("OK");
                    });
                } else {
                    res.send("NOK");
                }
            });
        } else {
            res.send("NOK");
        }
    });
});

module.exports = router;
