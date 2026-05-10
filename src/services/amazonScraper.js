"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchAmazonBooks = searchAmazonBooks;
exports.getBookDetails = getBookDetails;
exports.getAutocompleteSuggestions = getAutocompleteSuggestions;
exports.getReviews = getReviews;
exports.analyzeCompetition = analyzeCompetition;
exports.calculateOpportunityScore = calculateOpportunityScore;
var playwright_1 = require("playwright");
var cheerio = require("cheerio");
var AMAZON_MARKETPLACES = {
    'com': { baseUrl: 'https://www.amazon.com', name: 'Amazon.com (US)' },
    'co.uk': { baseUrl: 'https://www.amazon.co.uk', name: 'Amazon.co.uk (UK)' },
    'de': { baseUrl: 'https://www.amazon.de', name: 'Amazon.de (Germany)' },
    'it': { baseUrl: 'https://www.amazon.it', name: 'Amazon.it (Italy)' },
    'fr': { baseUrl: 'https://www.amazon.fr', name: 'Amazon.fr (France)' },
    'es': { baseUrl: 'https://www.amazon.es', name: 'Amazon.es (Spain)' },
};
// Browser instance singleton
var browser = null;
// Manual stealth implementation
function getBrowser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(!browser || !browser.isConnected())) return [3 /*break*/, 2];
                    return [4 /*yield*/, playwright_1.chromium.launch({
                            headless: true,
                            args: [
                                '--no-sandbox',
                                '--disable-setuid-scheduler',
                                '--disable-dev-shm-usage',
                                '--disable-gpu',
                                '--no-zygote',
                                '--disable-web-security',
                                '--disable-features=IsolateOrigins,site-per-process',
                                '--disable-background-networking',
                                '--disable-default-apps',
                                '--disable-extensions',
                                '--disable-sync',
                                '--disable-translate',
                                '--metrics-recording-only',
                                '--mute-audio',
                                '--no-first-run',
                                '--safebrowsing-disable-auto-update',
                                '--ignore-certificate-errors',
                                '--ignore-ssl-errors',
                                '--ignore-certificate-errors-spki-list',
                            ],
                        })];
                case 1:
                    // Stealth launch with anti-detection args
                    browser = _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/, browser];
            }
        });
    });
}
function closeBrowser() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!browser) return [3 /*break*/, 2];
                    return [4 /*yield*/, browser.close()];
                case 1:
                    _a.sent();
                    browser = null;
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
// Get random delay for anti-bot
function randomDelay(min, max) {
    if (min === void 0) { min = 1000; }
    if (max === void 0) { max = 3000; }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// AUTO-SCROLL: Lazy load dynamic content
function autoScroll(page) {
    return __awaiter(this, void 0, void 0, function () {
        var lastHeight, scrollCount, maxScrolls, positions, _i, positions_1, pos, newHeight, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 14, , 15]);
                    return [4 /*yield*/, page.evaluate(function () { return document.body.scrollHeight; })];
                case 1:
                    lastHeight = _a.sent();
                    scrollCount = 0;
                    maxScrolls = 5;
                    _a.label = 2;
                case 2:
                    if (!(scrollCount < maxScrolls)) return [3 /*break*/, 11];
                    positions = [
                        Math.random() * 0.3, // 0-30%
                        Math.random() * 0.5 + 0.3, // 30-80%
                        Math.random() * 0.7 + 0.3, // 30-100%
                        lastHeight - 500, // Near bottom
                    ];
                    _i = 0, positions_1 = positions;
                    _a.label = 3;
                case 3:
                    if (!(_i < positions_1.length)) return [3 /*break*/, 7];
                    pos = positions_1[_i];
                    return [4 /*yield*/, page.evaluate(function (y) { return window.scrollTo(0, y); }, pos * lastHeight)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(randomDelay(300, 600))];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7: 
                // Scroll back up a bit
                return [4 /*yield*/, page.evaluate(function () { return window.scrollTo(0, 0); })];
                case 8:
                    // Scroll back up a bit
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(randomDelay(200, 400))
                        // Check if new content loaded
                    ];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, page.evaluate(function () { return document.body.scrollHeight; })];
                case 10:
                    newHeight = _a.sent();
                    if (newHeight === lastHeight) {
                        // No new content, try a few more times
                        scrollCount++;
                    }
                    else {
                        lastHeight = newHeight;
                        scrollCount = 0;
                    }
                    return [3 /*break*/, 2];
                case 11: 
                // Final scroll to top
                return [4 /*yield*/, page.evaluate(function () { return window.scrollTo(0, 0); })];
                case 12:
                    // Final scroll to top
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(randomDelay(300, 500))];
                case 13:
                    _a.sent();
                    return [3 /*break*/, 15];
                case 14:
                    e_1 = _a.sent();
                    console.log('[SCROLL] Auto-scroll error:', e_1.message);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
// LIVE DOM EXTRACTION: Extract directly from browser
function extractFromLiveDOM(page, baseUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var books, selectors, _i, selectors_1, selector, elements, extracted, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    books = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    selectors = [
                        '[data-component-type="s-search-result"]',
                        '.s-result-item',
                        '.sg-col-inner',
                        'div[data-asin]',
                        '.a-card-container',
                    ];
                    _i = 0, selectors_1 = selectors;
                    _a.label = 2;
                case 2:
                    if (!(_i < selectors_1.length)) return [3 /*break*/, 6];
                    selector = selectors_1[_i];
                    return [4 /*yield*/, page.$$(selector)];
                case 3:
                    elements = _a.sent();
                    if (elements.length === 0)
                        return [3 /*break*/, 5];
                    console.log("[LIVE-DOM] ".concat(selector, ": ").concat(elements.length, " elements"));
                    return [4 /*yield*/, page.$$eval(selector, function (els, bUrl) {
                            return els.map(function (el) {
                                var _a, _b, _c, _d, _e;
                                // Get ASIN
                                var asin = el.getAttribute('data-asin') || '';
                                if (!asin || asin.length < 5)
                                    return null;
                                // Get title - try multiple methods
                                var titleEl = el.querySelector('h2 a span, .a-size-medium, .a-text-bold, h2');
                                var title = ((_a = titleEl === null || titleEl === void 0 ? void 0 : titleEl.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                                if (!title || title.length < 3)
                                    return null;
                                // Get URL
                                var linkEl = el.querySelector('h2 a, a.a-link-normal');
                                var url = (linkEl === null || linkEl === void 0 ? void 0 : linkEl.href) ? bUrl + linkEl.href.split('?')[0] : '';
                                // Get author
                                var authorEl = el.querySelector('.a-color-secondary, .a-size-base');
                                var author = ((_b = authorEl === null || authorEl === void 0 ? void 0 : authorEl.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || 'Unknown';
                                // Get price
                                var priceEl = el.querySelector('.a-price .a-offscreen, .a-price-whole, .a-price');
                                var price = ((_c = priceEl === null || priceEl === void 0 ? void 0 : priceEl.textContent) === null || _c === void 0 ? void 0 : _c.trim()) || '';
                                // Get rating - use aria-label
                                var ratingEl = el.querySelector('.a-icon-alt, [aria-label*="star"]');
                                var rating = 0;
                                if (ratingEl) {
                                    var match = (_d = ratingEl.textContent) === null || _d === void 0 ? void 0 : _d.match(/([\d.]+)/);
                                    if (match)
                                        rating = parseFloat(match[1]);
                                }
                                // Get reviews
                                var reviewEl = el.querySelector('.a-size-base.s-link-style, .s-underline-text, [aria-label*="review"]');
                                var reviews = 0;
                                if (reviewEl) {
                                    var text = ((_e = reviewEl.textContent) === null || _e === void 0 ? void 0 : _e.trim()) || '';
                                    var cleaned = text.replace(/[^0-9,]/g, '');
                                    reviews = parseInt(cleaned.replace(/,/g, '')) || 0;
                                }
                                // Get image
                                var imgEl = el.querySelector('img');
                                var imageUrl = (imgEl === null || imgEl === void 0 ? void 0 : imgEl.src) || (imgEl === null || imgEl === void 0 ? void 0 : imgEl.getAttribute('data-old-hi-res')) || '';
                                return {
                                    title: title,
                                    author: author,
                                    price: price,
                                    rating: rating,
                                    reviews: reviews,
                                    url: url,
                                    imageUrl: imageUrl,
                                    asin: asin,
                                };
                            }).filter(Boolean);
                        }, baseUrl)];
                case 4:
                    extracted = _a.sent();
                    if (extracted.length > 0) {
                        console.log("[LIVE-DOM] Extracted ".concat(extracted.length, " from ").concat(selector));
                        books.push.apply(books, extracted);
                        return [3 /*break*/, 6];
                    }
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 2];
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_2 = _a.sent();
                    console.log('[LIVE-DOM] Error:', e_2.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, books];
            }
        });
    });
}
// CHEERIO EXTRACTION: Fallback static HTML parsing
function extractFromCheerio($, html, baseUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var books, selectors, _i, selectors_2, selector, elements;
        return __generator(this, function (_a) {
            books = [];
            selectors = [
                '[data-component-type="s-search-result"]',
                '.s-result-item',
                '.sg-col-inner',
                'div[data-asin]',
            ];
            for (_i = 0, selectors_2 = selectors; _i < selectors_2.length; _i++) {
                selector = selectors_2[_i];
                elements = $(selector);
                if (elements.length === 0)
                    continue;
                elements.each(function (_, el) {
                    try {
                        var $el = $(el);
                        var asin = $el.attr('data-asin') || '';
                        if (!asin || asin.length < 5)
                            return;
                        var title = $el.find('h2 span, h2').first().text().trim();
                        if (!title || title.length < 3)
                            return;
                        var urlEl = $el.find('h2 a').first();
                        var url = urlEl.length ? baseUrl + (urlEl.attr('href') || '').split('?')[0] : '';
                        var author = $el.find('.a-color-secondary').first().text().trim() || 'Unknown';
                        var price = $el.find('.a-price').first().text().trim() || '';
                        var imgEl = $el.find('img').first();
                        var imageUrl = imgEl.attr('src') || imgEl.attr('data-old-hi-res') || '';
                        books.push({
                            title: title,
                            author: author,
                            price: price,
                            rating: 0,
                            reviews: 0,
                            url: url,
                            imageUrl: imageUrl,
                            asin: asin,
                        });
                    }
                    catch (e) { }
                });
                if (books.length > 0)
                    break;
            }
            return [2 /*return*/, books];
        });
    });
}
// MERGE: Combine live + cheerio extractions
function mergeExtractions(live, cheerio) {
    var merged = [];
    var seen = new Set();
    // Add live books first (they have more complete data)
    for (var _i = 0, live_1 = live; _i < live_1.length; _i++) {
        var book = live_1[_i];
        if (book.asin && !seen.has(book.asin)) {
            merged.push(book);
            seen.add(book.asin);
        }
    }
    // Add cheerio books that aren't already added
    for (var _a = 0, cheerio_1 = cheerio; _a < cheerio_1.length; _a++) {
        var book = cheerio_1[_a];
        if (book.asin && !seen.has(book.asin)) {
            merged.push(book);
            seen.add(book.asin);
        }
    }
    return merged;
}
// PRODUCT ENRICHMENT: Get detailed metadata from product pages
function enrichProduct(page, asin, baseUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var productUrl, details, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    productUrl = "".concat(baseUrl, "/dp/").concat(asin);
                    return [4 /*yield*/, page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 8000 })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, page.waitForTimeout(randomDelay(800, 1200))
                        // Extract detailed fields
                    ];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, page.$eval('body', function () {
                            var _a, _b, _c, _d, _e, _f;
                            var result = {};
                            // BSR - Best Seller Rank
                            var bsrCell = document.querySelector('[id*="SalesRank"], #SalesRank, [data-asin="' + asin + '"]')
                                || Array.from(document.querySelectorAll('#detailBullets_feature_div li')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('#'); });
                            if (bsrCell) {
                                var bsrMatch = (_a = bsrCell.textContent) === null || _a === void 0 ? void 0 : _a.match(/#([\d,]+)/);
                                if (bsrMatch)
                                    result.bsr = parseInt(bsrMatch[1].replace(/,/g, ''));
                            }
                            // Pages
                            var pagesEl = document.querySelector('#detailsInlineData, [data-asin="' + asin + '"]')
                                || Array.from(document.querySelectorAll('.a-text-bold')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('pages'); });
                            if (pagesEl) {
                                var pagesMatch = (_b = pagesEl.textContent) === null || _b === void 0 ? void 0 : _b.match(/(\d+)\s+pages?/);
                                if (pagesMatch)
                                    result.pages = parseInt(pagesMatch[1]);
                            }
                            // Publication date
                            var pubEl = Array.from(document.querySelectorAll('.a-text-bold')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/); });
                            if (pubEl)
                                result.publicationDate = (_c = pubEl.textContent) === null || _c === void 0 ? void 0 : _c.trim();
                            // Publisher
                            var pubEl2 = Array.from(document.querySelectorAll('.a-text-bold, #publisher ~ *')).find(function (el) { var _a, _b; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Publisher:')) || ((_b = el.className) === null || _b === void 0 ? void 0 : _b.includes('publisher')); });
                            if (pubEl2)
                                result.publisher = (_d = pubEl2.textContent) === null || _d === void 0 ? void 0 : _d.replace('Publisher:', '').trim();
                            // Format / Edition
                            var formatEl = Array.from(document.querySelectorAll('.a-text-bold')).find(function (el) { var _a, _b; return ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Edition')) || ((_b = el.textContent) === null || _b === void 0 ? void 0 : _b.includes('Format')); });
                            if (formatEl)
                                result.format = (_e = formatEl.textContent) === null || _e === void 0 ? void 0 : _e.trim();
                            // Language
                            var langEl = Array.from(document.querySelectorAll('.a-text-bold')).find(function (el) { var _a; return (_a = el.textContent) === null || _a === void 0 ? void 0 : _a.includes('Language'); });
                            if (langEl)
                                result.format = (_f = langEl.textContent) === null || _f === void 0 ? void 0 : _f.trim();
                            return result;
                        })];
                case 3:
                    details = _a.sent();
                    return [2 /*return*/, details];
                case 4:
                    e_3 = _a.sent();
                    console.log("[ENRICH] Failed to enrich ".concat(asin, ":"), e_3.message);
                    return [2 /*return*/, {}];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// CONCURRENT ENRICHMENT: Process multiple products with queue
function enrichProducts(page, asins, baseUrl, onProgress) {
    return __awaiter(this, void 0, void 0, function () {
        var enriched, concurrency, total, i, asin, details, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    enriched = new Map();
                    concurrency = 1 // Process 1 at a time (avoid anti-bot)
                    ;
                    total = Math.min(asins.length, 3) // Max 3 products for safety
                    ;
                    console.log("[ENRICH] Starting conservative enrichment: ".concat(total, " products"));
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < total)) return [3 /*break*/, 7];
                    asin = asins[i];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, enrichProduct(page, asin, baseUrl)];
                case 3:
                    details = _a.sent();
                    if (details && Object.keys(details).length > 0) {
                        enriched.set(asin, details);
                    }
                    // Progress callback
                    if (onProgress)
                        onProgress(i + 1, total);
                    // Long delay between requests (2-5 seconds)
                    return [4 /*yield*/, page.waitForTimeout(randomDelay(2000, 5000))];
                case 4:
                    // Long delay between requests (2-5 seconds)
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    e_4 = _a.sent();
                    console.log("[ENRICH] Failed ".concat(asin, ":"), e_4.message);
                    return [3 /*break*/, 6];
                case 6:
                    i += concurrency;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/, enriched];
            }
        });
    });
}
// SORT BY RELEVANCE: Prioritize books with highest engagement
function sortByRelevance(books) {
    return __spreadArray([], books, true).sort(function (a, b) {
        // Primary: reviews (most important signal)
        var reviewsA = a.reviews || 0;
        var reviewsB = b.reviews || 0;
        if (reviewsB !== reviewsA)
            return reviewsB - reviewsA;
        // Secondary: rating
        var ratingA = a.rating || 0;
        var ratingB = b.rating || 0;
        return ratingB - ratingA;
    });
}
// Extract ASIN from URL
// Extract ASIN from URL
function extractASIN(url) {
    var match = url.match(/\/dp\/([A-Z0-9]{10})/) || url.match(/\/gp\/product\/([A-Z0-9]{10})/);
    return match ? match[1] : '';
}
// Parse price string to number
function parsePrice(priceStr) {
    if (!priceStr)
        return 0;
    var cleaned = priceStr.replace(/[^0-9.,]/g, '').replace(',', '.');
    var match = cleaned.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
}
// Parse review count
function parseReviews(reviewStr) {
    if (!reviewStr)
        return 0;
    var cleaned = reviewStr.replace(/[^0-9,]/g, '');
    if (cleaned.includes(',')) {
        return parseInt(cleaned.replace(/,/g, '')) || 0;
    }
    return parseInt(cleaned) || 0;
}
function searchAmazonBooks(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, page, marketplace) {
        var startTime, marketplaceConfig, viewports, viewport, userAgents, userAgent, browser_1, context, page_instance, encodedKeyword, searchUrl, e_5, html, $, pageTitle, isBlocked, screenshot, e_6, noResults, liveBooks, cheerioBooks, e_7, books, basicBooks, enrichedBooks, enrichmentStatus, enrichedCount_1, sortedBooks, topAsins, enrichedMap_1, e_8, finalBooks, completeBooks, missingTitle, missingPrice, missingRating, missingReviews, missingImage, missingUrl, missingAsin, validBooks, _i, enrichedBooks_1, book, hasTitle, hasPrice, hasRating, hasReviews, hasImage, hasUrl, hasAsin, finalList, totalFields, filledFields, completeness, totalResults, resultsCountEl, resultsText, totalMatch, error_1;
        if (page === void 0) { page = 1; }
        if (marketplace === void 0) { marketplace = 'com'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = Date.now();
                    marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com'];
                    viewports = [
                        { width: 1920, height: 1080 },
                        { width: 1366, height: 768 },
                        { width: 1440, height: 900 },
                        { width: 1536, height: 864 },
                    ];
                    viewport = viewports[Math.floor(Math.random() * viewports.length)];
                    userAgents = [
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
                    ];
                    userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 32, , 33]);
                    return [4 /*yield*/, getBrowser()];
                case 2:
                    browser_1 = _a.sent();
                    return [4 /*yield*/, browser_1.newContext({
                            viewport: viewport,
                            userAgent: userAgent,
                            // Stealth: Locale settings
                            locale: 'en-US',
                            timezoneId: 'America/New_York',
                            permissions: ['geolocation'],
                            // Stealth: Extra headers
                            extraHTTPHeaders: {
                                'Accept-Language': 'en-US,en;q=0.9',
                                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            },
                        })];
                case 3:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()
                        // Stealth: Remove webdriver property
                    ];
                case 4:
                    page_instance = _a.sent();
                    // Stealth: Remove webdriver property
                    return [4 /*yield*/, page_instance.addInitScript(function () {
                            Object.defineProperty(navigator, 'webdriver', { get: function () { return undefined; } });
                        })
                        // Build search URL
                    ];
                case 5:
                    // Stealth: Remove webdriver property
                    _a.sent();
                    encodedKeyword = encodeURIComponent(keyword);
                    searchUrl = "".concat(marketplaceConfig.baseUrl, "/s?k=").concat(encodedKeyword, "&i=books&page=").concat(page, "&ref=nb_sb_noss");
                    console.log("Searching: ".concat(searchUrl));
                    console.log("[STEALTH] User-Agent: ".concat(userAgent.substring(0, 30), "..."));
                    return [4 /*yield*/, page_instance.goto(searchUrl, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        })
                        // Random delay before interaction
                    ];
                case 6:
                    _a.sent();
                    // Random delay before interaction
                    return [4 /*yield*/, page_instance.waitForTimeout(randomDelay(1500, 2500))
                        // AUTO-SCROLL: Lazy load dynamic content
                    ];
                case 7:
                    // Random delay before interaction
                    _a.sent();
                    // AUTO-SCROLL: Lazy load dynamic content
                    console.log('[SCROLL] Starting auto-scroll...');
                    return [4 /*yield*/, autoScroll(page_instance)];
                case 8:
                    _a.sent();
                    console.log('[SCROLL] Auto-scroll complete');
                    // Stealth: Simulate human behavior - move mouse
                    return [4 /*yield*/, page_instance.mouse.move(Math.random() * 500, Math.random() * 500)];
                case 9:
                    // Stealth: Simulate human behavior - move mouse
                    _a.sent();
                    return [4 /*yield*/, page_instance.waitForTimeout(randomDelay(200, 500))
                        // Try to handle any overlays
                    ];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    _a.trys.push([11, 13, , 14]);
                    return [4 /*yield*/, page_instance.click('body', { timeout: 2000 }).catch(function () { })];
                case 12:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 13:
                    e_5 = _a.sent();
                    return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, page_instance.content()];
                case 15:
                    html = _a.sent();
                    $ = cheerio.load(html);
                    pageTitle = $('title').text();
                    console.log("[SCRAPER] Page title: ".concat(pageTitle.substring(0, 50)));
                    console.log("[SCRAPER] Raw HTML length: ".concat(html.length));
                    isBlocked = (pageTitle.toLowerCase().includes('robot') ||
                        pageTitle.toLowerCase().includes('captcha') ||
                        pageTitle.toLowerCase().includes('sorry') ||
                        pageTitle.toLowerCase().includes('verify') ||
                        pageTitle.toLowerCase().includes('challenge') ||
                        html.includes('captcha') ||
                        html.includes('sorry') && html.includes('interpret') ||
                        html.includes('Verify you are human') ||
                        html.includes('checking your browser') ||
                        html.includes('one-time'));
                    if (!isBlocked) return [3 /*break*/, 21];
                    console.log('[SCRAPER] 🚫 BLOCKED: Amazon anti-bot detected');
                    console.log('[SCRAPER] Page title:', pageTitle.substring(0, 80));
                    _a.label = 16;
                case 16:
                    _a.trys.push([16, 18, , 19]);
                    return [4 /*yield*/, page_instance.screenshot()];
                case 17:
                    screenshot = _a.sent();
                    console.log("[SCRAPER] Screenshot available: ".concat(screenshot.length, " bytes"));
                    return [3 /*break*/, 19];
                case 18:
                    e_6 = _a.sent();
                    return [3 /*break*/, 19];
                case 19: return [4 /*yield*/, context.close()];
                case 20:
                    _a.sent();
                    return [2 /*return*/, {
                            books: [],
                            totalResults: 0,
                            keyword: keyword,
                            searchTime: Date.now() - startTime,
                            page: page,
                            marketplace: marketplaceConfig.name,
                            blocked: true,
                            blockReason: pageTitle.substring(0, 50) || 'Amazon anti-bot triggered',
                        }];
                case 21:
                    noResults = html.includes('No results for') || html.includes('nessun risultato') || html.includes('Aucun résultat');
                    if (noResults) {
                        console.log('[SCRAPER] No results found');
                    }
                    // LIVE DOM EXTRACTION: Extract directly from browser DOM
                    console.log('[EXTRACT] Starting live DOM extraction...');
                    return [4 /*yield*/, extractFromLiveDOM(page_instance, marketplaceConfig.baseUrl)];
                case 22:
                    liveBooks = _a.sent();
                    console.log("[EXTRACT] Live DOM got ".concat(liveBooks.length, " books"));
                    cheerioBooks = [];
                    _a.label = 23;
                case 23:
                    _a.trys.push([23, 25, , 26]);
                    return [4 /*yield*/, extractFromCheerio($, html, marketplaceConfig.baseUrl)];
                case 24:
                    cheerioBooks = _a.sent();
                    return [3 /*break*/, 26];
                case 25:
                    e_7 = _a.sent();
                    console.log('[EXTRACT] Cheerio extraction error:', e_7.message);
                    return [3 /*break*/, 26];
                case 26:
                    books = mergeExtractions(liveBooks, cheerioBooks);
                    console.log("[EXTRACT] Total merged books: ".concat(books.length));
                    basicBooks = books.filter(function (b) {
                        var _a, _b;
                        return b.title && b.title.length > 3 &&
                            (((_a = b.url) === null || _a === void 0 ? void 0 : _a.length) > 10 || ((_b = b.price) === null || _b === void 0 ? void 0 : _b.length) > 0);
                    }).map(function (b) { return (__assign(__assign({}, b), { status: 'basic' })); });
                    console.log("[SCRAPER] Basic books ready: ".concat(basicBooks.length));
                    enrichedBooks = basicBooks;
                    enrichmentStatus = 'pending';
                    enrichedCount_1 = 0;
                    sortedBooks = sortByRelevance(basicBooks);
                    if (!(sortedBooks.length >= 5)) return [3 /*break*/, 30];
                    console.log('[ENRICH] Starting background enrichment (top 3)...');
                    topAsins = sortedBooks.slice(0, 3).map(function (b) { return b.asin; }).filter(Boolean);
                    _a.label = 27;
                case 27:
                    _a.trys.push([27, 29, , 30]);
                    return [4 /*yield*/, enrichProducts(page_instance, topAsins, marketplaceConfig.baseUrl, function (current, total) { return console.log("[ENRICH] ".concat(current, "/").concat(total)); })
                        // Merge enriched data with status
                    ];
                case 28:
                    enrichedMap_1 = _a.sent();
                    // Merge enriched data with status
                    enrichedBooks = sortedBooks.map(function (book) {
                        var extra = enrichedMap_1.get(book.asin);
                        if (extra && Object.keys(extra).length > 0) {
                            enrichedCount_1++;
                            return __assign(__assign(__assign({}, book), extra), { status: extra.bsr ? 'enriched' : 'partial' });
                        }
                        return book;
                    });
                    enrichmentStatus = enrichedCount_1 > 0 ? 'complete' : 'partial';
                    console.log("[ENRICH] Enriched ".concat(enrichedCount_1, " products"));
                    return [3 /*break*/, 30];
                case 29:
                    e_8 = _a.sent();
                    console.log('[ENRICH] Error (keeping base data):', e_8.message);
                    enrichmentStatus = 'failed';
                    return [3 /*break*/, 30];
                case 30:
                    finalBooks = enrichedBooks.length > 0 ? enrichedBooks : basicBooks;
                    console.log("[SCRAPER] Final books: ".concat(finalBooks.length, " (status: ").concat(enrichmentStatus, ")"));
                    completeBooks = 0;
                    missingTitle = 0, missingPrice = 0, missingRating = 0, missingReviews = 0, missingImage = 0, missingUrl = 0, missingAsin = 0;
                    validBooks = [];
                    for (_i = 0, enrichedBooks_1 = enrichedBooks; _i < enrichedBooks_1.length; _i++) {
                        book = enrichedBooks_1[_i];
                        hasTitle = book.title && book.title.length > 3;
                        hasPrice = book.price && book.price.length > 0;
                        hasRating = book.rating > 0;
                        hasReviews = book.reviews > 0;
                        hasImage = book.imageUrl && book.imageUrl.length > 10;
                        hasUrl = book.url && book.url.length > 10;
                        hasAsin = book.asin && book.asin.length === 10;
                        if (!hasTitle)
                            missingTitle++;
                        if (!hasPrice)
                            missingPrice++;
                        if (!hasRating)
                            missingRating++;
                        if (!hasReviews)
                            missingReviews++;
                        if (!hasImage)
                            missingImage++;
                        if (!hasUrl)
                            missingUrl++;
                        if (!hasAsin)
                            missingAsin++;
                        // Valid book must have: title + (url OR price)
                        if (hasTitle && (hasUrl || hasPrice)) {
                            validBooks.push(book);
                            if (hasPrice && hasRating && hasReviews)
                                completeBooks++;
                        }
                    }
                    finalList = enrichedBooks.length > 0 ? enrichedBooks : basicBooks;
                    totalFields = finalList.length * 7 // 7 fields per book
                    ;
                    filledFields = (finalList.length - missingTitle) + (finalList.length - missingPrice) + (finalList.length - missingRating) +
                        (finalList.length - missingReviews) + (finalList.length - missingImage) +
                        (finalList.length - missingUrl) + (finalList.length - missingAsin);
                    completeness = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
                    console.log("[DIAGNOSTICS]\n  - Total extracted: ".concat(books.length, "\n  - Valid books: ").concat(finalList.length, "\n  - Complete books: ").concat(completeBooks, "\n  - Completeness: ").concat(completeness, "%\n  - Missing: title=").concat(missingTitle, ", price=").concat(missingPrice, ", rating=").concat(missingRating, ", reviews=").concat(missingReviews, ", image=").concat(missingImage, ", url=").concat(missingUrl, ", asin=").concat(missingAsin, "\n"));
                    totalResults = 0;
                    resultsCountEl = $('#s-results-count-left').first();
                    resultsText = resultsCountEl.text();
                    totalMatch = resultsText === null || resultsText === void 0 ? void 0 : resultsText.match(/([\d,]+)\s+result/);
                    if (totalMatch) {
                        totalResults = parseReviews(totalMatch[1]);
                    }
                    return [4 /*yield*/, context.close()];
                case 31:
                    _a.sent();
                    console.log("[SCRAPER] Extracted ".concat(finalList.length, " valid books"));
                    return [2 /*return*/, {
                            books: finalList.slice(0, 20),
                            totalResults: totalResults || finalList.length,
                            keyword: keyword,
                            searchTime: Date.now() - startTime,
                            page: page,
                            marketplace: marketplaceConfig.name,
                            debug: {
                                htmlLength: html.length,
                                pageTitle: $('title').text().substring(0, 50),
                                cardsFound: finalList.length,
                                extractionStatus: finalList.length > 0 ? 'success' : 'empty',
                                diagnostics: {
                                    totalExtracted: books.length,
                                    validBooks: finalList.length,
                                    completeBooks: completeBooks,
                                    completeness: completeness,
                                    missingTitle: missingTitle,
                                    missingPrice: missingPrice,
                                    missingRating: missingRating,
                                    missingReviews: missingReviews,
                                    missingImage: missingImage,
                                    missingUrl: missingUrl,
                                    missingAsin: missingAsin,
                                },
                            },
                        }];
                case 32:
                    error_1 = _a.sent();
                    console.error('Amazon search error:', error_1.message);
                    return [2 /*return*/, {
                            books: [],
                            totalResults: 0,
                            keyword: keyword,
                            searchTime: Date.now() - startTime,
                            page: page,
                            marketplace: marketplaceConfig.name,
                            blocked: error_1.message.includes('blocked') || error_1.message.includes('403'),
                            blockReason: error_1.message.includes('blocked') ? 'Amazon blocked' : 'Scraper error',
                            debug: {
                                htmlLength: 0,
                                pageTitle: 'Error',
                                cardsFound: 0,
                                extractionStatus: 'error',
                            },
                        }];
                case 33: return [2 /*return*/];
            }
        });
    });
}
function getBookDetails(asin_1) {
    return __awaiter(this, arguments, void 0, function (asin, marketplace) {
        var marketplaceConfig, browser_2, context, page_instance, url, html, $, title, author, authorEl, priceEl, price, ratingEl, ratingText, ratingMatch, rating, reviewsEl, reviewsText, reviews, imageEl, imageUrl, format, formatEl, pages, pagesEl, pagesText, pagesMatch, pubDateEl, publicationDate, error_2;
        if (marketplace === void 0) { marketplace = 'com'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, getBrowser()];
                case 2:
                    browser_2 = _a.sent();
                    return [4 /*yield*/, browser_2.newContext({
                            viewport: { width: 1920, height: 1080 },
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        })];
                case 3:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 4:
                    page_instance = _a.sent();
                    url = "".concat(marketplaceConfig.baseUrl, "/dp/").concat(asin);
                    console.log("Getting book details: ".concat(url));
                    return [4 /*yield*/, page_instance.goto(url, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page_instance.waitForTimeout(randomDelay(1500, 2500))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page_instance.content()];
                case 7:
                    html = _a.sent();
                    $ = cheerio.load(html);
                    title = $('#productTitle').text().trim() ||
                        $('h1#title').text().trim() ||
                        $('h1').text().trim();
                    author = '';
                    authorEl = $('#bylineAuthor, .author .a-link-normal').first();
                    author = authorEl.text().trim();
                    if (!author) {
                        author = $('.contributorName').first().text().trim();
                    }
                    priceEl = $('.a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice').first();
                    price = priceEl.text().trim() ||
                        $('.a-color-price').first().text().trim();
                    ratingEl = $('#avgRating, .a-icon-alt').first();
                    ratingText = ratingEl.text().trim();
                    ratingMatch = ratingText === null || ratingText === void 0 ? void 0 : ratingText.match(/([\d.]+)/);
                    rating = ratingMatch ? parseFloat(ratingMatch[1]) : 0;
                    reviewsEl = $('#totalReviewCount, #acrCustomerReviewLink').first();
                    reviewsText = reviewsEl.text().trim();
                    reviews = parseReviews(reviewsText);
                    imageEl = $('#landingImage, #imgBlkFront').first();
                    imageUrl = imageEl.attr('src') || '';
                    format = '';
                    formatEl = $('[data-asin-format], .format').first();
                    format = formatEl.text().trim();
                    pages = void 0;
                    pagesEl = $('[data-asin-pagecount], .page-count').first();
                    pagesText = pagesEl.text().trim();
                    pagesMatch = pagesText === null || pagesText === void 0 ? void 0 : pagesText.match(/(\d+)/);
                    if (pagesMatch) {
                        pages = parseInt(pagesMatch[1]);
                    }
                    pubDateEl = $('#detailBullets_feature_div .a-text-bold').first();
                    publicationDate = pubDateEl.text().trim();
                    return [4 /*yield*/, context.close()];
                case 8:
                    _a.sent();
                    if (!title)
                        return [2 /*return*/, null];
                    return [2 /*return*/, {
                            title: title,
                            author: author || 'Unknown',
                            price: price,
                            rating: rating,
                            reviews: reviews,
                            url: url,
                            imageUrl: imageUrl,
                            asin: asin,
                            format: format || undefined,
                            pages: pages,
                            publicationDate: publicationDate || undefined,
                        }];
                case 9:
                    error_2 = _a.sent();
                    console.error('Book details error:', error_2.message);
                    return [2 /*return*/, null];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getAutocompleteSuggestions(keyword_1) {
    return __awaiter(this, arguments, void 0, function (keyword, marketplace) {
        var marketplaceConfig, browser_3, context, page_instance, url, html, $_1, suggestions_1, suggestionsEl, error_3;
        if (marketplace === void 0) { marketplace = 'com'; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com'];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, getBrowser()];
                case 2:
                    browser_3 = _a.sent();
                    return [4 /*yield*/, browser_3.newContext({
                            viewport: { width: 1920, height: 1080 },
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        })];
                case 3:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 4:
                    page_instance = _a.sent();
                    url = "".concat(marketplaceConfig.baseUrl, "/s?k=").concat(encodeURIComponent(keyword), "&i=books");
                    return [4 /*yield*/, page_instance.goto(url, {
                            waitUntil: 'domcontentloaded',
                            timeout: 15000
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page_instance.waitForTimeout(1000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page_instance.content()];
                case 7:
                    html = _a.sent();
                    $_1 = cheerio.load(html);
                    suggestions_1 = [];
                    suggestionsEl = $_1('.s-suggestion, .a-list-item .s-input-suggestions');
                    suggestionsEl.each(function (_, el) {
                        var text = $_1(el).text().trim();
                        if (text && text.length > 2) {
                            suggestions_1.push(text);
                        }
                    });
                    return [4 /*yield*/, context.close()];
                case 8:
                    _a.sent();
                    return [2 /*return*/, suggestions_1.slice(0, 10)];
                case 9:
                    error_3 = _a.sent();
                    console.error('Autocomplete error:', error_3.message);
                    return [2 /*return*/, []];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function getReviews(asin_1) {
    return __awaiter(this, arguments, void 0, function (asin, marketplace, maxReviews) {
        var marketplaceConfig, positive, negative, averageRating, browser_4, context, page_instance, url, html, $_2, ratingEl, ratingText, ratingMatch, reviewCards, error_4;
        if (marketplace === void 0) { marketplace = 'com'; }
        if (maxReviews === void 0) { maxReviews = 10; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    marketplaceConfig = AMAZON_MARKETPLACES[marketplace] || AMAZON_MARKETPLACES['com'];
                    positive = [];
                    negative = [];
                    averageRating = 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    return [4 /*yield*/, getBrowser()];
                case 2:
                    browser_4 = _a.sent();
                    return [4 /*yield*/, browser_4.newContext({
                            viewport: { width: 1920, height: 1080 },
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                        })];
                case 3:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 4:
                    page_instance = _a.sent();
                    url = "".concat(marketplaceConfig.baseUrl, "/product-reviews/").concat(asin);
                    return [4 /*yield*/, page_instance.goto(url, {
                            waitUntil: 'domcontentloaded',
                            timeout: 30000
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, page_instance.waitForTimeout(randomDelay(1500, 2500))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, page_instance.content()];
                case 7:
                    html = _a.sent();
                    $_2 = cheerio.load(html);
                    ratingEl = $_2('#averageCustomerReviews .a-icon-alt').first();
                    ratingText = ratingEl.text().trim();
                    ratingMatch = ratingText === null || ratingText === void 0 ? void 0 : ratingText.match(/([\d.]+)/);
                    if (ratingMatch) {
                        averageRating = parseFloat(ratingMatch[1]);
                    }
                    reviewCards = $_2('[data-hook="review"], .review');
                    reviewCards.each(function (i, el) {
                        if (i >= maxReviews)
                            return;
                        var reviewEl = $_2(el);
                        var text = reviewEl.find('[data-hook="review-body"], .review-text').text().trim();
                        if (!text)
                            return;
                        // Star rating
                        var stars = reviewEl.find('[data-hook="helpful-vote-stars"], .a-link-normal').text().trim();
                        var starMatch = stars === null || stars === void 0 ? void 0 : stars.match(/(\d+)/);
                        var starsCount = starMatch ? parseInt(starMatch[1]) : 0;
                        if (starsCount >= 4) {
                            positive.push(text);
                        }
                        else if (starsCount <= 2) {
                            negative.push(text);
                        }
                    });
                    return [4 /*yield*/, context.close()];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 9:
                    error_4 = _a.sent();
                    console.error('Reviews error:', error_4.message);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/, { positive: positive, negative: negative, averageRating: averageRating }];
            }
        });
    });
}
function analyzeCompetition(books) {
    if (!books || books.length === 0) {
        return {
            totalBooks: 0,
            avgPrice: 0,
            avgReviews: 0,
            avgRating: 0,
            priceRange: { min: 0, max: 0 },
            topAuthors: [],
            ratingDistribution: {},
        };
    }
    var totalPrice = 0;
    var totalReviews = 0;
    var totalRating = 0;
    var authors = {};
    var prices = [];
    var ratings = {};
    books.forEach(function (book) {
        // Price
        var price = parsePrice(book.price);
        if (price > 0) {
            totalPrice += price;
            prices.push(price);
        }
        // Reviews
        totalReviews += book.reviews;
        // Rating
        if (book.rating > 0) {
            totalRating += book.rating;
            var ratingKey = Math.floor(book.rating).toString();
            ratings[ratingKey] = (ratings[ratingKey] || 0) + 1;
        }
        // Author
        if (book.author && book.author !== 'Unknown') {
            authors[book.author] = (authors[book.author] || 0) + 1;
        }
    });
    var sortedAuthors = Object.entries(authors)
        .sort(function (a, b) { return b[1] - a[1]; })
        .slice(0, 5)
        .map(function (_a) {
        var author = _a[0];
        return author;
    });
    var sortedPrices = prices.sort(function (a, b) { return a - b; });
    return {
        totalBooks: books.length,
        avgPrice: prices.length > 0 ? totalPrice / prices.length : 0,
        avgReviews: totalReviews / books.length,
        avgRating: books.filter(function (b) { return b.rating > 0; }).length > 0 ? totalRating / books.filter(function (b) { return b.rating > 0; }).length : 0,
        priceRange: {
            min: sortedPrices[0] || 0,
            max: sortedPrices[sortedPrices.length - 1] || 0
        },
        topAuthors: sortedAuthors,
        ratingDistribution: ratings,
    };
}
function calculateOpportunityScore(avgReviews, avgRating, totalBooks) {
    var factors = [];
    var score = 50;
    // Low competition = high opportunity
    if (avgReviews < 50) {
        score += 20;
        factors.push('Low competition (few reviews)');
    }
    else if (avgReviews < 200) {
        score += 10;
        factors.push('Medium competition');
    }
    else {
        score -= 10;
        factors.push('High competition');
    }
    // Quality gap = opportunity
    if (avgRating < 4.0) {
        score += 15;
        factors.push('Quality gap available');
    }
    else if (avgRating < 4.5) {
        score += 5;
    }
    // Market size consideration
    if (totalBooks > 100) {
        score += 10;
        factors.push('Large market');
    }
    else if (totalBooks > 20) {
        score += 5;
    }
    else if (totalBooks < 5) {
        score -= 15;
        factors.push('Small market');
    }
    // Normalize score
    score = Math.max(0, Math.min(100, score));
    var level = 'Moderate';
    if (score >= 70)
        level = 'Excellent';
    else if (score >= 50)
        level = 'Good';
    else if (score < 30)
        level = 'Poor';
    return { score: score, level: level, factors: factors };
}
