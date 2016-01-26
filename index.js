var _ = require('lodash')
    , dropbox = require('dropbox')
;
module.exports = {
    run: function(step, dexter) {
        var path = step.input('path').first()
            , token = dexter.provider('dropbox').credentials('access_token')
            , client = new dropbox.Client({
                token: token
            })
            , self = this
        ;
        client.search(path, '.jpg', {
            file_limit: 1000
        }, function(error, reply) {
            if(error) {
                return this.fail(error);
            }
            self.complete(_.map(reply, function(meta) {
                return {
                    source: 'dropbox'
                    , size: meta.bytes
                    , path: meta.path
                    , id: null
                    , created: null
                    , modified: meta.modified
                };
            }));

        });
    },
    dboxRun: function(step, dexter) {
        var path = step.input('path').first()
            , token = dexter.provider('dropbox').credentials('access_token')
            , client = require('dbox').app({}).client(token)
            , self = this
        ;
        client.search(path, '.jpg', {
            file_limit: 1000
        }, function(status, reply) {
            if(status !== 200) {
                console.error(reply);
                return self.fail('Photo search failed with status ' + status);
            }
            self.complete(_.map(reply, function(meta) {
                return {
                    source: 'dropbox'
                    , size: meta.bytes
                    , path: meta.path
                    , id: null
                    , created: null
                    , modified: meta.modified
                };
            }));

        });
    }
};
