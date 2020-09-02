/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"
#import "Orientation.h"

#import <React/RCTBridge.h>
#import <RNBranch/RNBranch.h>
#import <RNFBAppModule.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Firebase/Firebase.h>
#import <TSBackgroundFetch/TSBackgroundFetch.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  #ifdef FB_SONARKIT_ENABLED
    InitializeFlipper(application);
  #endif
  [FIRApp configure];
  
  // 1. init window
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  
  // 2. backgroundView using LaunchScreen.xib
  UIView *backgroundView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  backgroundView.frame = self.window.bounds;
  
  // 3. init branch.io
  // Uncomment this line to use the test key instead of the live one.
  // [RNBranch useTestInstance];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  
  // 4. ReactNative initialization
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"sap_sailing_insight"
                                            initialProperties:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  // 6. set loadingView to the LaunchScreen.xib view too (explicitly set all frames)
  UIView *launchScreenView = [[[NSBundle mainBundle] loadNibNamed:@"LaunchScreen" owner:self options:nil] firstObject];
  rootView.frame = self.window.bounds;
  launchScreenView.frame = self.window.bounds;
  rootView.loadingView = launchScreenView;
  rootView.translatesAutoresizingMaskIntoConstraints = NO;
  
  // 7. set the backgroundView as main view for the rootViewController (instead of the rootView)
  rootViewController.view = backgroundView;
  
  // 8. make visible
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // 9. after the window is visible, add the rootView as a subview to your backgroundView
  [backgroundView addSubview:rootView];

  // 10. add constraints for layout on different screen sizes
  NSArray *constraints = @[[NSLayoutConstraint constraintWithItem:rootView attribute:NSLayoutAttributeLeading relatedBy:NSLayoutRelationEqual toItem:backgroundView attribute:NSLayoutAttributeLeading multiplier:1.0 constant:0.0],
                         [NSLayoutConstraint constraintWithItem:rootView attribute:NSLayoutAttributeTrailing relatedBy:NSLayoutRelationEqual
                                                         toItem:backgroundView attribute:NSLayoutAttributeTrailing multiplier:1.0 constant:0.0],
                         [NSLayoutConstraint constraintWithItem:rootView attribute:NSLayoutAttributeTop relatedBy:NSLayoutRelationEqual toItem:backgroundView attribute:NSLayoutAttributeTop multiplier:1.0 constant:0.0],
                         [NSLayoutConstraint constraintWithItem:rootView attribute:NSLayoutAttributeBottom relatedBy:NSLayoutRelationEqual toItem:backgroundView attribute:NSLayoutAttributeBottom multiplier:1.0 constant:0.0]
                         ];
  
  [backgroundView addConstraints: constraints];
  
  // [REQUIRED] Register BackgroundFetch
  [[TSBackgroundFetch sharedInstance] didFinishLaunching];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if (![RNBranch.branch application:app openURL:url options:options]) {
    // do other deep link routing for the Facebook SDK, Pinterest SDK, etc
  }
  return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *restorableObjects))restorationHandler {
  return [RNBranch continueUserActivity:userActivity];
}

- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

@end
