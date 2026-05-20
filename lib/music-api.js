"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMusic = searchMusic;
exports.getTrackByTitle = getTrackByTitle;
exports.searchAlbums = searchAlbums;
exports.getAlbumTracks = getAlbumTracks;
exports.getAlbumInfo = getAlbumInfo;
exports.searchTracks = searchTracks;
exports.getTopSongsByRegion = getTopSongsByRegion;
exports.getArtistTracks = getArtistTracks;
exports.getArtistTracksById = getArtistTracksById;
exports.getArtistAlbumsById = getArtistAlbumsById;
exports.searchArtistImage = searchArtistImage;
exports.fetchLyrics = fetchLyrics;
exports.getMockLyrics = getMockLyrics;
exports.searchArtists = searchArtists;
function searchMusic(term_1) {
    return __awaiter(this, arguments, void 0, function (term, limit, country) {
        var response, text, data, error_1;
        if (limit === void 0) { limit = 20; }
        if (country === void 0) { country = 'VN'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(term), "&entity=song&limit=").concat(limit, "&country=").concat(country))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('iTunes API rate limit exceeded (429).');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes response:', text);
                        return [2 /*return*/, []];
                    }
                    if (!data.results)
                        return [2 /*return*/, []];
                    return [2 /*return*/, data.results.map(function (item) { return ({
                            id: String(item.trackId),
                            title: item.trackName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            album: item.collectionName,
                            artworkUrl100: item.artworkUrl100,
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            duration: Math.floor(item.trackTimeMillis / 1000),
                            url: item.previewUrl,
                        }); })];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching from iTunes:', error_1);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getTrackByTitle(title_1) {
    return __awaiter(this, arguments, void 0, function (title, country) {
        var results, exactMatch;
        if (country === void 0) { country = 'VN'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchMusic(title, 10, country)];
                case 1:
                    results = _a.sent();
                    if (results.length === 0)
                        return [2 /*return*/, null];
                    exactMatch = results.find(function (track) { return track.title.toLowerCase().trim() === title.toLowerCase().trim(); });
                    return [2 /*return*/, exactMatch !== null && exactMatch !== void 0 ? exactMatch : results[0]];
            }
        });
    });
}
function searchAlbums(term_1) {
    return __awaiter(this, arguments, void 0, function (term, limit, country) {
        var fetchLimit, response, text, data, albumResults, error_2;
        if (limit === void 0) { limit = 10; }
        if (country === void 0) { country = 'VN'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    fetchLimit = Math.max(limit * 2, 20);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(term), "&entity=album&limit=").concat(fetchLimit, "&country=").concat(country))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('iTunes API rate limit exceeded (429).');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes response:', text);
                        return [2 /*return*/, []];
                    }
                    if (!data.results)
                        return [2 /*return*/, []];
                    albumResults = data.results.filter(function (item) { return item.collectionType === 'Album'; });
                    return [2 /*return*/, albumResults.slice(0, limit).map(function (item) { return ({
                            id: String(item.collectionId),
                            title: item.collectionName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            type: 'album',
                            release_date: item.releaseDate,
                        }); })];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error fetching albums from iTunes:', error_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAlbumTracks(collectionId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/lookup?id=".concat(collectionId, "&entity=song"))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('iTunes API rate limit exceeded (429).');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes response:', text);
                        return [2 /*return*/, []];
                    }
                    if (!data.results)
                        return [2 /*return*/, []
                            // The first result is the album info, the rest are tracks
                        ];
                    // The first result is the album info, the rest are tracks
                    return [2 /*return*/, data.results.filter(function (item) { return item.wrapperType === 'track'; }).map(function (item) { return ({
                            id: String(item.trackId),
                            title: item.trackName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            album: item.collectionName,
                            artworkUrl100: item.artworkUrl100,
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            duration: Math.floor(item.trackTimeMillis / 1000),
                            url: item.previewUrl,
                        }); })];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error fetching album tracks from iTunes:', error_3);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getAlbumInfo(collectionId) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, data, item, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/lookup?id=".concat(collectionId))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = JSON.parse(text);
                    if (!data.results || data.results.length === 0)
                        return [2 /*return*/, null];
                    item = data.results[0];
                    return [2 /*return*/, {
                            id: String(item.collectionId),
                            title: item.collectionName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            release_date: item.releaseDate,
                            genre: item.primaryGenreName,
                        }];
                case 3:
                    error_4 = _a.sent();
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function searchTracks(term_1) {
    return __awaiter(this, arguments, void 0, function (term, limit, country) {
        if (limit === void 0) { limit = 20; }
        if (country === void 0) { country = 'VN'; }
        return __generator(this, function (_a) {
            return [2 /*return*/, searchMusic(term, limit, country)];
        });
    });
}
function getTopSongsByRegion() {
    return __awaiter(this, arguments, void 0, function (region, limit) {
        var terms, countryCodes;
        if (region === void 0) { region = 'vn'; }
        if (limit === void 0) { limit = 20; }
        return __generator(this, function (_a) {
            terms = {
                'VN': 'Xu hướng hiện nay',
                'GLOBAL': 'Trending Now',
                'USUK': 'Trending US UK',
                'KPOP': 'K-Pop Trending'
            };
            countryCodes = {
                'vn': 'VN',
                'global': 'US',
                'usuk': 'US',
                'kpop': 'KR'
            };
            return [2 /*return*/, searchMusic(terms[region.toUpperCase()] || 'Trending Now', limit, countryCodes[region.toLowerCase()] || 'US')];
        });
    });
}
function getArtistTracks(artistName_1) {
    return __awaiter(this, arguments, void 0, function (artistName, limit) {
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            return [2 /*return*/, searchMusic(artistName, limit, 'VN')];
        });
    });
}
function getArtistTracksById(artistId_1) {
    return __awaiter(this, arguments, void 0, function (artistId, limit) {
        var response, text, data, error_5;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/lookup?id=".concat(artistId, "&entity=song&limit=").concat(limit))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = JSON.parse(text);
                    if (!data.results)
                        return [2 /*return*/, []];
                    return [2 /*return*/, data.results.filter(function (item) { return item.wrapperType === 'track'; }).map(function (item) { return ({
                            id: String(item.trackId),
                            title: item.trackName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            album: item.collectionName,
                            artworkUrl100: item.artworkUrl100,
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            duration: Math.floor(item.trackTimeMillis / 1000),
                            url: item.previewUrl,
                        }); })];
                case 3:
                    error_5 = _a.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getArtistAlbumsById(artistId_1) {
    return __awaiter(this, arguments, void 0, function (artistId, limit) {
        var response, text, data, error_6;
        if (limit === void 0) { limit = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/lookup?id=".concat(artistId, "&entity=album&limit=").concat(limit))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = JSON.parse(text);
                    if (!data.results)
                        return [2 /*return*/, []];
                    return [2 /*return*/, data.results.filter(function (item) { return item.collectionType === 'Album'; }).map(function (item) { return ({
                            id: String(item.collectionId),
                            title: item.collectionName,
                            artist: item.artistName,
                            artistId: String(item.artistId),
                            albumArt: item.artworkUrl100.replace('100x100', '600x600'),
                            type: 'album',
                            release_date: item.releaseDate,
                        }); })];
                case 3:
                    error_6 = _a.sent();
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function searchArtistImage(artistName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, data, songResponse, songText, songData, songResponse, songText, songData, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 9, , 10]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(artistName), "&entity=musicArtist&limit=1"))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('iTunes API rate limit exceeded (429).');
                        return [2 /*return*/, ''];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes artist response:', text);
                        return [2 /*return*/, ''];
                    }
                    if (!(data.results.length === 0)) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(artistName), "&entity=song&limit=1"))];
                case 3:
                    songResponse = _a.sent();
                    return [4 /*yield*/, songResponse.text()];
                case 4:
                    songText = _a.sent();
                    songData = void 0;
                    try {
                        songData = JSON.parse(songText);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes song response:', songText);
                        return [2 /*return*/, ''];
                    }
                    if (songData.results.length > 0) {
                        return [2 /*return*/, songData.results[0].artworkUrl100.replace('100x100', '600x600')];
                    }
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(artistName), "&entity=song&limit=1"))];
                case 6:
                    songResponse = _a.sent();
                    return [4 /*yield*/, songResponse.text()];
                case 7:
                    songText = _a.sent();
                    songData = void 0;
                    try {
                        songData = JSON.parse(songText);
                    }
                    catch (e) {
                        console.error('Failed to parse iTunes song response:', songText);
                        return [2 /*return*/, ''];
                    }
                    if (songData.results.length > 0) {
                        return [2 /*return*/, songData.results[0].artworkUrl100.replace('100x100', '600x600')];
                    }
                    _a.label = 8;
                case 8: return [2 /*return*/, ''];
                case 9:
                    error_7 = _a.sent();
                    console.error('Error fetching artist image:', error_7);
                    return [2 /*return*/, ''];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function fetchLyrics(artist, title) {
    return __awaiter(this, void 0, void 0, function () {
        var response, text, data, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://api.lyrics.ovh/v1/".concat(encodeURIComponent(artist), "/").concat(encodeURIComponent(title)))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('Lyrics API rate limit exceeded (429).');
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = void 0;
                    try {
                        data = JSON.parse(text);
                    }
                    catch (e) {
                        console.error('Failed to parse lyrics response:', text);
                        return [2 /*return*/, null];
                    }
                    return [2 /*return*/, data.lyrics || null];
                case 3:
                    error_8 = _a.sent();
                    console.error('Error fetching lyrics:', error_8);
                    return [2 /*return*/, null];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function getMockLyrics(title, artist) {
    return "[00:00.00] ".concat(title, " - ").concat(artist, "\n") +
        "[00:05.00] (Real-time lyrics from lyrics.ovh are currently unavailable for this track)\n" +
        "[00:10.00] VibeWave is bringing you the best music experience.\n" +
        "[00:15.00] Enjoy the rhythm and the flow.\n" +
        "[00:20.00] Vietnamese music is rising high.\n" +
        "[00:25.00] From \u0110en V\u00E2u to S\u01A1n T\u00F9ng M-TP.\n" +
        "[00:30.00] We support all your favorite artists.\n" +
        "[00:35.00] Keep listening and stay vibing.\n" +
        "[00:40.00] VibeWave: Your music, your way.";
}
function searchArtists(term_1) {
    return __awaiter(this, arguments, void 0, function (term, limit, country) {
        var response, text, data, error_9;
        var _this = this;
        if (limit === void 0) { limit = 10; }
        if (country === void 0) { country = 'VN'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://itunes.apple.com/search?term=".concat(encodeURIComponent(term), "&entity=musicArtist&limit=").concat(limit, "&country=").concat(country))];
                case 1:
                    response = _a.sent();
                    if (response.status === 429) {
                        console.error('iTunes API rate limit exceeded (429).');
                        return [2 /*return*/, []];
                    }
                    return [4 /*yield*/, response.text()];
                case 2:
                    text = _a.sent();
                    data = JSON.parse(text);
                    if (!data.results)
                        return [2 /*return*/, []];
                    return [2 /*return*/, Promise.all(data.results.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                            var artwork;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, searchArtistImage(item.artistName)];
                                    case 1:
                                        artwork = _a.sent();
                                        return [2 /*return*/, {
                                                id: String(item.artistId),
                                                name: item.artistName,
                                                genre: item.primaryGenreName || 'Nghệ sĩ',
                                                image: artwork || undefined
                                            }];
                                }
                            });
                        }); }))];
                case 3:
                    error_9 = _a.sent();
                    console.error('Error fetching artists from iTunes:', error_9);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
