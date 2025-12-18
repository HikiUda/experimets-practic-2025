import { createRoot } from 'react-dom/client';
import { App } from '../components/App/App';
import { createBrowserRouter } from 'react-router-dom';

import { Shop } from 'pages/Shop';
import { Suspense } from 'react';

const routes = [
    {
        path: '/shop',
        element: <App />,
        children: [
            {
                path: '/shop/main',
                element: (
                    <Suspense fallback={'Loading...'}>
                        <Shop />
                    </Suspense>
                ),
            },
            {
                path: '/shop/second',
                element: (
                    <Suspense fallback={'Loading...'}>
                        <div>dajlkdsfja;lkdsf</div>
                    </Suspense>
                ),
            },
        ],
    },
];

export const router = createBrowserRouter(routes);

export default routes;
