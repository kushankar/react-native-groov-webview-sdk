import axios from 'axios';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as config from './config';

export function GroovWebView({ externalUserId, appServerUri, authKey, apiKey, containerStyle = {} }) {
    const [groovEmbedUrl, setGroovEmbedUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMerchantDetails();
    }, []);

    async function fetchMerchantDetails() {
        try {
            const uuid = uuidv4();
            const uri = `${normalizeUrl(appServerUri)}/${externalUserId}/${uuid}`;
            await axios.put(uri, null, {
                headers: {
                    [authKey]: apiKey,
                },
            });
            const response = await axios.get(config.GROOV_URI, {
                headers: {
                    [config.GROOV_AUTH_KEY]: uuid,
                },
            });
            setGroovEmbedUrl(response.data.campaign.groovEmbedUrl);
        } catch (err) {
            console.error('Error while fetching Groov Embed URL:', {
                message: err.message,
                stack: err.stack,
                response: err.response?.data,
            });
            setError('Failed to load the Groov WebView. Please try again later.');
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
        <View style={[styles.defaultContainer, containerStyle]}>
            <WebView
                source={{ uri: groovEmbedUrl }}
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
    externalUserId: PropTypes.string.isRequired,
    appServerUri: PropTypes.string.isRequired,
    authKey: PropTypes.string.isRequired,
    apiKey: PropTypes.string.isRequired,
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