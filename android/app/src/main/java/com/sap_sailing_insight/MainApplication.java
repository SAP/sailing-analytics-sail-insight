package com.sap_sailing_insight;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.ocetnik.timer.BackgroundTimerPackage;
import io.realm.react.RealmReactPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.horcrux.svg.SvgPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

import io.branch.referral.Branch;
import io.branch.rnbranch.RNBranchPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNVersionNumberPackage(),
            new LottiePackage(),
            new FastImageViewPackage(),
            new KCKeepAwakePackage(),
            new RNBackgroundFetchPackage(),
            new RNBackgroundGeolocation(),
            new BackgroundTimerPackage(),
            new RealmReactPackage(),
            new RNDeviceInfo(),
            new SvgPackage(),
            new LinearGradientPackage(),
            new RNI18nPackage(),
            new RNBranchPackage(),
            new RNCameraPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Branch.getAutoInstance(this);
  }
}
