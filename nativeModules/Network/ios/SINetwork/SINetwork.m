
#import "SINetwork.h"

@interface SINetwork()

@property (nonatomic, strong) AFURLSessionManager *sessionManager;

@end

@implementation SINetwork

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

- (instancetype)init
{
    self = [super init];
    if (self) {
        NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
        
         if (@available(iOS 11.0, *)) {
             configuration.multipathServiceType = NSURLSessionMultipathServiceTypeInteractive;
         }
         _sessionManager =  [[AFURLSessionManager alloc] initWithSessionConfiguration: configuration];
    }
    return self;
}

RCT_EXPORT_METHOD(fetch:(NSString *)url options:(NSDictionary *)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    NSMutableURLRequest * request = [self composeRequest: options url: url];
    
    NSURLSessionDataTask *dataTask = [self.sessionManager dataTaskWithRequest: request uploadProgress: nil downloadProgress: nil completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
        NSMutableDictionary * responseDic = [self composeResponseObj:response status: (error == nil) responseObject:responseObject];
        
        resolve(responseDic);
    }];

    [dataTask resume];
}

- (NSURLRequest *)addHttpHeaders: (NSDictionary *)headers request:(NSMutableURLRequest *)request
{
    NSMutableURLRequest *req = (NSMutableURLRequest *)request;
    for (NSString *key in headers.allKeys)
    {
        [req setValue:headers[key] forHTTPHeaderField:key];
    }
    return req;
}

- (NSMutableURLRequest *)composeRequest:(NSDictionary *)options url:(NSString *)url {
    NSURL *URL = [NSURL URLWithString: url];
    
    NSMutableURLRequest *request =  [NSMutableURLRequest requestWithURL: URL cachePolicy: NSURLRequestUseProtocolCachePolicy timeoutInterval:[options[@"timeout"] doubleValue]];;
    
    request.HTTPMethod = options[@"method"];
    
    [self addHttpHeaders:options[@"headers"] request: request];
    
    [request setHTTPBody: [options[@"body"] dataUsingEncoding:NSUTF8StringEncoding]];
    return request;
}

- (NSMutableDictionary *)composeResponseObj:(NSURLResponse * _Nonnull)response status:(BOOL)status responseObject:(id _Nullable)responseObject {
    NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *) response;
    NSMutableDictionary *responseDic = [NSMutableDictionary dictionaryWithDictionary: responseObject];
    responseDic[@"status"] = @(httpResponse.statusCode);
    responseDic[@"headers"] = httpResponse.allHeaderFields;
    responseDic[@"ok"] = @(status);
    responseDic[@"url"] = httpResponse.URL.absoluteString;
    return responseDic;
}


@end
