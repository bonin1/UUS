const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class WebSocketService {
    constructor() {
        this.wss = null;
        this.adminConnections = new Map();
    }

    initialize(server) {
        this.wss = new WebSocket.Server({ server });

        this.wss.on('connection', (ws, req) => {
            const cookies = this.parseCookies(req);
            const token = cookies.authToken;

            if (!token) {
                ws.close();
                return;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (decoded.role === 'admin') {
                    this.adminConnections.set(decoded.id, ws);

                    ws.on('close', () => {
                        this.adminConnections.delete(decoded.id);
                    });
                }
            } catch (err) {
                ws.close();
            }
        });
    }

    notifyAdmins(notification) {
        this.adminConnections.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(notification));
            }
        });
    }

    parseCookies(req) {
        const cookies = {};
        const cookieHeader = req.headers.cookie;
        if (cookieHeader) {
            cookieHeader.split(';').forEach(cookie => {
                const parts = cookie.split('=');
                cookies[parts[0].trim()] = parts[1].trim();
            });
        }
        return cookies;
    }
}

module.exports = new WebSocketService();