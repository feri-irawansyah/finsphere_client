<script>
    import { getContext, onDestroy, onMount } from "svelte";
    import MenuSearch from "../atoms/MenuSearch.svelte";
    import DropdownProfile from "../atoms/DropdownProfile.svelte";
    import InputSwitch from "$lib/directives/inputs/InputSwitch.svelte";
    import { theme } from "$lib";
    import { page } from "$app/state";
    import fetcher from "$lib/fetcher";
    import { goto } from "$app/navigation";
    import Swal from "sweetalert2";

    const { data } = $props();
    let search = $state('');
    let sidebarEl;
    let dark = $state(
    typeof window !== 'undefined'
        ? localStorage.getItem('theme') === 'dark'
        : false
    );

    let openMenu = $state(null);
    const sidebar = getContext('sidebar');

    $effect(() => {
        const mode = dark ? 'dark' : 'light';

        theme.set(mode);
        document.documentElement.setAttribute('data-bs-theme', mode);
        document.documentElement.setAttribute('class', mode);
        localStorage.setItem('theme', mode);
    });

    function searchMenu(e) {
        search = e.detail.toLowerCase();
    }

    function toggleMenu(code) {
        openMenu = openMenu === code ? null : code;
    }

    function isActive(url) {
        return page.url.pathname === url;
    }

    // 🌳 MENU TREE + SEARCH
    const menuTree = $derived.by(() => {
        const parents = data.menus
            .filter(m => m.pageType === 2 && m.status === 1)
            .map(p => ({
                ...p,
                children: []
            }));

        const parentMap = Object.fromEntries(
            parents.map(p => [p.menuCode, p])
        );

        // isi child
        data.menus.forEach(m => {
            if (
                m.pageType === 3 &&
                m.status === 1 &&
                parentMap[m.parentCode]
            ) {
                parentMap[m.parentCode].children.push(m);
            }
        });

        // 🔍 FILTER SEARCH
        if (!search) return parents;

        return parents
            .map(parent => {
                const parentMatch =
                    parent.name.toLowerCase().includes(search);

                const matchedChildren = parent.children.filter(child =>
                    child.name.toLowerCase().includes(search)
                );

                if (parentMatch || matchedChildren.length) {
                    return {
                        ...parent,
                        children: parentMatch
                            ? parent.children
                            : matchedChildren
                    };
                }

                return null;
            })
            .filter(Boolean);
    });

    function handleClickOutside(event) {
        if (sidebarEl && !sidebarEl.contains(event.target)) {
            if(!sidebar.show) {
                openMenu = null;
            } 
        }
    }

    onMount(() => {
        document.addEventListener('click', handleClickOutside);
    });

    onDestroy(() => {
        document.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="sidebar {sidebar.show ? 'show' : ''}" bind:this={sidebarEl}>
    <div class="sidebar-header d-flex justify-content-between">
        <div class="d-flex align-items-center" style="gap: 10px;">
            <img src="/favicon.ico" style="width: 1rem; height: 1rem;" alt="">
            <h3 style="font-size: 1rem;" class="fw-bold"><span class="text-primary">Fin</span>shpere</h3>
        </div>
        <button aria-label="toggle" onclick={() => sidebar.toggle()}>
            <i class="bi bi-panel-right-open toggle-icon"></i>
        </button>
    </div>
    <div class="sidebar-menu">
        <DropdownProfile session={data.session}/>
        <MenuSearch {data} on:search={searchMenu}/>

        <ul class="list-unstyled navbar-nav-menu">
            <li class="text-uppercase mx-3">Main Menu</li>

            <li class="nav-item my-2 py-2 px-3 rounded dashboard {isActive("/") ? 'active' : ''}">
                <a href="/" class="nav-link">
                    <i class="bi bi-dashboard"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            {#each menuTree as parent}
                <li class="nav-item parent-menu my-2">
                    <!-- Parent -->
                    <a class="nav-link parent-toggle" data-bs-toggle="collapse" onclick={() => toggleMenu(parent.menuCode)} href={"#collapse-" + parent.menuCode}>
                        <i class={"bi bi-" + parent.icon}></i>
                        <span class="content">{parent.name}</span>
                        <span class="ms-auto menu-arrow">
                            <i class="bi bi-stroke-bottom arrow-icon"
                                style="
                                    font-size: 0.8rem;
                                    transition: transform 0.3s ease;
                                    transform: rotate({openMenu === parent.menuCode ? 180 : 0}deg);
                                ">
                            </i>
                        </span>
                    </a>
                    <!-- Child -->
                    <div class="submenu {openMenu === parent.menuCode ? 'open' : 'hide'}">
                        <ul class="nav-menu-sub list-unstyled mt-2">
                            {#each parent.children as child}
                                {#if openMenu}
                                    <li class="{isActive(child.link) ? 'active' : ''}">
                                    <a href={child.link} class="nav-link">
                                        {child.name}
                                    </a>
                                </li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                </li>
            {/each}
        </ul>
    </div>
    <div class="sidebar-footer">
        <div class="input-group">
            {#if sidebar.show} 
                <span class="input-group-text"><i class="bi bi-theme"></i></span>
                    <span class="form-control">Dark Mode</span>
                <span class="input-group-text">
                    <InputSwitch bind:value={dark}/>
                </span>
            {:else}
                <button type="button" class="theme" aria-label="theme" onclick={() => dark = !dark}>
                    {#if dark}
                        <i class="bi bi-sun-fill me-1"></i>
                    {:else}
                        <i class="bi bi-theme"></i>
                    {/if}
                </button>
            {/if}
        </div>
        <button class="logout" type="button" onclick={async() => {
            try {
                const res = await fetcher(fetch, '/api/platform/console/logout', {
                    method: 'POST'
                });

                if(res.message) {
                    localStorage.clear();
                    dark = false;
                    goto('/login');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Logout Failed',
                    text: error.message
                })
            }
            
        }}>
            <i class="bi bi-logout"></i>
            <span>Log Out</span>
        </button>
    </div>
</div>