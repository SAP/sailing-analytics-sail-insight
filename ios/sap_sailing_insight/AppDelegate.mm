#import "AppDelegate.h"
#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Custom initialization
  [FIRApp configure];

  self.moduleName = @"sap_sailing_insight";
  self.initialProps = @{};

  // Delegate the rest to RCTAppDelegate
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
