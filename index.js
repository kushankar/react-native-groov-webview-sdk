import axios from 'axios';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import * as config from './config';

function normalizeUrl(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function GroovWebView({ embedAppServerWidgetIdRouterEndpoint, embedAppServerAuthType, embedAppServerAuthValue, embedAppServerAPIMethodType, widgetFrameStyle = {} }) {
    const gWidgetId = uuidv4();
    const institutionWidgetRegistrarEndpoint = `${normalizeUrl(embedAppServerWidgetIdRouterEndpoint)}/${gWidgetId}`;
    const method = embedAppServerAPIMethodType.toLowerCase();

    const fetchUrl = async () => {
        await axios({
            method,
            url: institutionWidgetRegistrarEndpoint,
            headers: { [embedAppServerAuthType]: embedAppServerAuthValue },
        });

        return axios.get(config.GROOV_URI, {
            headers: { [config.GROOV_AUTH_KEY]: gWidgetId },
        });
    };

    const { groovEmbedComponentUrl, loading, error } = getGroovEmbedComponentUrl(fetchUrl);

    return <GroovWebViewRenderer url={groovEmbedComponentUrl} loading={loading} error={error} widgetFrameStyle={widgetFrameStyle} />;
}

export function GroovWebView2({ embedAppExternalUserId, embedAppServerAuthValue, widgetFrameStyle = {} }) {
    const fetchUrl = async () => {
        const institutionWidgetRegistrarEndpoint = `${config.GROOV_URI2}/${embedAppExternalUserId}/token`;
        return axios.put(institutionWidgetRegistrarEndpoint, {}, {
            headers: {
                [config.GROOV_AUTH_KEY]: embedAppServerAuthValue,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    };

    const { groovEmbedComponentUrl, loading, error } = getGroovEmbedComponentUrl(fetchUrl);

    return <GroovWebViewRenderer url={groovEmbedComponentUrl} loading={loading} error={error} widgetFrameStyle={widgetFrameStyle} />;
}

function getGroovEmbedComponentUrl(fetchUrl) {
    const [groovEmbedComponentUrl, setGroovEmbedComponentUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchGroovEmbedUrl() {
            try {
                const response = await fetchUrl();
                setGroovEmbedComponentUrl(response.data?.campaign?.groovEmbedUrl);
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
        fetchGroovEmbedUrl();
    }, [fetchUrl]);

    return { groovEmbedComponentUrl, loading, error };
}

function GroovWebViewRenderer({ url, loading, error, widgetFrameStyle }) {
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
                source={{ uri: url }}
                onError={({ nativeEvent }) => {
                    console.error('WebView error: ', nativeEvent);
                }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
            />
        </View>
    );
}

GroovWebView.propTypes = {
    embedAppServerWidgetIdRouterEndpoint: PropTypes.string.isRequired,
    embedAppServerAuthType: PropTypes.string.isRequired,
    embedAppServerAuthValue: PropTypes.string.isRequired,
    embedAppServerAPIMethodType: PropTypes.string.isRequired,
    widgetFrameStyle: PropTypes.object,
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
