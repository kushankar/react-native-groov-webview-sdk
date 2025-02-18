# Embed react native library

### Overview

Groov’s Embed React Native library provides the set of screens and functionalities that enable applications to easily embed Groov enabled merchant journeys (across Groov Insights and Groov Capital). The library contains:

*   Personalised UX to guide your customers through the Connect and/or Capital lifecycle processes
*   Modular design to help you seamlessly embed the embedded features into your application's flow

This library needs to be used alongside the end to end implementation steps as details in [https://docs.wearegroov.io/docs/integrate-via-groov-widget#/](https://docs.wearegroov.io/docs/integrate-via-groov-widget#/)

#### Environments and testing with the library

Two environments exist to support the Groov library integrations:

*   'sandbox' - to be used for testing with sample flows in your test application environment (if available).
*   'live' - to be used only in production apps

The environment being used is determined by the API Keys that is used to generate the necessary **library tokens.**

#### Going Live

Once you are satisfied with your integration and are ready to go live, please access your Groov Admin Dashboard account to obtain the live API key. You will have to replace the sandbox API key in your code with the live API key. To use the correct API key, remember to toggle the Test vs Live viewing options on your Groov dashboard account..

Check that you have enabled the required configurations to enable the required features (Connect, Capital) inside your [Groov Dashboard](https://app.wearegroov.io/home), before going live.

### Adding the dependency

Groov’s React Native Library supports:

*   React Native 0.76
*   Axios 1.7.9
*   Android API level 33+
*   iOS?

### Adding dependency through npm

Navigate to the root directory of your React Native project. The rest of this section will assume you are in the root directory. Run the following command:

$ npm install @wearegroov/react-native-embed --save

### Sample implementation

This section focusses on an example on how you would integrate the Library component above in your main app codebase:

    import ...;
    import ...;
    import { GroovWebView } from '@wearegroov/react-native-embed';
    import * as GroovWebViewConfig from '../../../groov-webview-config';

    //assume you want to toggle Groov widget on your app screen called PaymentsScreen,
    //you would need to include rows starting <View... till ending with </View>
    export const PaymentsScreen = () => (
        <View style={styles.screen}>
            <GroovWebView
                embedAppServerWidgetIdRouterEndpoint={GroovWebViewConfig.embedAppServerWidgetIdRouterEndpoint}
                embedAppServerAuthType={GroovWebViewConfig.embedAppServerAuthType}
                embedAppServerAuthValue={GroovWebViewConfig.embedAppServerAuthValue}
                embedAppServerAPIMethodType={GroovWebViewConfig.embedAppServerAPIMethodType}
                widgetFrameStyle={styles.groovWebViewContainer} //as an optional input if you wish to
            />
        </View>
    );
    
    const styles = StyleSheet.create({
        screen: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        //optional if you want to provide a custom styling
        groovWebViewContainer: {
            margin: 20,
            borderWidth: 1,
            borderColor: 'blue',
            borderRadius: 10,
            overflow: 'hidden',
        },
    });

### Styling customization

For both iOS and Android, the React Native Library uses the default white-labelling setup your platform has setup in your [Groov Dashboard](https://app.wearegroov.io/home) account.

You can provide a optional widget container styling to the library function as per the implementation example above.

### Session Management

Once a merchant/user enters the app/screen context where the Groov Widget is housed, Groov automatically manages the start and end of a session. Everytime a new session is initiated, Groov generates a new session id in form of WidgetId in context of the user and associates it to the session identity for the duration of a particular session.

### Support

Should you encounter any technical issues during integration, please contact Groov’s Customer Support team via [email](mailto:support@wearegroov.io), including the word EMBED-ISSUE: at the start of the subject line.

Alternatively, you can search the support documentation available via our developer documentation portal, [https://docs.wearegroov.io](https://docs.wearegroov.io) .

We will notify you of any major library releases and details can always be found via our developer documentation portal, [https://docs.wearegroov.io](https://docs.wearegroov.io) .

### How is the Groov’s React Native Library licensed?

The Groov React Native Embed Library is available under the [ISC license](https://opensource.org/license/isc-license-txt).