package org.sailyachtresearch.sailinsight

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import io.branch.rnbranch.RNBranchModule

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "sap_sailing_insight"

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }

  override fun onStart() {
    super.onStart()
    RNBranchModule.initSession(intent?.data, this)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    RNBranchModule.onNewIntent(intent)
  }

  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
