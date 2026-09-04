import { createInertiaApp } from '@inertiajs/react';

void createInertiaApp({
    title: (title) => title || 'Shashimii',
    progress: {
        color: '#38bdf8',
    },
});
