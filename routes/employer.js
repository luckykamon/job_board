
var express = require('express');
var router = express.Router();
var bdd = require('./module/bdd');

function isAdminInSociete(param, id_societe) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null && id_societe != null && !isNaN(id_societe)) {
            bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
                param.cookies.userData.id, id_societe
            ], function(err, result) {
                if (err) return reject(err);

                if (result != null && result[0] != null && result[0].emploi_access != null && result[0].emploi_access == 2) {
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

function isAdmin(param) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null) {
            bdd.query("SELECT user_droit_acces FROM utilisateur WHERE user_id = ?", [
                param.cookies.userData.id
            ], function(err, result) {
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

router.get('/', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT emploi_id, employer.societe_id, employer.user_id, emploi_access, societe_siren, societe_nom, societe_description, user_username FROM employer JOIN utilisateur ON employer.user_id = utilisateur.user_id JOIN societe ON employer.societe_id = societe.societe_id", [], function(err, result) {
            if (err) throw err;
            res.send(result);
        })  
    });
});

router.post("/getById", function (req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        if (req.body.id != null && !isNaN(req.body.id)) {
            bdd.query("SELECT emploi_id, employer.societe_id, employer.user_id, emploi_access, societe_siren, societe_nom, societe_description, user_username FROM employer JOIN utilisateur ON employer.user_id = utilisateur.user_id JOIN societe ON employer.societe_id = societe.societe_id WHERE emploi_id = ?", [
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

router.get('/getForForm', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        bdd.query("SELECT societe_id, societe_nom FROM societe", [], function(err, result) {
            if (err) throw err;

            bdd.query("SELECT user_id, user_username FROM utilisateur", [], function(err, resultbis) {
                if (err) throw err;

                res.send([result, resultbis]);
            });
        }); 
    });
});

router.post('/getByUserAndSocieteId', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT * FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result.length == 1) {
                bdd.query(`SELECT offre_id, offre_titre, offre_salaire, offre_description, offre_lieu, offre_emploi.societe_id, societe_siren, societe_nom, societe_description, type_nom FROM offre_emploi JOIN type_offre ON offre_emploi.type_id = type_offre.type_id JOIN societe ON offre_emploi.societe_id = societe.societe_id WHERE offre_emploi.societe_id = ?`, [
                    req.body.societe_id
                ], function(err, result) {
                    if (err) throw err;
                    res.send(result);
                });
            } else {
                res.sendStatus(401);
            }
        });
    } else {
        res.sendStatus(404);
    }
});

router.post('/isAdminForOffre', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && (result[0].emploi_access == 1 || result[0].emploi_access == 2)) {
                res.send("OK");
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.sendStatus(404);
    }  
});

router.post('/isAdminForSociete', function(req, res, next) {
    if (req.cookies.userData != null && req.body.societe_id != null && !isNaN(req.body.societe_id)) {
        bdd.query("SELECT emploi_access FROM employer WHERE user_id = ? AND societe_id = ?", [
            req.cookies.userData.id, req.body.societe_id
        ], function(err, result) {
            if (err) return reject(err);

            if (result != null && result[0] != null && result[0].emploi_access != null && result[0].emploi_access == 2) {
                res.send("OK");
            } else {
                res.send("NOK");
            }
        });
    } else {
        res.sendStatus(404);
    }  
});

router.post('/getByUserId', function(req, res, next) {
    if (req.body.user_id != null && !isNaN(req.body.user_id)) {
        bdd.query("SELECT emploi_id, employer.societe_id, employer.user_id, emploi_access, societe_siren, societe_nom, societe_description, user_username FROM employer JOIN utilisateur ON employer.user_id = utilisateur.user_id JOIN societe ON employer.societe_id = societe.societe_id WHERE employer.user_id = ?", [
            req.body.user_id
        ], function(err, result) {
            if (err) throw err;
            res.send(result);
        })
    } else {
        res.sendStatus(404);
    }
});

router.get('/isEmployer', function(req, res, next) {
    if (req.cookies.userData != null) {
        bdd.query("SELECT * FROM employer JOIN utilisateur ON employer.user_id = utilisateur.user_id JOIN societe ON employer.societe_id = societe.societe_id WHERE employer.user_id = ?", [
            req.cookies.userData.id
        ], function(err, result) {
            if (err) throw err;

            if (result.length != 0) {
                res.send("OK");
            } else {
                res.send("NOK");
            }
        })
    } else {
        res.sendStatus(404);
    }
});

router.post('/isEmployerById', function(req, res, next) {
    if (req.cookies.userData != null) {
        if (req.body.societe_id != null && !isNaN(req.body.societe_id)) {
            bdd.query("SELECT * FROM employer JOIN utilisateur ON employer.user_id = utilisateur.user_id JOIN societe ON employer.societe_id = societe.societe_id WHERE employer.societe_id = ? AND employer.user_id = ?", [
                req.body.societe_id, req.cookies.userData.id
            ], function(err, result) {
                if (err) throw err;
    
                if (result.length != 0) {
                    res.send("OK");
                } else {
                    res.send("NOK");
                }
            });
        } else {
            res.sendStatus(404);
        }
    }
});

router.post('/getEmployersForSociete', function(req, res, next) {
    isAdminInSociete(req, req.body.societe_id).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }

        bdd.query(`SELECT emploi_id, employer.user_id, user_username, user_nom, user_prenom, employer.societe_id, societe_nom, emploi_access FROM employer JOIN utilisateur ON utilisateur.user_id = employer.user_id JOIN societe ON societe.societe_id = employer.societe_id WHERE employer.societe_id = ?`, [
            req.body.societe_id
        ], function(err, result) {
            if (err) throw err;

            res.send(result);
        }); 
    });
});

router.post('/add', function(req, res, next) {
    isAdminInSociete(req, req.body.societe_id).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let idSociete = req.body.societe_id;
        let idUser = req.body.user_id;
        let employerAccess = req.body.emploi_access;

        if (idSociete != null && !isNaN(idSociete) && idUser != null && !isNaN(idUser) && employerAccess != null && !isNaN(employerAccess)) {
            bdd.query(`SELECT * FROM employer WHERE societe_id = ? AND user_id = ?`, [
                idSociete, idUser
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO employer (societe_id, user_id, emploi_access) VALUES ( ?, ?, ?)`, [
                        idSociete, idUser, employerAccess
                    ], function(err, result) {
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

router.post('/update', function(req, res, next) {
    bdd.query(`SELECT societe_id FROM employer WHERE emploi_id = ?`, [
        req.body.emploi_id
    ], function(err, result) {
        if (err) throw err;

        isAdminInSociete(req, result[0].societe_id).then((admin) => {
            if (!admin) {
                res.sendStatus(401);
                return;
            }
        
            isAdminInSociete(req, req.body.societe_id).then((admin) => {
                if (!admin) {
                    res.sendStatus(401);
                    return;
                }
            
                let id = req.body.emploi_id;
                let idSociete = req.body.societe_id;
                let idUser = req.body.user_id;
                let employerAccess = req.body.emploi_access;
        
                if (idSociete != null && !isNaN(idSociete) && idUser != null && !isNaN(idUser) && employerAccess != null && !isNaN(employerAccess) && id != null && !isNaN(id)) {
                    bdd.query(`SELECT * FROM employer WHERE emploi_id = ?`, [
                        id
                    ], function(err, result) {
                        if (err) throw err;
        
                        if (result.length == 1) {
                            bdd.query(`SELECT * FROM employer WHERE emploi_id != ? AND societe_id = ? AND user_id = ?`, [
                                id, idSociete, idUser
                            ], function(err, result) {
                                if (err) throw err;
                    
                                if (result.length == 0) {
                                    bdd.query(`UPDATE employer SET societe_id = ?, user_id = ?, emploi_access = ? WHERE emploi_id = ?`, [
                                        idSociete, idUser, employerAccess, id
                                    ], function(err, result) {
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
            });
        });
    });
});

router.post('/remove', function(req, res, next) {
    bdd.query(`SELECT societe_id FROM employer WHERE emploi_id = ?`, [
        req.body.emploi_id
    ], function(err, result) {
        if (err) throw err;

        isAdminInSociete(req, result[0].societe_id).then((admin) => {
            if (!admin) {
                res.sendStatus(401);
                return;
            }
        
            let id = req.body.emploi_id;
    
            if (id != null && !isNaN(id)) {
                bdd.query(`SELECT * FROM employer WHERE emploi_id = ?`, [
                    id
                ], function(err, result) {
                    if (err) throw err;
    
                    if (result.length == 1) {
                        bdd.query(`DELETE FROM employer WHERE emploi_id = ?`, [
                            id
                        ], function(err, result) {
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
});

function isAdmin(param) {
    return new Promise((resolve, reject) => {
        if (param.cookies.userData != null) {
            bdd.query("SELECT user_droit_acces FROM utilisateur WHERE user_id = ?", [
                param.cookies.userData.id
            ], function(err, result) {
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

router.post('/addAdmin', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
    
        let idSociete = req.body.societe_id;
        let idUser = req.body.user_id;
        let employerAccess = req.body.emploi_access;

        if (idSociete != null && !isNaN(idSociete) && idUser != null && !isNaN(idUser) && employerAccess != null && !isNaN(employerAccess)) {
            bdd.query(`SELECT * FROM employer WHERE societe_id = ? AND user_id = ?`, [
                idSociete, idUser
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 0) {
                    bdd.query(`INSERT INTO employer (societe_id, user_id, emploi_access) VALUES ( ?, ?, ?)`, [
                        idSociete, idUser, employerAccess
                    ], function(err, result) {
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

router.post('/updateAdmin', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
        
        let id = req.body.emploi_id;
        let idSociete = req.body.societe_id;
        let idUser = req.body.user_id;
        let employerAccess = req.body.emploi_access;

        if (idSociete != null && !isNaN(idSociete) && idUser != null && !isNaN(idUser) && employerAccess != null && !isNaN(employerAccess) && id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM employer WHERE emploi_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`SELECT * FROM employer WHERE emploi_id != ? AND societe_id = ? AND user_id = ?`, [
                        id, idSociete, idUser
                    ], function(err, result) {
                        if (err) throw err;
            
                        if (result.length == 0) {
                            bdd.query(`UPDATE employer SET societe_id = ?, user_id = ?, emploi_access = ? WHERE emploi_id = ?`, [
                                idSociete, idUser, employerAccess, id
                            ], function(err, result) {
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
    });
});

router.post('/removeAdmin', function(req, res, next) {
    isAdmin(req).then((admin) => {
        if (!admin) {
            res.sendStatus(401);
            return;
        }
        
        let id = req.body.emploi_id;

        if (id != null && !isNaN(id)) {
            bdd.query(`SELECT * FROM employer WHERE emploi_id = ?`, [
                id
            ], function(err, result) {
                if (err) throw err;

                if (result.length == 1) {
                    bdd.query(`DELETE FROM employer WHERE emploi_id = ?`, [
                        id
                    ], function(err, result) {
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