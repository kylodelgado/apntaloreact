# Ad Integration Guide

This app now supports **Appodeal SDK** with 70+ ad networks including IronSource as mediated networks, plus **AdMob** as fallback.

## **🚀 Supported Ad Networks**

1. **Appodeal** (Primary) - 70+ demand sources including IronSource, Unity, AdColony, etc.
2. **AdMob** (Fallback) - Google Mobile Ads

## **📱 Configuration**

### **Switching Between Ad Networks**

Edit `src/config/ads.ts` to control which ad network is active:

```typescript
// Ad network selection
export const USE_APPODEAL = true; // Set to false to use AdMob instead
```

### **Current Logic**

1. **Appodeal** (if `USE_APPODEAL = true` and Platform = Android)
2. **AdMob** (fallback for all other cases)

## **🔧 Network-Specific Setup**

### **Appodeal (Primary Choice)**

**App Key:** `99a802ce1c066bc3daa13a82969c9af983bc7ddd5f4909e2`

**Features:**
- 70+ ad demand sources (including IronSource, Unity, AdColony, etc.)
- Real-time bidding
- Automatic revenue optimization
- Built-in analytics
- IronSource mediation included

**Configuration:**
```typescript
export const USE_APPODEAL = true;  // Enable Appodeal with 70+ networks
```

### **AdMob (Universal Fallback)**

**Android App ID:** `ca-app-pub-5105447899809010~5062778503`

Always available as fallback when Appodeal is disabled.

## **🏗️ Technical Implementation**

### **File Structure**
```
src/
├── config/
│   └── ads.ts                    # Ad network configuration
├── services/
│   └── AppodealService.ts        # Appodeal management
└── components/ads/
    ├── BannerAd.tsx             # Main banner component (switches networks)
    └── AppodealBannerAd.tsx     # Appodeal-specific banner
```

### **Banner Component Usage**

The main `BannerAd` component automatically selects the appropriate ad network:

```tsx
import { BannerAd } from './src/components/ads/BannerAd';

// Automatically uses Appodeal (Android) or AdMob (fallback)
<BannerAd />
```

### **Network Initialization**

Networks are initialized in `App.tsx`:

```typescript
// Initialize Appodeal if enabled (Android)
if (USE_APPODEAL && Platform.OS === 'android') {
  const success = await initAppodeal();
  console.log('Appodeal initialization:', success ? 'success' : 'failed');
}
```

## **🧪 Testing**

### **Development Mode**
- All networks use test ad IDs in development (`__DEV__ = true`)
- Appodeal automatically enables testing mode in development
- Detailed logging available in console

### **Testing Different Networks**

1. **Test Appodeal (70+ networks):**
   ```typescript
   export const USE_APPODEAL = true;
   ```

2. **Test AdMob only:**
   ```typescript
   export const USE_APPODEAL = false;
   ```

## **📊 Revenue Optimization Strategy**

### **Why This Setup is Optimal:**

1. **Maximum Fill Rate:** 70+ demand sources vs 1-3 networks
2. **Higher eCPM:** Real-time bidding competition
3. **Simplified Management:** One SDK handles multiple networks
4. **IronSource Included:** Still get IronSource ads through mediation
5. **Automatic Optimization:** Appodeal handles network prioritization

### **Expected Performance:**

- **Appodeal:** Higher eCPM due to 70+ competing demand sources
- **AdMob:** Reliable baseline with good global coverage
- **Combined:** Best of both worlds with automatic failover

## **🚨 Troubleshooting**

### **Common Issues:**

1. **Appodeal not loading:** Check network security config in AndroidManifest.xml
2. **Build errors:** Ensure Appodeal repository is in build.gradle  
3. **No ads showing:** Check console logs for initialization status

### **Debug Logs:**

All ad networks provide console logging:
```javascript
console.log('Appodeal initialization: success/failed');
console.log('Banner loaded/failed/clicked');
```

## **🔄 Easy Network Switching**

To switch networks, simply update one file:

**`src/config/ads.ts`**
```typescript
// Use Appodeal with 70+ networks (recommended)
export const USE_APPODEAL = true;

// Use AdMob only
export const USE_APPODEAL = false;
```

The app will automatically use the selected network on next launch.

## **📈 Performance Expectations**

- **Appodeal:** Significantly higher eCPM due to 70+ demand sources competing in real-time
- **AdMob:** Reliable baseline performance
- **IronSource:** Now included automatically through Appodeal mediation

**✅ Integration Complete!** 🎉 

Your app now has access to 70+ ad networks through a single, clean integration. 