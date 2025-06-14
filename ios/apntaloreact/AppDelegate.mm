#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
// 1. Import IronSource SDK
#import <IronSource/IronSource.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"apntaloreact";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

#if DEBUG
  // 2. Enable IronSource Test Suite (set meta data BEFORE init)
  [IronSource setMetaDataWithKey:@"is_test_suite" value:@"enable"];

  // 3. Initialize IronSource (replace with your actual app key)
  [IronSource initWithAppKey:@"2260b5485" delegate:nil];

  // 4. Launch the Test Suite after initialization
  // (No delegate, so we launch immediately for test purposes)
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *rootVC = [UIApplication sharedApplication].delegate.window.rootViewController;
    if (rootVC) {
      [IronSource launchTestSuite:rootVC];
    }
  });
#endif

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
