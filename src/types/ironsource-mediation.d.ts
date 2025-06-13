declare module 'ironsource-mediation' {
  export enum AdFormat {
    REWARDED = 'REWARDED',
    INTERSTITIAL = 'INTERSTITIAL',
    BANNER = 'BANNER',
    NATIVE_AD = 'NATIVE_AD',
  }

  export class LevelPlayAdSize {
    static BANNER: LevelPlayAdSize;
    static LARGE_BANNER: LevelPlayAdSize;
    static MEDIUM_RECTANGLE: LevelPlayAdSize;
    static SMART_BANNER: LevelPlayAdSize;
    static CUSTOM: (width: number, height: number) => LevelPlayAdSize;
    width: number;
    height: number;
  }

  export interface LevelPlayAdInfo {
    adNetwork: string;
    adUnit: string;
    instanceName: string;
    instanceId: string;
    country: string;
    revenue: number;
    precision: string;
    ab: string;
    segmentName: string;
    placement: string;
    auctionId: string;
    encryptedCPM: string;
    lifetimeRevenue: number;
  }

  export interface LevelPlayAdError {
    errorCode: number;
    errorMessage: string;
  }

  export interface LevelPlayInitError {
    errorCode: number;
    errorMessage: string;
  }

  export interface LevelPlayConfiguration {
    pluginType: string;
    pluginVersion: string;
    pluginFrameworkVersion: string;
  }

  export interface LevelPlayInitListener {
    onInitSuccess: (configuration: LevelPlayConfiguration) => void;
    onInitFailed: (error: LevelPlayInitError) => void;
  }

  export interface LevelPlayBannerAdViewListener {
    onAdLoaded: (adInfo: LevelPlayAdInfo) => void;
    onAdLoadFailed: (error: LevelPlayAdError) => void;
    onAdClicked: (adInfo: LevelPlayAdInfo) => void;
    onAdScreenPresented?: (adInfo: LevelPlayAdInfo) => void;
    onAdScreenDismissed?: (adInfo: LevelPlayAdInfo) => void;
    onAdLeftApplication?: (adInfo: LevelPlayAdInfo) => void;
    onAdDisplayed: (adInfo: LevelPlayAdInfo) => void;
    onAdDisplayFailed: (adInfo: LevelPlayAdInfo, error: LevelPlayAdError) => void;
    onAdExpanded: (adInfo: LevelPlayAdInfo) => void;
    onAdCollapsed: (adInfo: LevelPlayAdInfo) => void;
  }

  export interface LevelPlayBannerAdViewMethods {
    loadAd: () => void;
    destroyAd: () => void;
  }

  export class LevelPlayInitRequest {
    static builder: (appKey: string) => LevelPlayInitRequestBuilder;
  }

  export class LevelPlayInitRequestBuilder {
    withLegacyAdFormats: (adFormats: AdFormat[]) => LevelPlayInitRequestBuilder;
    withUserId: (userId: string) => LevelPlayInitRequestBuilder;
    build: () => LevelPlayInitRequest;
  }

  export class LevelPlay {
    static init: (initRequest: LevelPlayInitRequest, listener: LevelPlayInitListener) => void;
  }

  export class LevelPlayBannerAdView extends React.Component<{
    adUnitId: string;
    adSize: LevelPlayAdSize;
    placementName: string;
    listener: LevelPlayBannerAdViewListener;
    style?: any;
    onLayout?: (event: any) => void;
  }> {}
} 