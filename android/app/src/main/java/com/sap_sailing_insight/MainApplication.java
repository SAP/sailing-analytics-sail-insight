package com.sap_sailing_insight;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.horcrux.svg.SvgPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

import io.branch.referral.Branch;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.PackageList;

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
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      packages.add(new ShowAppSettingsPackage());
      return packages;
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
