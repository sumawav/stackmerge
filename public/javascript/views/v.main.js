define([
    'backbone',
    'underscore',
    'collections/c.images',
    'views/v.images',
    'views/v.file',
    'views/v.preview'
], function (
    Backbone,
    _,
    ImagesCollection,
    ImagesView,
    FileView,
    PreviewView
) {
    var MainView = Backbone.View.extend({
        el: 'body',
        views: {},
        initialize: function () {
            this.images = new ImagesCollection();

            this.views.images = new ImagesView({
                images: this.images
            });
            this.views.uploads = new FileView({
                images: this.images
            });
            this.views.preview = new PreviewView({
                images: this.images
            });
        }
    });

    return MainView;
});
