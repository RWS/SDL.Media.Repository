/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/sdlmedia.d.ts"/>
var SDL;
(function (SDL) {
    var MediaDelivery;
    (function (MediaDelivery) {
        var Html5PlayerOptions = (function () {
            function Html5PlayerOptions() {
            }
            return Html5PlayerOptions;
        })();
        MediaDelivery.Html5PlayerOptions = Html5PlayerOptions;
        var Quality = (function () {
            function Quality(name, url) {
                this.name = name;
                this.url = url;
            }
            return Quality;
        })();
        var Html5Player = (function () {
            function Html5Player(container, options) {
                this.container = container;
                this.options = options;
            }
            Html5Player.prototype.render = function () {
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
            Html5Player.prototype.renderView = function (distribution, container) {
                var _this = this;
                if (distribution != null) {
                    // Only the first asset in the first asset container gets displayed.
                    if (distribution.assetContainers.length > 0) {
                        var assetContainer = distribution.assetContainers[0];
                        if (assetContainer.assets != null && assetContainer.assets.length > 0) {
                            var id = distribution.id;
                            var asset = distribution.assetContainers[0].assets[0];
                            var qualityName = "";
                            var qualities = new Array();
                            asset.renditionGroups.forEach(function (renditionGroup) {
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
                                renditionGroup.renditions.forEach(function (rendition) {
                                    if (rendition.url.indexOf(".mp4") != -1) {
                                        var quality = new Quality(qualityName, rendition.url);
                                        qualities.push(quality);
                                    }
                                });
                            });
                            var buttonGroup = document.createElement("div");
                            buttonGroup.className = "btn-group";
                            buttonGroup.setAttribute("role", "group");
                            container.appendChild(buttonGroup);
                            qualities.forEach(function (quality) {
                                var button = document.createElement("button");
                                button.innerText = quality.name;
                                button.onclick = function () {
                                    _this.changeVideoSource(id, quality.url);
                                };
                                button.innerText = quality.name;
                                button.type = "button";
                                button.className = "btn btn-default";
                                buttonGroup.appendChild(button);
                            });
                            var video = document.createElement("video");
                            video.setAttribute("crossorigin", "anonymous");
                            video.id = id;
                            video.controls = true;
                            video.autoplay = true;
                            video.style.width = "100%";
                            video.style.height = "100%";
                            // Add the source
                            var source = document.createElement("source");
                            source.src = qualities[0].url;
                            source.type = "video/mp4";
                            video.appendChild(source);
                            // Add the subtitles
                            if (asset.enrichments.subtitles != null) {
                                asset.enrichments.subtitles.forEach(function (subtitle) {
                                    var subtitleTrack = document.createElement("track");
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
            };
            Html5Player.prototype.changeVideoSource = function (id, url) {
                var video = document.getElementById(id);
                var currentTime = video.currentTime;
                video.src = url;
                video.play();
                video.addEventListener("canplay", function (ev) {
                    video.currentTime = currentTime;
                });
            };
            return Html5Player;
        })();
        MediaDelivery.Html5Player = Html5Player;
    })(MediaDelivery = SDL.MediaDelivery || (SDL.MediaDelivery = {}));
})(SDL || (SDL = {}));
(function ($) {
    $.fn.sdlmediaHtml5Player = function (options) {
        var $container = $(this);
        var html5PlayerOptions = new SDL.MediaDelivery.Html5PlayerOptions();
        html5PlayerOptions.url = options.url;
        var html5Player = new SDL.MediaDelivery.Html5Player($container.get(0), html5PlayerOptions);
        html5Player.render();
    };
}(jQuery));
//# sourceMappingURL=jquery.sdlmedia.html5player.js.map