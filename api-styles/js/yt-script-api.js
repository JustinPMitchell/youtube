
/*
 * Ytapi - A Api Which Streams YouTube Vids.
 * https://github.com/SpaceG/youtube.git
 * Copyright (c) 2017 - Under the MIT License
 * ytapi - A jQuery plugin for YouTube
 * https://github.com/wyllyan/ytapi/
 * Version: 0.1.0
 * Copyright (c) 2015 - Under the MIT License
 */
! function(a, b, c) {
    "use strict";

    function d(d, e) {
        function f(b, c) {
            return a(c).find(b).addBack(b)
        }

        function g(b, d) {
            return a.each(d, function(a, d) {
                b = b.replace(a, d !== c ? d : "")
            }), b
        }

        function h(a) {
            var b = s.settings.embedVideoBaseUrl + a;
            return f("iframe", s.settings.templates.player).prop("src", b)
        }

        function i(a) {
            var b = s.settings.loadingControl;
            if (q(b)) {
                var c = s.settings.loadingControlAnimationSpeed;
                a ? b.fadeIn(c) : b.fadeOut(c)
            }
        }

        function j() {
            if (q(s.settings.prevPageControl) || q(s.settings.nextPageControl)) {
                var a = s.settings.pageControlDisabledClass,
                    b = function(b, c) {
                        b.click(function() {
                            var a = p(s.youtubeData, c);
                            a && o(a)
                        }), t.afterLoadVideoItems.add(function() {
                            p(s.youtubeData, c) ? b.removeClass(a) : b.addClass(a)
                        })
                    };
                b(s.settings.prevPageControl, "prevPageToken"), b(s.settings.nextPageControl, "nextPageToken")
            }
        }

        function k() {
            if (!s.settings.embedVideo) {
                var c = s.settings.mediaViewer,
                    e = s.settings.videoItemActiveClass;
                d.on("click", "." + s.settings.videoItemContainerClass, function() {
                    var d = p(a(this).data("ytapi-video-data"), "videoId");
                    a(this).addClass(e).siblings().removeClass(e), q(c) ? c.html(h(d)) : a.isFunction(c) ? c.call(s, d) : b.open(s.settings.watchVideoBaseUrl + d, "_blank")
                }), t.afterLoadVideoItems.add(function() {
                    q(c) && d.find("." + s.settings.videoItemContainerClass).first().trigger("click")
                })
            }
        }

        function l(b) {
            var c = function() {
                    if (s.settings.embedVideo) return h(b.videoId);
                    var a = s.settings.templates.thumbnail;
                    return a = g(a, {
                        "{{image_default}}": p(b.thumbnails, "default.url"),
                        "{{image_medium}}": p(b.thumbnails, "medium.url"),
                        "{{image_high}}": p(b.thumbnails, "high.url"),
                        "{{image_standard}}": p(b.thumbnails, "standard.url"),
                        "{{image_maxres}}": p(b.thumbnails, "maxres.url")
                    }), f("img", a).prop("alt", b.title)
                },
                d = function() {
                    return s.settings.showVideoTitle ? g(s.settings.templates.videoTitle, {
                        "{{title}}": b.title
                    }) : void 0
                },
                e = function() {
                    return s.settings.showVideoDescription ? g(s.settings.templates.videoDescription, {
                        "{{description}}": b.description
                    }) : void 0
                };
            return a("<div/>", {
                "class": s.settings.videoItemContainerClass,
                data: {
                    "ytapi-video-data": b
                },
                html: g(s.settings.templates.videoItem, {
                    "{{video_media}}": c().prop("outerHTML"),
                    "{{video_title}}": d(),
                    "{{video_description}}": e()
                })
            })
        }

        function m(a) {
            return {
                title: a.snippet.title,
                description: a.snippet.description,
                publishedAt: a.snippet.publishedAt,
                videoId: a.snippet.resourceId.videoId,
                thumbnails: a.snippet.thumbnails
            }
        }

        function n() {
            if (s.youtubeData) {
                var b = s.youtubeData.items,
                    c = [];
                b.length ? (a.each(b, function(a, b) {
                    var d = m(b);
                    c.push(l(d))
                }), d.html(c)) : d.html(s.settings.templates.noVideos)
            }
        }

        function o(a) {
            var b, c = s.settings.itemsPerPage;
            s.settings.playlistId ? b = s.youtubeApi.getPlaylistItems(s.settings.playlistId, c, a) : s.settings.username ? b = s.youtubeApi.getUploadsByUsername(s.settings.username, c, a) : s.settings.channelId && (b = s.youtubeApi.getUploadsByChannelId(s.settings.channelId, c, a)), i(!0), b.done(function(a) {
                s.youtubeData = a, n(), t.afterLoadVideoItems.fire(a)
            }).always(function() {
                i(!1)
            })
        }

        function p(a, b) {
            if (a)
                for (var c = b.split("."), d = null; d = c.shift();) {
                    if (!a.hasOwnProperty(d)) return;
                    if (a = a[d], !c.length) return a
                }
        }

        function q(b) {
            return b instanceof a && b.length
        }

        function r() {
            a.each(t, function(a, b) {
                b.add(s.settings[a])
            })
        }
        var s = this,
            t = {
                afterLoadVideoItems: a.Callbacks()
            };
        s.init = function() {
            return s.settings = a.extend(!0, {}, a.fn.ytapi.defaults, e), s.youtubeApi = new a.fn.ytapi.youtubeApi(s.settings.apiKey), r(), o(), j(), k(), s
        }
    }
    a.fn.ytapi = function(b) {
        return this.each(function() {
            a(this).data("ytapi") || a(this).data("ytapi", new d(a(this), b).init())
        })
    }, a.fn.ytapi.youtubeApi = function(b) {
        function c(b, c, d) {
            return b.then(a.proxy(function(a) {
                var b = a.items[0].contentDetails.relatedPlaylists.uploads;
                return this.getPlaylistItems(b, c, d)
            }, this))
        }
        var d = "https://www.googleapis.com/youtube/v3/",
            e = function(c, e) {
                return e.key = b, a.getJSON(d + c, e)
            };
        this.getChannelByUsername = function(a) {
            return e("channels", {
                part: "contentDetails",
                forUsername: a
            })
        }, this.getChannelById = function(a) {
            return e("channels", {
                part: "contentDetails",
                id: a
            })
        }, this.getPlaylistItems = function(a, b, c) {
            return e("playlistItems", {
                part: "snippet",
                playlistId: a,
                maxResults: b,
                pageToken: c
            })
        }, this.getUploadsByUsername = function(a, b, d) {
            return c.call(this, this.getChannelByUsername(a), b, d)
        }, this.getUploadsByChannelId = function(a, b, d) {
            return c.call(this, this.getChannelById(a), b, d)
        }
    }, a.fn.ytapi.defaults = {
        apiKey: null,
        playlistId: null,
        username: null,
        channelId: null,
        itemsPerPage: 5,
        embedVideo: !0,
        autoplay: 1,
        embedVideoBaseUrl: "https://www.youtube.com/embed/",
        mediaViewer: null,
        watchVideoBaseUrl: "https://www.youtube.com/watch?v=",
        showVideoTitle: !1,
        showVideoDescription: !1,
        loadingControl: null,
        loadingControlAnimationSpeed: 100,
        prevPageControl: null,
        nextPageControl: null,
        pageControlDisabledClass: "disabled",
        videoItemContainerClass: "video-item",
        videoItemActiveClass: "active",
        templates: {
            player: '<iframe frameborder="0" allowfullscreen ?autoplay=1></iframe>',
            thumbnail: '<img src="{{image_default}}">',
            autoplay: 1,
            videoMedia: '<span class="media">{{media}}</span>',
            videoTitle: '<span class="title">{{title}}</span>',
            videoDescription: '<span class="description">{{description}}</span>',
            videoItem: "{{video_media}}{{video_title}}{{video_description}}",
            noVideos: '<p class="no-videos">Sorry, there are no videos to show.</p>'
        }
    }
}(jQuery, window);