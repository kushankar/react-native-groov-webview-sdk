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

## Code Block changes in repo

### config.js

export const GROOV_URI = '[https://app.wearegroov.io/api/v1/emca/merchant-identity';](https://app.wearegroov.io/api/v1/emca/merchant-identity';)  
export const GROOV_AUTH_KEY = 'x-api-key';

### package.json

    {
        "name": "react-native-embed",
        "version": "0.0.1",        
        "description": "Groov library for embedded react native component",        
        "main": "index.js",        
        "scripts": {        
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "repository": {
            "type": "git",
            "url": "https://github.com/wearegroov/react-native-embed"
        },
        "keywords": [
            "groov",
            "webview",
            "library",
            "react-native",
            "embedded-finance"
        ],
        "author": "Groov",
        "license": "ISC",
        "bugs": {
            "url": "https://github.com/wearegroov/react-native-embed/issues"
        },
        "homepage": "https://github.com/wearegroov/react-native-embed?tab=readme-ov-file#readme",
        "dependencies": {
            "axios": "^1.7.9",
            "react-native-get-random-values": "~1.11.0",
            "uuid": "^11.0.3",
            "react-native-webview": "13.12.5"
        },
        "peerDependencies": {
            "react": "18.3.1",
            "react-native": "0.76.5",
            "react-native-get-random-values": "~1.11.0",
            "uuid": "^11.0.3",
            "react-native-webview": "13.12.5",
            "axios": "^1.7.9",
            "@react-navigation/native": "^7.0.14"
        }    
    }

### index.js

    import axios from 'axios';
    import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
    import 'react-native-get-random-values';
    import { v4 as uuidv4 } from 'uuid';
    import { WebView } from 'react-native-webview';
    import React, { useState, useEffect } from 'react';
    import PropTypes from 'prop-types';
    import * as config from './config';

    export function GroovWebView({embedAppServerWidgetIdRouterEndpoint, embedAppServerAuthType, embedAppServerAuthValue, embedAppServerAPIMethodType, widgetFrameStyle = {} }) {
        const [groovEmbedComponentUrl, setGroovEmbedComponentUrl] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        
        useEffect(() => {
            registerWidgetAndLoadGroovEmbedComponent();
        }, []);

        async function registerWidgetAndLoadGroovEmbedComponent() {
            try {
                const gWidgetId = uuidv4();
                const institutionWidgetRegistrarEndpoint = `${normalizeUrl(embedAppServerWidgetIdRouterEndpoint)}/${gWidgetId}`;
                const headers = { [embedAppServerAuthType]: embedAppServerAuthValue };
                const method = embedAppServerAPIMethodType.toLowerCase();
    
                if (method === "get") {
                    await axios.get(institutionWidgetRegistrarEndpoint, { headers });
                } else if (method === "put") {
                    await axios.put(institutionWidgetRegistrarEndpoint, null, { headers });
                } else if (method === "post") {
                    await axios.post(institutionWidgetRegistrarEndpoint, null, { headers });
                }
    
                const response = await axios.get(config.GROOV_URI, {
                    headers: { [config.GROOV_AUTH_KEY]: gWidgetId }
                });
    
                setGroovEmbedComponentUrl(response.data.campaign.groovEmbedUrl);
            } catch (err) {
                console.error('Error while fetching Groov Embed URL:', {
                    message: err.message,
                    stack: err.stack,
                    response: err.response?.data,
                });
                setError('Failed to load Groov Widget. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        function normalizeUrl(url) {
            return url.endsWith('/') ? url.slice(0, -1) : url;
        }
    
        if (loading) {
            return (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
    
        if (error) {
            return (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }
    
        return (
            <View style={[styles.defaultContainer, widgetFrameStyle]}>
                <WebView
                    source={{ uri: groovEmbedComponentUrl }}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView error: ', nativeEvent);
                        setError('An error occurred while loading the WebView content.');
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                />
            </View>
        );
    }

    GroovWebView.propTypes = {        
        embedAppServerWidgetIdRouterEndpoint: PropTypes.string.isRequired,
        embedAppServerAuthType: PropTypes.string.isRequired,
        embedAppServerAuthValue: PropTypes.string.isRequired,
        embedAppServerAPIMethodType: PropTypes.string.isRequired,
    };
    
    const styles = StyleSheet.create({
        center: {
            flex: 1,            
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
        },
        errorText: {
            color: 'red',
            fontSize: 16,
            textAlign: 'center',
        },
        defaultContainer: {
            flex: 1,
            width: '100%',
        },
    });