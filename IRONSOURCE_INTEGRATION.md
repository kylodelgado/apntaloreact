# IronSource LevelPlay Integration Guide

## Overview
This document describes the integration of IronSource LevelPlay mediation SDK into the React Native app, with a toggle system to switch between Google AdMob and IronSource for banner ads.

## Integration Details

### App Configuration
- **IronSource App ID**: `2260b5485`
- **Banner Ad Unit ID**: `l5qm716vok36zdve`
- **Placement Name**: `DefaultBanner`
- **SDK Version**: `ironsource-mediation@3.1.0`

### Files Modified

#### 1. `package.json`
- Added `ironsource-mediation@3.1.0` dependency

#### 2. `src/config/ads.ts`
- Added `AdProvider` enum for switching between providers
- Added `CURRENT_AD_PROVIDER` toggle (set to `IRONSOURCE`)
- Added `IRONSOURCE_CONFIG` with app and ad unit configuration
- Maintained backward compatibility with existing AdMob configuration

#### 3. `src/components/ads/BannerAd.tsx`
- Completely rewritten to support both AdMob and IronSource
- Added IronSource `LevelPlayBannerAdView` component
- Added comprehensive event listeners for IronSource banner ads
- Implemented provider switching logic
- Added proper error handling and logging

#### 4. `App.tsx`
- Added conditional SDK initialization based on provider
- Integrated IronSource `LevelPlay.init()` with proper error handling
- Maintained backward compatibility with Google Mobile Ads

#### 5. `ios/apntaloreact/Info.plist`
- Added IronSource-required SKAdNetwork identifiers (44 networks)
- Added Universal SKAN reporting endpoint: `https://postbacks-is.com`
- Enabled `NSAllowsArbitraryLoads` for network compatibility
- Maintained existing Google AdMob configuration

#### 6. `src/components/ads/AdProviderToggle.tsx` (New)
- Development-only utility component for testing
- Visual indicator of current ad provider
- Instructions for switching providers

#### 7. `src/components/AdLayout.tsx`
- Added development toggle component for easy testing

## iOS Configuration

### SKAdNetwork IDs Added
The following SKAdNetwork IDs were added to support IronSource and mediated networks:
- `su67r6k2v3.skadnetwork` (IronSource)
- `4fzdc2evr5.skadnetwork` (Google)
- `v72qych5uu.skadnetwork` (Facebook)
- Plus 41 additional network IDs for comprehensive mediation support

### App Transport Security
- Set `NSAllowsArbitraryLoads` to `true` to support various ad networks
- Added Universal SKAN reporting for attribution

## Usage

### Switching Ad Providers
To switch between providers, modify `CURRENT_AD_PROVIDER` in `src/config/ads.ts`:

```typescript
// For IronSource LevelPlay
export const CURRENT_AD_PROVIDER: AdProvider = AdProvider.IRONSOURCE;

// For Google AdMob (fallback)
export const CURRENT_AD_PROVIDER: AdProvider = AdProvider.GOOGLE_ADMOB;
```

### Development Testing
- The `AdProviderToggle` component appears in development builds only
- Shows current provider and provides visual feedback
- Located in `AdLayout` component for easy access on all screens

## Implementation Features

### IronSource Banner Integration
- **Ad Size**: Standard banner (320x50)
- **Auto-loading**: Ads load automatically when component mounts
- **Event Tracking**: Comprehensive logging for all ad events
- **Error Handling**: Graceful fallback for failed ad loads

### Event Callbacks Implemented
- `onAdLoaded`: Banner successfully loaded
- `onAdLoadFailed`: Banner load failed
- `onAdDisplayed`: Banner displayed on screen
- `onAdDisplayFailed`: Banner display failed
- `onAdClicked`: User clicked the banner
- `onAdExpanded`: Banner expanded to fullscreen
- `onAdCollapsed`: Banner collapsed back to normal
- `onAdLeftApplication`: User left app via banner click

### Legacy Support
- Maintains full compatibility with existing Google AdMob implementation
- No breaking changes to existing ad placement logic
- All existing `AdLayout` usage remains unchanged

## Testing Checklist

### iOS Testing
- [ ] App launches successfully with IronSource provider
- [ ] Banner ads load on all screens
- [ ] No crashes during ad loading/display
- [ ] Console logs show IronSource events
- [ ] Switch provider toggle works in development

### Ad Events Testing
- [ ] Ad load success/failure logging
- [ ] Ad display events
- [ ] Ad interaction events (clicks)
- [ ] App backgrounding/foregrounding with ads

## Troubleshooting

### Common Issues
1. **No ads showing**: Check console for IronSource initialization errors
2. **App crashes**: Verify Info.plist SKAdNetwork configuration
3. **Network errors**: Ensure `NSAllowsArbitraryLoads` is set to `true`

### Debug Logging
All IronSource events are logged to console with prefix "IronSource Banner"

### Provider Verification
Check the `AdProviderToggle` component to confirm current provider setting

## Next Steps

### Future Enhancements
1. **Add Google AdMob as mediated network** through IronSource dashboard
2. **Implement interstitial ads** using IronSource LevelPlay
3. **Add rewarded video ads** for enhanced monetization
4. **Implement native ads** for better user experience
5. **Add impression-level revenue tracking**

### Mediation Setup
1. Configure Google AdMob in IronSource dashboard
2. Set up waterfall configuration
3. Enable bidding networks for optimal revenue
4. Implement A/B testing for different configurations

## Support
- IronSource LevelPlay Documentation: https://developers.is.com/ironsource-mobile/react-native/
- React Native Plugin GitHub: https://github.com/ironsource-mobile/react-native-SDK
- IronSource Dashboard: https://platform.ironsrc.com/ 