package org.sailyachtresearch.sailinsight

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import io.branch.indexing.BranchUniversalObject
import io.branch.referral.Branch
import io.branch.referral.BranchError
import io.branch.referral.util.LinkProperties

import android.util.Log;
import org.json.JSONObject;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "sap_sailing_insight"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  // Always initialize Branch in `onStart()` - see warnings below for details
  override fun onStart() {
  	super.onStart()
  	Branch.sessionBuilder(this).withCallback { branchUniversalObject, linkProperties, error ->
  		if (error != null) {
  			Log.e("BranchSDK_Tester", "branch init failed. Caused by -" + error.message)
  		} else {
  			Log.i("BranchSDK_Tester", "branch init complete!")
  			if (branchUniversalObject != null) {
  				Log.i("BranchSDK_Tester", "title " + branchUniversalObject.title)
  				Log.i("BranchSDK_Tester", "CanonicalIdentifier " + branchUniversalObject.canonicalIdentifier)
  				Log.i("BranchSDK_Tester", "metadata " + branchUniversalObject.contentMetadata.convertToJson())
  			}
  			if (linkProperties != null) {
  				Log.i("BranchSDK_Tester", "Channel " + linkProperties.channel)
  				Log.i("BranchSDK_Tester", "control params " + linkProperties.controlParams)
  			}
  		}
  	}.withData(this.intent.data).init()
  }

  override fun onNewIntent(intent: Intent?) {
  	super.onNewIntent(intent)
  	this.setIntent(intent);
  	if (intent != null && intent.hasExtra("branch_force_new_session") && intent.getBooleanExtra("branch_force_new_session",false)) {
  		Branch.sessionBuilder(this).withCallback { referringParams, error ->
  			if (error != null) {
  				Log.e("BranchSDK_Tester", error.message)
  			} else if (referringParams != null) {
  				Log.i("BranchSDK_Tester", referringParams.toString())
  			}
  		}.reInit()
  	}
  }
}
