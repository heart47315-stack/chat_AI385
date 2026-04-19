# ProGuard rules for Character Chat App

# WebView
-keepclassmembers class * extends android.webkit.WebChromeClient {
    public void on*(...);
}

-keepclassmembers class * extends android.webkit.WebViewClient {
    public boolean should*(...);
}

# Keep our custom WebView interface methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Preserve line numbers for debugging
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
