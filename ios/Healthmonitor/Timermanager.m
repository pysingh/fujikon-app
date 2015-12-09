//
//  Timermanager.m
//  Healthmonitor
//
//  Created by stplmacmini7 on 12/8/15.
//  Copyright (c) 2015 Facebook. All rights reserved.
//

#import "Timermanager.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface Timermanager()
{
  dispatch_source_t timer;
  int currMinute;
  int currSeconds;
  int currHours;
  int totalSeconds;
  BOOL isTimerStarted;
}
@end

@implementation Timermanager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

RCT_EXPORT_METHOD(startTimer)
{
  
  //timer=[NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(timerFired) userInfo:nil repeats:YES];
  if (!isTimerStarted) {
    currHours = 0;
    currMinute = 0;
    currSeconds = 0;
    totalSeconds = 0;
    timer = dispatch_source_create(DISPATCH_SOURCE_TYPE_TIMER, 0, 0, dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0));
    dispatch_source_set_timer(timer, dispatch_walltime(NULL, 0), 1 * NSEC_PER_SEC, 0.01 * NSEC_PER_SEC);
    
    dispatch_source_set_event_handler(timer, ^{
      [self timerFired];
    });
    dispatch_resume(timer);
    isTimerStarted = YES;
  }
}

RCT_EXPORT_METHOD(resetTimer)
{
  currHours = 0;
  currMinute = 0;
  currSeconds = 0;
  totalSeconds = 0;
}

-(void)timerFired
{
  totalSeconds++;
  if(currHours >= 24)
    currHours = 0;
  else if(currMinute <=60 && currMinute >= 59)
    currHours++;
  
  if(currMinute >=60)
    currMinute = 0;
  else if(currSeconds<=60 && currSeconds>= 59)
    currMinute++;
  
  if(currSeconds >= 59)
    currSeconds = 0;
  else
    currSeconds++;
  
  NSDictionary *data = @{
                              @"secData" : [NSString stringWithFormat:@"%d",currSeconds],
                              @"minData" : [NSString stringWithFormat:@"%d",currMinute],
                              @"hourData" : [NSString stringWithFormat:@"%d",currHours],
                              @"totalSecs" : [NSString stringWithFormat:@"%d",totalSeconds]
                              };
  
  

  [self.bridge.eventDispatcher sendAppEventWithName:@"timerData"
                                               body:data];
  //[timer invalidate];
 
}


@end
