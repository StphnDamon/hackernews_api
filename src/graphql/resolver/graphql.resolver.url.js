var logger = require('../../../logger')(__filename);
var request = require('request');

function GraphqlResolverUrl () {
    this.Query = {
        urls: async (root, args, req) => {
            var test = await this.resolveUrls(root, args, req);

            return test;
        }
    };

    this.Mutation = {
        addUrl: async (root, args, req) => {
            var url = await this.addUrl(request, root, args, req);

            return url;
        },
        voteUp: async (root, args, req) => {
            var result = await this.voteUp(root, args, req);

            return result;
        },
        voteDown: async (root, args, req) => {
            var result = await this.voteDown(root, args, req);

            return result;
        }
    };
};

GraphqlResolverUrl.prototype.resolveUrls = (root, args, req) => {
    return new Promise((resolve, reject) => {
        req.db.model('url').find({}).sort({'vote.total': -1}).exec((err, urls) => {
            if (err) return reject(new Error(err));

            resolve(urls);
        });
    });
};

GraphqlResolverUrl.prototype.addUrl = (request, root, args, req) => {
    return new Promise((resolve, reject) => {
        let urlModel = req.db.model('url');
        let link = args.url;

        if (link.substr(0, 7) !== 'http://' && link.substr(0, 8) !== 'https://') {
            link = 'http://' + link;
        }

        // fetch the page to retrieve the title
        request(link, (err, response, body) => {
            if (err) return reject(new Error(err));

            let titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;
            let match = titleRegex.exec(body);

            // if the page has a title
            if (match) {
                let newUrl = urlModel({
                    url: link,
                    title: match[2]
                });

                newUrl.save((err, url) => {
                    if (err) return reject(new Error(err));

                    resolve(url);
                })
            } else {
                return reject(new Error('This site do not have a title'));
            }
        });
    });
};

GraphqlResolverUrl.prototype.voteUp = (root, args, req) => {
    return new Promise((resolve, reject) => {
        // update vote.total for global score
        req.db.model('url').update({_id: args._id}, {$inc: {'vote.up': 1, 'vote.total': 1}}, (err, result) => {
            if (err) return reject(new Error(err));

            resolve({_id: args._id});
        });
    });
};

GraphqlResolverUrl.prototype.voteDown = (root, args, req) => {
    return new Promise((resolve, reject) => {
        // update vote.total for global score
        req.db.model('url').update({_id: args._id}, {$inc: {'vote.down': 1, 'vote.total': -1}}, (err, result) => {
            if (err) return reject(new Error(err));

            resolve({_id: args._id});
        });
    });
};

module.exports = GraphqlResolverUrl;