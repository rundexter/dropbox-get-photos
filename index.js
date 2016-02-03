var _ = require('lodash')
    , dropbox = require('dropbox')
    , q = require('q')
;
module.exports = {
    run: function(step, dexter) {
        var path = step.input('path').first()
            , token = dexter.provider('dropbox').credentials('access_token')
            , client = new dropbox.Client({
                token: token
            })
            , search = q.nbind(client.search, client)
            , self = this
        ;
        q.all([
            search(path, '.jpg')
            , search(path, '.png')
            , search(path, '.gif')
        ])
            .then(function(results) {
                all = _.union.apply(null, results);
                self.complete(
                    _.map(
                        all
                        , function(meta) {
                            return { photo: {
                                source: 'dropbox'
                                , size: meta.bytes
                                , path: meta.path
                                , id: null
                                , created: null
                                , modified: meta.modified
                            }};
                        }
                    )
                );
            })
            .fail(self.fail)
        ;
    }
};
