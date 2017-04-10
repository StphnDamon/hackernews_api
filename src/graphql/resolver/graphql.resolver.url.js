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
            var url = await this.addUrl(root, args, req);

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

GraphqlResolverUrl.prototype.addUrl = (root, args, req) => {
    return new Promise((resolve, reject) => {
        let urlModel = req.db.model('url');
        let link = args.url;

        if (link.substr(0, 7) !== 'http://' && link.substr(0, 8) !== 'https://') {
            link = 'http://' + link;
        }

        GraphqlResolverUrl.prototype.request(link, (err, response, body) => {
            if (err) return reject(new Error(err));

            let match = GraphqlResolverUrl.prototype.titleRegex.exec(body);

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
        req.db.model('url').update({_id: args._id}, {$inc: {'vote.up': 1, 'vote.total': 1}}, (err, result) => {
            if (err) return reject(new Error(err));

            resolve({_id: args._id});
        });
    });
};

GraphqlResolverUrl.prototype.voteDown = (root, args, req) => {
    return new Promise((resolve, reject) => {
        req.db.model('url').update({_id: args._id}, {$inc: {'vote.down': 1, 'vote.total': -1}}, (err, result) => {
            if (err) return reject(new Error(err));

            resolve({_id: args._id});
        });
    });
};

GraphqlResolverUrl.prototype.request = request;
GraphqlResolverUrl.prototype.titleRegex = /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi;

module.exports = GraphqlResolverUrl;