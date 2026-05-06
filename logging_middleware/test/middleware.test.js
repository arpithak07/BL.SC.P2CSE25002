const { getTopNotifications } = require('../app.js');

/**
 * Mocking global fetch for the test environment
 */
global.fetch = async () => {
    return {
        ok: true,
        json: async () => [
            { id: 'a1', type: 'result', message: 'Old Result', timestamp: '2026-04-22 17:51:30', isRead: false },
            { id: 'b2', type: 'placement', message: 'Old Placement', timestamp: '2026-04-22 17:51:18', isRead: false },
            { id: 'c3', type: 'event', message: 'Old Event', timestamp: '2026-04-22 17:50:54', isRead: false },
            { id: 'd4', type: 'placement', message: 'Recent Placement', timestamp: '2026-05-06T11:00:00Z', isRead: false },
            { id: 'e5', type: 'event', message: 'Recent Event', timestamp: '2026-05-04T08:00:00Z', isRead: false },
            { id: 'f6', type: 'result', message: 'Read Notification', timestamp: '2026-05-06T13:00:00Z', isRead: true },
        ]
    };
};

async function testPrioritySorting() {
    console.log('Starting Notification Middleware Tests...\n');

    try {
        const topN = 3;
        const results = await getTopNotifications(topN);

        console.log(`Top ${topN} Unread Notifications:`);
        console.table(results.map(n => ({
            id: n.id,
            type: n.type,
            timestamp: n.timestamp,
            isRead: n.isRead
        })));

        // Validations
        if (results.length !== topN) {
            throw new Error(`Expected ${topN} results, got ${results.length}`);
        }

        if (results[0].type !== 'placement' || results[0].id !== 'd4') {
            throw new Error('Priority Error: Recent Placement (d4) should be first.');
        }

        if (results[1].type !== 'placement' || results[1].id !== 'b2') {
            throw new Error('Priority Error: Old Placement (b2) should be second.');
        }

        if (results.some(n => n.isRead)) {
            throw new Error('Filter Error: Read notifications should not be included.');
        }

        console.log('\n✅ All Stage 1 tests passed successfully!');
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

testPrioritySorting();

