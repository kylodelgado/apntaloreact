# Appodeal 3.5.0 Integration Plan

## Overview
This document outlines the integration plan for adding Appodeal SDK 3.5.0 to the React Native app alongside the existing IronSource LevelPlay and Google AdMob providers. The integration maintains the existing provider-agnostic architecture while adding Appodeal as a third option.

## Current Architecture Analysis

### Strengths of Current Setup:
- ✅ Provider-agnostic architecture with enum-based switching
- ✅ Centralized configuration management
- ✅ Development-friendly toggle system
- ✅ Clean separation of concerns
- ✅ React Native 0.76.6 compatibility
- ✅ Proper SDK lifecycle management

### Current Providers:
1. **IronSource LevelPlay** (3.1.0) - Primary
2. **Google AdMob** - Secondary/Fallback

## Appodeal Integration Plan

### Phase 1: Foundation Setup ✅ COMPLETED

**Files Modified:**
- `src/config/ads.ts` - Added Appodeal configuration
- `package.json` - Added react-native-appodeal dependency
- `src/components/ads/BannerAd.tsx` - Added Appodeal banner support
- `App.tsx` - Added Appodeal SDK initialization
- `src/components/ads/AdProviderToggle.tsx` - Added Appodeal to toggle
- `ios/Podfile` - Prepared Appodeal pods (commented)

**Appodeal Configuration:**
```typescript
export const APPODEAL_CONFIG = {
  APP_KEY: '99d1e968532806a1924cae1ce23246abbe6bb691481c7018',
  TEST_MODE: __DEV__,
  LOG_LEVEL: __DEV__ ? 'verbose' : 'none',
  AUTOCACHE: true,
  CONSENT: {
    GDPR_ENABLED: true,
    CCPA_ENABLED: true,
  },
};
```

### Phase 2: Installation & Setup

#### Step 1: Install Dependencies
```bash
# Install React Native package
npm install react-native-appodeal@3.5.0

# For iOS - Install pods
cd ios && pod install
```

#### Step 2: Enable Appodeal Pods (iOS)
Uncomment the Appodeal pods in `ios/Podfile`:
```ruby
pod 'Appodeal', '3.5.0'
pod 'APDBidMachineAdapter', '3.5.0.0'     # BidMachine - Appodeal's own demand source
pod 'APDAppLovinAdapter', '3.5.0.0'       # AppLovin MAX mediation
pod 'APDVungleAdapter', '3.5.0.0'         # Vungle/Liftoff adapter  
pod 'APDInMobiAdapter', '3.5.0.0'         # InMobi adapter
pod 'APDMyTargetAdapter', '3.5.0.0'       # MyTarget adapter
pod 'APDMintegralAdapter', '3.5.0.0'      # Mintegral adapter
pod 'APDAmazonAdapter', '3.5.0.0'         # Amazon Publisher Services
pod 'APDSmaatoAdapter', '3.5.0.0'         # Smaato adapter
pod 'APDYandexAdapter', '3.5.0.0'         # Yandex adapter
pod 'APDPangleAdapter', '3.5.0.0'         # Pangle (TikTok) adapter
pod 'APDBigoAdsAdapter', '3.5.0.0'        # BigoAds adapter
pod 'APDDTExchangeAdapter', '3.5.0.0'     # DTExchange adapter
pod 'APDBidonAdapter', '3.5.0.0'          # Bidon mediation platform
```

#### Step 3: iOS Info.plist Configuration
Add to `ios/apntaloreact/Info.plist`:
```xml
<!-- Appodeal SKAdNetwork IDs -->
<key>SKAdNetworkItems</key>
<array>
    <!-- Add Appodeal's SKAdNetwork IDs -->
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>su67r6k2v3.skadnetwork</string>
    </dict>
    <!-- Add more SKAdNetwork IDs as provided by Appodeal -->
</array>

<!-- App Transport Security for Appodeal -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

#### Step 4: Android Configuration
Add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'com.appodeal.ads:sdk:3.5.0.0'
    // Add other Appodeal adapters as needed
}
```

Add to `android/build.gradle` (project level):
```gradle
allprojects {
    repositories {
        maven { url "https://artifactory.appodeal.com/appodeal" }
    }
}
```

### Phase 3: Testing Strategy

#### Step 1: Enable Appodeal Provider
In `src/config/ads.ts`:
```typescript
export const CURRENT_AD_PROVIDER: AdProvider = AdProvider.APPODEAL;
```

#### Step 2: Development Testing
1. Use the `AdProviderToggle` component to test switching between providers
2. Monitor console logs for initialization and ad events
3. Test banner loading, display, and click events

#### Step 3: Production Readiness
1. Set `TEST_MODE: false` in production builds
2. Configure proper GDPR/CCPA consent handling
3. Implement revenue tracking and analytics

### Phase 4: Advanced Features (Future)

#### Interstitial Ads Support
```typescript
// Add to APPODEAL_CONFIG
const adTypes = AppodealAdType.BANNER | AppodealAdType.INTERSTITIAL;
```

#### Rewarded Video Ads
```typescript
// Add to APPODEAL_CONFIG  
const adTypes = AppodealAdType.BANNER | AppodealAdType.INTERSTITIAL | AppodealAdType.REWARDED_VIDEO;
```

#### Native Ads Support
- Implement `AppodealNativeAd` component
- Add native ad templates and customization

## Recommended Adapters for Maximum Revenue

Based on the provided list and industry best practices:

### High Priority (Core Revenue Drivers):
1. **APDBidMachineAdapter** - Appodeal's own demand source
2. **APDAppLovinAdapter** - High-performing network
3. **APDVungleAdapter** - Video ad specialist
4. **APDInMobiAdapter** - Strong global coverage

### Medium Priority (Regional/Specific Markets):
5. **APDMyTargetAdapter** - Strong in CIS markets
6. **APDMintegralAdapter** - Asia-Pacific focus
7. **APDAmazonAdapter** - Premium demand
8. **APDSmaatoAdapter** - European focus

### Lower Priority (Testing/Specific Use Cases):
9. **APDYandexAdapter** - Russia/CIS specific
10. **APDPangleAdapter** - TikTok audience
11. **APDBigoAdsAdapter** - Emerging network
12. **APDDTExchangeAdapter** - Specialized demand

## Migration Strategy

### Gradual Rollout Approach:
1. **Week 1-2**: Internal testing with Appodeal
2. **Week 3**: Limited A/B testing (10% traffic)
3. **Week 4**: Expanded testing (25% traffic)
4. **Week 5+**: Full rollout based on performance metrics

### Rollback Plan:
- Keep existing IronSource/AdMob providers functional
- Implement feature flags for quick provider switching
- Monitor revenue and performance metrics

## Key Metrics to Monitor

### Revenue Metrics:
- eCPM comparison across providers
- Fill rates
- Click-through rates (CTR)
- Revenue per user (RPU)

### Technical Metrics:
- SDK initialization time
- Ad load latency
- Crash rates
- Memory usage

### User Experience:
- App startup time impact
- User engagement metrics
- App store ratings

## Risk Mitigation

### Technical Risks:
- **Multiple SDK conflicts**: Test thoroughly on different devices
- **Increased app size**: Monitor APK/IPA size impact
- **Performance degradation**: Implement performance monitoring

### Business Risks:
- **Revenue cannibalization**: Implement A/B testing
- **User experience impact**: Monitor engagement metrics
- **Policy compliance**: Ensure GDPR/CCPA compliance

## Success Criteria

### Primary Goals:
- [ ] Successful SDK integration without crashes
- [ ] Banner ads loading and displaying correctly
- [ ] Provider switching working seamlessly
- [ ] No significant performance degradation

### Secondary Goals:
- [ ] Revenue increase of 10%+ compared to current setup
- [ ] Fill rate improvement
- [ ] Reduced dependency on single provider

## Support and Documentation

### Resources:
- [Appodeal React Native Documentation](https://docs.appodeal.com/react-native)
- [Appodeal Dashboard](https://app.appodeal.com/)
- [GitHub Repository](https://github.com/appodeal/react-native-appodeal)

### Contact Information:
- Appodeal Support: [support@appodeal.com](mailto:support@appodeal.com)
- Integration Questions: Use the provided app key for support

## Conclusion

The Appodeal integration builds upon your existing solid architecture and provides:
1. **Diversified Revenue Sources**: Reduce dependency on single provider
2. **Competitive Advantage**: Access to Appodeal's unique demand
3. **Operational Flexibility**: Easy provider switching for optimization
4. **Future-Proof Architecture**: Ready for additional providers

The integration is designed to be **non-disruptive** and **reversible**, ensuring minimal risk while maximizing potential revenue growth. 