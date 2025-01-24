# React Native SDK for Groov webview
The react-native-groov-webview-sdk is an npm package through which the users can embed groov capital with a few configurations. 
It's simple and easy to integrate. Please follow the below steps.


1. Add groov webview npm package - npm i react-native-groov-sdk
2. Add Groov Configuration - Using groov-webview-config.js file, pass the necessary configuration details to the GroovWebView component
3. Add import react-native-groov-sdk - 
	import { GroovWebView } from 'react-native-groov-sdk';
	import * as GrooWebViewConfig from '../../../groov-webview-config';
4. Invoke GroovWebView - Call GroovWebView component 
	<GroovWebView
            externalUserId={GrooWebViewConfig.externalUserId}
            appServerUri={GrooWebViewConfig.appServerUri}
            authKey={GrooWebViewConfig.authKey}
            apiKey={GrooWebViewConfig.apiKey}
			containerStyle={{....}}
        />
		a. externalUserId - An identifier of the user
		b. appServerUri - App server URI
		c. authKey - Auth Key for the API (Example - x-api-key, bearer token, etc)
		d. apiKey - API key for the Groov institution
		e. containerStyle(Optional) - Users can customise the container style, if not provided it picks the default styling