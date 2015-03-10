/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/sdlmedia.d.ts"/>

module SDL.MediaDelivery
{
    export class Html5PlayerOptions {
        url: string;
    }

    class Quality {
        name: string;
        url: string;

        constructor(name: string, url: string) {
            this.name = name;
            this.url = url;
        }
    }

    export class Html5Player {
        private container: HTMLElement;
        private options: Html5PlayerOptions;

        constructor(container: HTMLElement, options: Html5PlayerOptions) {
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
                // Only the first asset in the first asset container gets displayed.
                if (distribution.assetContainers.length > 0) {
                    var assetContainer: SDL.MediaDelivery.IAssetContainer = distribution.assetContainers[0];
                    if (assetContainer.assets != null && assetContainer.assets.length > 0) {
                        var id = distribution.id;
                        var asset: SDL.MediaDelivery.IAsset = distribution.assetContainers[0].assets[0];
                        var qualityName: string = "";
                        var qualities: Array<Quality> = new Array<Quality>();
                        
                        asset.renditionGroups.forEach((renditionGroup: SDL.MediaDelivery.IRenditionGroup) => {
                            switch (renditionGroup.name) {
                            case 'Thumbnail - Source':
                                break;

                            case 'MobileLo - Source':
                                qualityName = "240";
                                break;

                            case 'MobileHi - Source':
                                qualityName = "360";
                                break;

                            case 'Web - Source':
                                qualityName = "480";
                                break;

                            case 'HD720 - Source':
                                qualityName = "720";
                                break;

                            case 'HD1080 - Source':
                                qualityName = "1080";
                                break;

                            default:
                                break;
                            }

                            renditionGroup.renditions.forEach((rendition: SDL.MediaDelivery.IRendition) => {
                                if (rendition.url.indexOf(".mp4") != -1) {
                                    var quality: Quality = new Quality(qualityName, rendition.url);
                                    qualities.push(quality);
                                }
                            });
                        });

                        var buttonGroup = <HTMLDivElement>document.createElement("div");
                        buttonGroup.className = "btn-group";
                        buttonGroup.setAttribute("role", "group");
                        container.appendChild(buttonGroup);

                        qualities.forEach((quality: Quality) => {
                            var button = <HTMLButtonElement>document.createElement("button");
                            button.innerText = quality.name;
                            button.onclick = () => { this.changeVideoSource(id, quality.url); };
                            button.innerText = quality.name;
                            button.type = "button";
                            button.className = "btn btn-default";
                            buttonGroup.appendChild(button);
                        });

                        var video = <HTMLVideoElement>document.createElement("video");
                        video.setAttribute("crossorigin", "anonymous");
                        video.id = id;
                        video.controls = true;
                        video.autoplay = true;
                        video.style.width = "100%";
                        video.style.height = "100%";

                        // Add the source
                        var source = <HTMLSourceElement>document.createElement("source");
                        source.src = qualities[0].url;
                        source.type = "video/mp4";
                        video.appendChild(source);

                        // Add the subtitles
                        if (asset.enrichments.subtitles != null) {
                            asset.enrichments.subtitles.forEach((subtitle: SDL.MediaDelivery.IAssetSubtitle) => {
                                var subtitleTrack = <HTMLTrackElement>document.createElement("track");
                                subtitleTrack.kind = "subtitles";
                                subtitleTrack.src = subtitle.webVideotextTrackUrl;
                                subtitleTrack.srclang = subtitle.cultureName.toLowerCase();
                                subtitleTrack.label = subtitle.cultureName;

                                video.appendChild(subtitleTrack);
                            });
                        }

                        container.appendChild(video);
                    }
                }
            }
        }

        private changeVideoSource(id, url) {
            var video = <HTMLVideoElement>document.getElementById(id);
            var currentTime = video.currentTime;
            video.src = url;
            video.play();
            video.addEventListener("canplay",(ev: Event) => {
                video.currentTime = currentTime;
            });
        }
    }
}

(function ($) {
    $.fn.sdlmediaHtml5Player = function (options) {
        var $container = $(this);
        var html5PlayerOptions = new SDL.MediaDelivery.Html5PlayerOptions();
        html5PlayerOptions.url = options.url;

        var html5Player = new SDL.MediaDelivery.Html5Player($container.get(0), html5PlayerOptions);
        html5Player.render();
    };
} (jQuery));

