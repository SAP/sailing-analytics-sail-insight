#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>

#if __has_include(<React/RCTAppSetupUtils.h>)
#import <React/RCTAppSetupUtils.h>
#endif

@implementation AppDelegate

- (NSURL *)bundleURL
{
#if DEBUG
  #if REACT_NATIVE_MINOR_VERSION >= 75
    // RN 0.75+
    return [RCTBundleURLProvider.sharedSettings jsBundleURLForBundleRoot:@"index"];
  #else
    // RN <= 0.74
    return [[RCTBundleURLProvider sharedSettings]
              jsBundleURLForBundleRoot:@"index"
                     fallbackResource:nil];
  #endif
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  self.moduleName = @"sap_sailing_insight";
  self.initialProps = @{};

  #if __has_include(<React/RCTAppSetupUtils.h>)
    // Safe on RN ≥ 0.71; skipped on older RN if header isn't present
    RCTAppSetupPrepareApp(application, YES);
  #endif

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
