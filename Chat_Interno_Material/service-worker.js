'use strict';

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function(event) {
    event.waitUntil(handlePush(event.data));
});

self.addEventListener('notificationclick', function(event) {
    openDataUrl(event);
});

function handlePush(data) {
    var payload = parsePayload(data);
    var action = {
        'notify': fetchAndShowNotification,
        'fallback': showFallbackNotification
    };

    return action[payload.type](payload.data);
}

/**
 * Parses and validates the payload to show a notification
 */
function parsePayload(data) {
    var payload = {
        type: 'fallback',
        data: {}
    };

    if (!data) {
        trackError('Push Event: Missing param for parsing payload.');
        return payload;
    }

    var params = data.text().split('|');

    if (params.length >= 3) {
        payload = {
            type: 'notify',
            data: {
                newsId: params[0],
                userId: params[1],
                groupId: params[2]
            }
        };
    } else {
      trackError('Push Event: Invalid payload: "' +  data.text() + '"');
    }
    return payload;
}

function fetchAndShowNotification(payload) {
    return fetch('/gz/notifications/push/' + payload.newsId + '?user_id=' + payload.userId, {
        credentials: 'include'
    })
    .then(function(response) {
        if (response.ok) {
          return response.json().then(function(notification) {
            notification.tag = payload.groupId;
            // return the promise to the caller
            return self.registration.showNotification(notification.title, notification);
           });
        } else {
            // in the event that the api returns an unexpected error, track it and show the default notification
            trackError("Error getting notification details newsId: [" + payload.newsId 
                + "], Status code: [" + response.status + "] Error: [" + response.statusText + "]");
            return showFallbackNotification();
        }
    })
    .catch(function(err) {
        trackError('could not display notification with payload ' + JSON.stringify(payload) +': ' + err.message);
        return showFallbackNotification();
    });
}

function trackError(errorMessage) {
    var data = new FormData();
    data.append('error', errorMessage);
    fetch('/gz/notifications/push/error', {
        method: 'POST',
        headers: {
            'Track-Error': 'service-worker'
        },
        credentials: 'include',
        body: data
    });
}

function showFallbackNotification() {
    return fetch('/gz/notifications/push/fallback', {
        credentials: 'include'
    })
    .then(function(response) {
        if (response.ok) {
            return response.json().then(function (notification) {
                return self.registration.showNotification(notification.title, notification);
            });
        }
    })
}

function openDataUrl(event) {
    event.notification.close();

    let clickResponsePromise = Promise.resolve();
    if (event.notification.data && event.notification.data.url) {
        clickResponsePromise = clients.openWindow(event.notification.data.url);
    }
    event.waitUntil(clickResponsePromise);
}