// var User = require('./models/Users');
var Scraper = require('images-scraper'),
    google = new Scraper.Google();
var Jimp = require("jimp");
var request = require("request");
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (app, passport) {
    app.get('/', function (req, res) {
        res.render('profile');
    });
    // app.get('/signup', function (req, res) {
    //     res.render('register', {
    //         message: req.flash('signupMessage')
    //     });
    // });
    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect: '/profile', // redirect to the secure profile section
    //     failureRedirect: '/login', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect: '/profile', // redirect to the secure profile section
    //     failureRedirect: '/signup', // redirect back to the signup page if there is an error
    //     failureFlash: true // allow flash messages
    // }));
    // app.get('/profile', isLoggedIn, function (req, res) {

    //     res.render('profile', {
    //         user: req.user // get the user out of session and pass to template
    //     });
    // });
    app.get('/image/:id', function (req, res) {
        imageCollection = [];

        console.log(req.params.id)
        fs.readdir('public/images/' + req.params.id, (err, files) => {
            files.forEach(file => {
                // console.log(file)

                imageCollection.push(req.params.id + '/' + file);
            });
        })
        res.render('image', {
            image: imageCollection
        });

    })

    app.post('/keyword', function (req, res) {
        if (req.body.tags.length == " ") {
            console.log('please enter keyword first');

            res.redirect('/profile')
        } else {
            let imageCollection = []
                // var k = response[i].url.slice((response[i].url.lastIndexOf(".") - 1 >>> 0) + 2).slice(0, 3);
                fs.access('public/images/' + req.body.tags, (err) => {
                    if (!err) {
                        console.log('myfile exists');
                        fs.readdir('public/images/' + req.body.tags, (err, files) => {
                            files.forEach(file => {
                                // console.log(file)

                                imageCollection.push(req.body.tags + '/' + file);
                            });
                        })
                        res.render('image', {
                            image: imageCollection
                        });
                    } else {
                        let filter = [];
                        google.list({
                            keyword: req.body.tags,
                            num: 25,
                            detail: true,
                            nightmare: {
                                show: false
                            }
                        }).then(function (response) {

                            mkdirp('public/images/' + req.body.tags, function (err) {
                                if (err) console.error(err);
                                else {
                                    let count = 1;
                                    let tagSplit = req.body.tags.split(' ');
                                    let tags = tagSplit[0] + tagSplit[1];
                                    console.log(tagSplit)
                                    for (i = 0; i < response.length || count == 15; i++) {
                                        var k = response[i].url.slice((response[i].url.lastIndexOf(".") - 1 >>> 0) + 2).slice(0, 3);
                                        // console.log(res[i].url,k)
                                        if (count <= 15) {
                                            if (k == "jpg" || k == "png") {

                                                if (count > 15)
                                                    break;
                                                //  console.log(count);
                                                request(response[i].url).pipe(fs.createWriteStream('public/images/' + req.body.tags + '/' + req.body.tags + i + '.' + k))


                                                imageCollection.push(req.body.tags + '/' + req.body.tags + i + '.' + k);
                                                count++;

                                            }
                                        }


                                    }

                                    for (i = 0; i < imageCollection.length; i++) {
                                        let path = 'public/images/' + imageCollection[i];

                                        setTimeout(function () {

                                            Jimp.read(path).then(function (image) {
                                                image // resize 
                                                    .quality(60) // set JPEG quality 
                                                    .greyscale() // set greyscale 
                                                    .write(path);
                                                filter.push(image)
                                            }).catch(function (err) {
                                                // console.log(err);
                                                fs.unlink(path)
                                            });
                                        }, 5000)

                                    }
                                    // console.log(imageCollection)
                                }
                                
                            });

                            setTimeout(function () {
                                // res.render('image', {
                                //     image: filter
                                // });
                                res.redirect('/image/' + req.body.tags)
                            }, 6000)

                        }).catch(function (err) {
                            console.log('err', err);
                        });


                    }
                    // console.log(imageCollection)

                    // return res.json({
                    //     result: result
                    // });

                });
        }

    });

    // app.get('/logout', function (req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

};

// function isLoggedIn(req, res, next) {

//     // if user is authenticated in the session, carry on 
//     if (req.isAuthenticated())
//         return next();

//     // if they aren't redirect them to the home page
//     res.redirect('/');
// }