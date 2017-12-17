// var User = require('./models/Users');
var Scraper = require('images-scraper'),
    google = new Scraper.Google();
var Jimp = require("jimp");
var request = require("request");
var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('profile');
    });
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

            res.redirect('/')
        } else {
            let imageCollection = []
                // var k = response[i].url.slice((response[i].url.lastIndexOf(".") - 1 >>> 0) + 2).slice(0, 3);
                fs.access('public/images/' + req.body.tags, (err) => {
                    if (!err) {
                        console.log('myfile exists');
                        fs.readdir('public/images/' + req.body.tags, (err, files) => {
                            files.forEach(file => {
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
                                                return err;
                                            });
                                        }, 5000)

                                    }
                                    // console.log(imageCollection)
                                    setTimeout(function () {
                                        // res.render('image', {
                                        //     image: filter
                                        // });
                                        res.redirect('/image/' + req.body.tags)
                                    }, 5000)
        
                                }
                                
                            });

                           
                        }).catch(function (err) {
                            console.log('err', err);
                        });


                    }
                    

                });
        }

    });

   
};
