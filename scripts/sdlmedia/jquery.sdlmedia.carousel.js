/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/sdlmedia.d.ts"/>
var SDL;
(function (SDL) {
    var MediaDelivery;
    (function (MediaDelivery) {
        var CarouselOptions = (function () {
            function CarouselOptions() {
            }
            return CarouselOptions;
        })();
        MediaDelivery.CarouselOptions = CarouselOptions;
        var ImageProperties = (function () {
            function ImageProperties(url, name) {
                this.url = url;
                this.name = name;
            }
            return ImageProperties;
        })();
        var Carousel = (function () {
            function Carousel(container, options) {
                this.container = container;
                this.options = options;
            }
            Carousel.prototype.render = function () {
                var _this = this;
                $.ajax(this.options.url, {
                    async: true,
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (response) {
                        _this.renderView(response, _this.container);
                    },
                    error: function (response) {
                        alert(response);
                    }
                });
            };
            Carousel.prototype.renderView = function (distribution, container) {
                if (distribution != null) {
                    var imageList = new Array();
                    if (distribution.assetContainers.length > 0) {
                        distribution.assetContainers.forEach(function (assetContainer) {
                            assetContainer.assets.forEach(function (asset) {
                                asset.renditionGroups.forEach(function (renditionGroup) {
                                    renditionGroup.renditions.forEach(function (rendition) {
                                        imageList.push(new ImageProperties(rendition.url, asset.name));
                                    });
                                });
                            });
                        });
                    }
                    if (imageList.length > 0) {
                        // Now that we have collected all the images we can build the carousel
                        var carousel = document.createElement("div");
                        carousel.id = distribution.id;
                        carousel.className = "carousel slide";
                        // Indicators
                        var indicators = document.createElement("ol");
                        indicators.className = "carousel-indicators";
                        // Images in carousel
                        var innerCarousel = document.createElement("div");
                        innerCarousel.className = "carousel-inner";
                        var index = 0;
                        imageList.forEach(function (imageProperty) {
                            var indicator = document.createElement("li");
                            indicator.setAttribute("data-target", "#" + distribution.id);
                            indicator.setAttribute("data-slide-to", index.toString());
                            var item = document.createElement("div");
                            item.className = "item";
                            var image = document.createElement("img");
                            image.src = imageProperty.url;
                            item.appendChild(image);
                            if (index == 0) {
                                indicator.className = "active";
                                item.classList.add("active");
                            }
                            indicators.appendChild(indicator);
                            innerCarousel.appendChild(item);
                            ++index;
                        });
                        carousel.appendChild(indicators);
                        carousel.appendChild(innerCarousel);
                        // previous navigation
                        var anchor = document.createElement("a");
                        anchor.className = "left carousel-control";
                        anchor.href = "#" + distribution.id;
                        anchor.setAttribute("role", "button");
                        anchor.setAttribute("data-slide", "prev");
                        var anchorSpan = document.createElement("span");
                        anchorSpan.className = "glyphicon glyphicon-chevron-left";
                        anchor.appendChild(anchorSpan);
                        carousel.appendChild(anchor);
                        // next navigation
                        anchor = document.createElement("a");
                        anchor.className = "right carousel-control";
                        anchor.href = "#" + distribution.id;
                        anchor.setAttribute("role", "button");
                        anchor.setAttribute("data-slide", "next");
                        anchorSpan = document.createElement("span");
                        anchorSpan.className = "glyphicon glyphicon-chevron-right";
                        anchor.appendChild(anchorSpan);
                        carousel.appendChild(anchor);
                        container.appendChild(carousel);
                        $(carousel).carousel();
                    }
                }
            };
            return Carousel;
        })();
        MediaDelivery.Carousel = Carousel;
    })(MediaDelivery = SDL.MediaDelivery || (SDL.MediaDelivery = {}));
})(SDL || (SDL = {}));
(function ($) {
    $.fn.sdlmediaCarousel = function (options) {
        var $container = $(this);
        var carouselOptions = new SDL.MediaDelivery.CarouselOptions();
        carouselOptions.url = options.url;
        var carousel = new SDL.MediaDelivery.Carousel($container.get(0), carouselOptions);
        carousel.render();
    };
}(jQuery));
//# sourceMappingURL=jquery.sdlmedia.carousel.js.map