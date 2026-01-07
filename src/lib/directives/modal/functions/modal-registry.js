const modules = import.meta.glob(
    '$lib/components/molecules/modals/*.svelte',
    { eager: true }
);

const ModalRegistry = {};

for (const path in modules) {
    const name = path.split('/').at(-1).replace('.svelte', '');
    ModalRegistry[name] = modules[path].default;
}

export default ModalRegistry;
