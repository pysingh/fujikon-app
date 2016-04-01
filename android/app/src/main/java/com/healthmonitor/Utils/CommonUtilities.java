package com.healthmonitor.Utils;

import android.content.Context;
import android.widget.Toast;

/**
 * Created by nkhaturia on 28/3/16.
 */
public class CommonUtilities {
    public static void showToast(String msg, Context mContext) {
        Toast.makeText(mContext, msg, Toast.LENGTH_LONG).show();

    }
}
