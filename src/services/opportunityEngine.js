"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateOpportunity = calculateOpportunity;
// Calculate opportunity scores from search results
function calculateOpportunity(books, keyword, searchSuggestions) {
    // Filter valid books
    var validBooks = books.filter(function (b) { return b.title && b.title.length > 3; });
    if (validBooks.length === 0) {
        return createEmptyOpportunity(keyword);
    }
    // Calculate averages
    var avgBsr = calculateAverage(validBooks.map(function (b) { return b.bsr; }).filter(Boolean));
    var avgReviews = calculateAverage(validBooks.map(function (b) { return b.reviews; }));
    var avgRating = calculateAverage(validBooks.map(function (b) { return b.rating; }));
    var avgPrice = calculateAveragePrice(validBooks.map(function (b) { return b.price; }));
    // Count books with BSR (best sellers)
    var bestSellers = validBooks.filter(function (b) { return b.bsr && b.bsr < 10000; }).length;
    var topSellerShare = validBooks.length > 0 ? (bestSellers / validBooks.length) * 100 : 0;
    // Keyword expansion (search suggestions count)
    var keywordDensity = (searchSuggestions === null || searchSuggestions === void 0 ? void 0 : searchSuggestions.length) || 0;
    // === DEMAND SCORE ===
    // Lower BSR = higher demand
    // More keyword suggestions = higher demand
    var demandScore = calculateDemandScore(avgBsr, keywordDensity, validBooks.length);
    // === COMPETITION SCORE ===
    // Higher reviews = more competition
    // High ratings = mature market
    var competitionScore = calculateCompetitionScore(avgReviews, avgRating, topSellerShare);
    // === REVENUE SCORE ===
    // Higher price + estimated sales = higher revenue potential
    var estimatedMonthlySales = estimateMonthlySales(avgBsr, avgReviews);
    var estimatedRevenue = estimatedMonthlySales * avgPrice;
    var royaltyEstimate = estimatedRevenue * 0.70 * 0.35; // 70% royalty, 35% average
    var revenueScore = calculateRevenueScore(estimatedRevenue, avgPrice, royaltyEstimate);
    // === SATURATION SCORE ===
    // More books + high review saturation = oversaturated
    var saturationScore = calculateSaturationScore(validBooks.length, avgReviews, topSellerShare, avgRating);
    // === FINAL OPPORTUNITY SCORE ===
    // Weighted combination
    var opportunityScore = Math.round(demandScore * 0.25 +
        competitionScore * 0.20 +
        revenueScore * 0.30 +
        saturationScore * 0.25);
    // Risk level
    var riskLevel = calculateRiskLevel(opportunityScore, avgReviews, bestSellers);
    // Recommendation
    var recommendation = getRecommendation(opportunityScore, competitionScore, saturationScore, demandScore);
    // Generate indicators
    var indicators = generateIndicators(demandScore, competitionScore, revenueScore, saturationScore, avgBsr, avgReviews, avgRating, avgPrice);
    return {
        demandScore: demandScore,
        competitionScore: competitionScore,
        revenueScore: revenueScore,
        saturationScore: saturationScore,
        opportunityScore: opportunityScore,
        riskLevel: riskLevel,
        recommendation: recommendation,
        breakdown: {
            avgBsr: Math.round(avgBsr),
            avgReviews: Math.round(avgReviews * 10) / 10,
            avgRating: Math.round(avgRating * 10) / 10,
            avgPrice: Math.round(avgPrice * 100) / 100,
            totalBooks: validBooks.length,
            topSellerShare: Math.round(topSellerShare),
            keywordDensity: keywordDensity,
            competitionIntensity: getCompetitionIntensity(avgReviews),
            estimatedMonthlySales: Math.round(estimatedMonthlySales),
            estimatedRevenue: Math.round(estimatedRevenue),
            royaltyEstimate: Math.round(royaltyEstimate),
        },
        indicators: indicators,
        emoji: recommendation.emoji,
        label: recommendation.title,
    };
}
// Helper functions
function calculateAverage(numbers) {
    var valid = numbers.filter(function (n) { return n !== undefined && n !== null && n > 0; });
    if (valid.length === 0)
        return 0;
    return valid.reduce(function (a, b) { return a + b; }, 0) / valid.length;
}
function calculateAveragePrice(prices) {
    var total = 0;
    var count = 0;
    for (var _i = 0, prices_1 = prices; _i < prices_1.length; _i++) {
        var price = prices_1[_i];
        if (!price)
            continue;
        var match = price.match(/[\d,.]+/);
        if (match) {
            var num = parseFloat(match[0].replace(/,/g, ''));
            if (num > 0 && num < 1000) { // Reasonable book price
                total += num;
                count++;
            }
        }
    }
    return count > 0 ? total / count : 9.99;
}
function calculateDemandScore(avgBsr, keywordDensity, totalBooks) {
    // BSR factor (lower is better) - normalize 1-1M to 0-100
    var bsrFactor = avgBsr > 0 ? Math.max(0, 100 - Math.log10(avgBsr) * 10) : 50;
    // Keyword density factor (more suggestions = more demand)
    var keywordFactor = Math.min(100, keywordDensity * 10);
    // Inventory factor (some competition is good)
    var inventoryFactor = totalBooks > 0 ? Math.min(100, totalBooks * 5) : 0;
    return Math.round(Math.min(100, (bsrFactor * 0.5) + (keywordFactor * 0.25) + (inventoryFactor * 0.25)));
}
function calculateCompetitionScore(avgReviews, avgRating, topSellerShare) {
    // Review count factor (more reviews = more competition)
    var reviewFactor = Math.min(100, Math.log10(avgReviews + 1) * 20);
    // Rating factor (high ratings = mature/hard market)
    var ratingFactor = avgRating * 20;
    // Top seller dominance (high = hard to compete)
    var dominanceFactor = Math.min(100, topSellerShare * 0.5);
    return Math.round(Math.min(100, reviewFactor + ratingFactor + dominanceFactor));
}
function calculateRevenueScore(estimatedRevenue, avgPrice, royaltyEstimate) {
    // Price factor (higher price = higher margin potential)
    var priceFactor = avgPrice > 0 ? Math.min(100, (avgPrice / 29.99) * 100) : 30;
    // Revenue factor
    var revenueFactor = estimatedRevenue > 0 ? Math.min(100, Math.log10(estimatedRevenue + 1) * 15) : 20;
    // Royalty factor
    var royaltyFactor = Math.min(100, royaltyEstimate > 0 ? Math.min(100, royaltyEstimate / 10) : 20);
    return Math.round((priceFactor * 0.3) + (revenueFactor * 0.35) + (royaltyFactor * 0.35));
}
function calculateSaturationScore(totalBooks, avgReviews, topSellerShare, avgRating) {
    // Book count factor
    var countFactor = Math.min(100, totalBooks * 3);
    // Review saturation factor
    var reviewSaturation = Math.min(100, Math.log10(avgReviews + 1) * 25);
    // Top seller dominance = established market
    var dominanceFactor = Math.min(100, topSellerShare * 0.8);
    // High ratings = mature, hard to break into
    var maturityFactor = avgRating > 4 ? 30 : avgRating > 3 ? 15 : 0;
    return Math.round(Math.min(100, countFactor * 0.3 + reviewSaturation * 0.25 + dominanceFactor * 0.25 + maturityFactor * 0.2));
}
function calculateRiskLevel(opportunityScore, avgReviews, bestSellers) {
    if (opportunityScore >= 70 && bestSellers >= 3)
        return 'low';
    if (opportunityScore >= 50 && bestSellers >= 1)
        return 'medium';
    return 'high';
}
function getCompetitionIntensity(avgReviews) {
    if (avgReviews < 100)
        return 'low';
    if (avgReviews < 1000)
        return 'medium';
    return 'high';
}
function estimateMonthlySales(avgBsr, avgReviews) {
    // Simple BSR to sales estimate
    // BSR ~100 = ~5000 sales/month
    // BSR ~1000 = ~1000 sales/month
    // BSR ~10000 = ~200 sales/month
    if (!avgBsr || avgBsr <= 0)
        return avgReviews * 0.5; // Fallback estimate
    return Math.max(10, Math.round(500000 / Math.sqrt(avgBsr)));
}
function getRecommendation(opportunityScore, competitionScore, saturationScore, demandScore) {
    // Strong opportunity: high demand, low competition, unsaturated
    if (demandScore >= 60 && competitionScore <= 40 && saturationScore <= 40) {
        return {
            action: 'strong_opportunity',
            title: '🔥 Strong Opportunity',
            description: 'High demand with manageable competition. Good entry potential.',
            color: '#10b981',
            bgColor: '#d1fae5',
            emoji: '🔥',
        };
    }
    // Emerging trend: high demand, new market
    if (demandScore >= 50 && saturationScore <= 30) {
        return {
            action: 'emerging_trend',
            title: '🚀 Emerging Trend',
            description: 'Growing market with low saturation. Early mover advantage.',
            color: '#8b5cf6',
            bgColor: '#ede9fe',
            emoji: '🚀',
        };
    }
    // Medium competition: balanced
    if (competitionScore > 40 && competitionScore <= 70) {
        return {
            action: 'medium_competition',
            title: '⚠ Medium Competition',
            description: 'Established market with room for differentiation.',
            color: '#f59e0b',
            bgColor: '#fef3c7',
            emoji: '⚠',
        };
    }
    // Oversaturated: high competition, high saturation
    if (saturationScore >= 70 || competitionScore >= 70) {
        return {
            action: 'oversaturated',
            title: '❌ Oversaturated',
            description: 'Too many competitors. Consider sub-niche or different approach.',
            color: '#ef4444',
            bgColor: '#fee2e2',
            emoji: '❌',
        };
    }
    // Niche play: opportunity but low demand
    if (opportunityScore >= 40 && demandScore < 40) {
        return {
            action: 'niche_play',
            title: '🎯 Niche Play',
            description: 'Small but dedicated audience. Quality over quantity.',
            color: '#06b6d4',
            bgColor: '#cffafe',
            emoji: '🎯',
        };
    }
    // Avoid
    return {
        action: 'avoid',
        title: '⛔ Avoid',
        description: 'Low opportunity. Consider different keywords.',
        color: '#6b7280',
        bgColor: '#f3f4f6',
        emoji: '⛔',
    };
}
function generateIndicators(demandScore, competitionScore, revenueScore, saturationScore, avgBsr, avgReviews, avgRating, avgPrice) {
    var indicators = [];
    if (demandScore >= 60)
        indicators.push('📈 High demand');
    if (demandScore < 30)
        indicators.push('📉 Low demand');
    if (competitionScore < 40)
        indicators.push('🔓 Low competition');
    if (competitionScore >= 70)
        indicators.push('🔒 High competition');
    if (revenueScore >= 60)
        indicators.push('💰 High revenue potential');
    if (saturationScore < 30)
        indicators.push('🌱 Unsaturated market');
    if (saturationScore >= 70)
        indicators.push('🌊 Saturated market');
    if (avgBsr > 0 && avgBsr < 5000)
        indicators.push("\uD83D\uDCDA BSR #".concat(Math.round(avgBsr).toLocaleString()));
    if (avgReviews > 500)
        indicators.push("\u2B50 ".concat(Math.round(avgReviews), " avg reviews"));
    if (avgRating >= 4.5)
        indicators.push('⭐⭐⭐⭐⭐ High rated');
    if (avgPrice >= 20)
        indicators.push("\uD83D\uDCB5 Premium price ($".concat(Math.round(avgPrice), ")"));
    if (avgPrice < 10)
        indicators.push('💸 Budget-friendly');
    return indicators;
}
function createEmptyOpportunity(keyword) {
    return {
        demandScore: 0,
        competitionScore: 0,
        revenueScore: 0,
        saturationScore: 0,
        opportunityScore: 0,
        riskLevel: 'high',
        recommendation: {
            action: 'avoid',
            title: '⛔ No Data',
            description: 'Unable to analyze this keyword.',
            color: '#6b7280',
            bgColor: '#f3f4f6',
            emoji: '⛔',
        },
        breakdown: {
            avgBsr: 0,
            avgReviews: 0,
            avgRating: 0,
            avgPrice: 0,
            totalBooks: 0,
            topSellerShare: 0,
            keywordDensity: 0,
            competitionIntensity: 'low',
            estimatedMonthlySales: 0,
            estimatedRevenue: 0,
            royaltyEstimate: 0,
        },
        indicators: ['⚠ No books found'],
        emoji: '⛔',
        label: 'No Data',
    };
}
