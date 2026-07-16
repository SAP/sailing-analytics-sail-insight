#import "AppDelegate.h"
#import <Firebase.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>
#import <RNBranch/RNBranch.h>
#import <ReactAppDependencyProvider/RCTAppDependencyProvider.h>

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

  // Branch: init the session so Universal Link / app.link taps are parsed and
  // delivered to the JS branch.subscribe listener (integrations/DeepLinking.ts).
  // Must run before the RN root is set up. // [RNBranch useTestInstance];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];

  self.moduleName = @"sap_sailing_insight";
  self.dependencyProvider = [RCTAppDependencyProvider new];
  self.initialProps = @{};

  #if __has_include(<React/RCTAppSetupUtils.h>)
    // Safe on RN ≥ 0.71; skipped on older RN if header isn't present
    RCTAppSetupPrepareApp(application, YES);
  #endif

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Custom scheme (orgsailyachtresearchsailinsight://). Let Branch inspect the URL
// first; if it isn't a Branch link, hand it to RN's Linking so getInitialURL()
// and the 'url' event still fire.
- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  if ([RNBranch application:application openURL:url options:options]) {
    return YES;
  }
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links (applinks:sailinsight30-app.sapsailing.com). Forward to BOTH
// Branch (drives branch.subscribe) AND RCTLinkingManager — the latter is what
// makes Linking.getInitialURL() return the opening URL, which the JS
// Branch-independent fallback in actions/deepLinking.ts relies on. The 5s dedup
// guard there prevents a double-join when both paths deliver the same link.
- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler
{
  BOOL branchHandled = [RNBranch continueUserActivity:userActivity];
  BOOL linkingHandled = [RCTLinkingManager application:application
                                   continueUserActivity:userActivity
                                     restorationHandler:restorationHandler];
  return branchHandled || linkingHandled;
}

@end
