import { useHistoryStore } from '@/stores/history';

export function setupRouterHooks(router) {
    router.afterEach((to) => {
        const historyStore = useHistoryStore();
        const excludedRoutes = ['/history', '/stats'];

        if (!excludedRoutes.includes(to.path)) {
            historyStore.trackPageView({
                ...to,
                title: to.meta.title || to.name,
            });
        }
    });
}
