
async function getTopNotifications(N) {
    const weights = {
        'placement': 3,
        'result': 2,
        'event': 1
    };

    try {
        const response = await fetch("https://20.207.122.201/evaluation-service/notification");
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        const notifications = await response.json();
        const unreadMessages = notifications.filter(n => {
            const isRead = n.isRead !== undefined ? n.isRead : n.read;
            return isRead === false;
        });
        unreadMessages.sort((a, b) => {
            const typeA = (a.type || a.Type || '').toLowerCase();
            const typeB = (b.type || b.Type || '').toLowerCase();
            
            const weightA = weights[typeA] || 0;
            const weightB = weights[typeB] || 0;
            if (weightB !== weightA) {
                return weightB - weightA;
            }
            const timeA = new Date(a.timestamp || a.Timestamp || 0);
            const timeB = new Date(b.timestamp || b.Timestamp || 0);
            return timeB - timeA;
        });

        return unreadMessages.slice(0, N);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}
module.exports = { getTopNotifications };





