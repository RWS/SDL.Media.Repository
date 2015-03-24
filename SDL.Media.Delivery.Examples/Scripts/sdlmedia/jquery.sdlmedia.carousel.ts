/// <reference path="../typings/bootstrap/bootstrap.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/sdlmedia.d.ts"/>

module SDL.MediaDelivery {
    export class CarouselOptions {
        url: string;
    }

    class ImageProperties {
        url: string;
        name: string;
        constructor(url: string, name: string) {
            this.url = url;
            this.name = name;
        }
    }

    export class Carousel {
        private container: HTMLElement;
        private options: CarouselOptions;

        constructor(container: HTMLElement, options: CarouselOptions) {
            this.container = container;
            this.options = options;
        }

        public render() {
            $.ajax(this.options.url, {
                async: true,
                type: "GET",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: response => {
                    this.renderView(response, this.container);
                },
                error: response => {
                    alert(response);
                }
            });
        }

        private renderView(distribution: SDL.MediaDelivery.IDistribution, container: HTMLElement) {
            if (distribution != null) {
                var imageList: Array<ImageProperties> = new Array<ImageProperties>();

                if (distribution.assetContainers.length > 0) {
                    distribution.assetContainers.forEach((assetContainer: SDL.MediaDelivery.IAssetContainer) => {
                        assetContainer.assets.forEach((asset: SDL.MediaDelivery.IAsset) => {
                            asset.renditionGroups.forEach((renditionGroup: SDL.MediaDelivery.IRenditionGroup) => {
                                renditionGroup.renditions.forEach((rendition: SDL.MediaDelivery.IRendition) => {
                                    imageList.push(new ImageProperties(rendition.url, asset.name));
                                });
                            });
                            
                        });
                    });
                }

                if (imageList.length > 0) {
                    // Now that we have collected all the images we can build the carousel
                    var carousel = <HTMLDivElement>document.createElement("div");
                    carousel.id = distribution.id;
                    carousel.className = "carousel slide";
                    carousel.setAttribute("data-ride", "carousel");
                    carousel.setAttribute("data-interval", "2000");

                    // Indicators
                    var indicators = <HTMLOListElement>document.createElement("ol");
                    indicators.className = "carousel-indicators";

                    // Images in carousel
                    var innerCarousel = <HTMLDivElement>document.createElement("div");
                    innerCarousel.className = "carousel-inner";

                    var index: number = 0;
                    imageList.forEach((imageProperty: ImageProperties) => {
                        var indicator = <HTMLLIElement>document.createElement("li");
                        indicator.setAttribute("data-target", "#" + distribution.id);
                        indicator.setAttribute("data-slide-to", index.toString());

                        var item = <HTMLDivElement>document.createElement("div");
                        item.className = "item";
                        var image = <HTMLImageElement>document.createElement("img");
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
                    var anchor = <HTMLAnchorElement>document.createElement("a");
                    anchor.className = "left carousel-control";
                    anchor.href = "#" + distribution.id;
                    anchor.setAttribute("role", "button");
                    anchor.setAttribute("data-slide", "prev");
                    var anchorSpan = <HTMLSpanElement>document.createElement("span");
                    anchorSpan.className = "glyphicon glyphicon-chevron-left";
                    anchor.appendChild(anchorSpan);
                    carousel.appendChild(anchor);

                    // next navigation
                    anchor = <HTMLAnchorElement>document.createElement("a");
                    anchor.className = "right carousel-control";
                    anchor.href = "#" + distribution.id;
                    anchor.setAttribute("role", "button");
                    anchor.setAttribute("data-slide", "next");
                    anchorSpan = <HTMLSpanElement>document.createElement("span");
                    anchorSpan.className = "glyphicon glyphicon-chevron-right";
                    anchor.appendChild(anchorSpan);
                    carousel.appendChild(anchor);

                    container.appendChild(carousel);
                    $(carousel).carousel();
                }
            }
        }
    }
}

(function ($) {
    $.fn.sdlmediaCarousel = function (options) {
        var $container = $(this);
        var carouselOptions = new SDL.MediaDelivery.CarouselOptions();
        carouselOptions.url = options.url;

        var carousel = new SDL.MediaDelivery.Carousel($container.get(0), carouselOptions);
        carousel.render();
    };
} (jQuery));
 