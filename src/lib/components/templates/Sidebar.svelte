<script>
    import { getContext } from "svelte";
    import MenuSearch from "../atoms/MenuSearch.svelte";
    import DropdownProfile from "../atoms/DropdownProfile.svelte";

    const { data } = $props();
    let search = $state('');
    let openMenu = $state({});
    const sidebar = getContext('sidebar');

    function searchMenu(e) {
        search = e.detail.toLowerCase();
    }

    function toggleMenu(code) {
        openMenu[code] = !openMenu[code];
    }

    function isActive(url) {
        return location.pathname === url;
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
</script>


<div class="sidebar {sidebar.show ? 'show' : ''}">
    <div class="sidebar-header d-flex justify-content-between">
        <div class="d-flex align-items-center" style="gap: 10px;">
            <img src="/favicon.ico" style="width: 1rem; height: 1rem;" alt="">
            <h3 style="font-size: 1rem;" class="fw-bold"><span class="text-primary">Fin</span>shpere</h3>
        </div>
        <button aria-label="toggle" onclick={() => sidebar.toggle()}>
            <i class="bi bi-stroke-left toggle-icon"></i>
        </button>
    </div>
    <div class="sidebar-menu">
        <DropdownProfile session={data.session}/>
        <MenuSearch {data} on:search={searchMenu}/>

        <ul class="list-unstyled navbar-nav-menu">
            <li class="text-uppercase mx-3">Main Menu</li>

            <li class="nav-item py-2 px-3 rounded dashboard {isActive("/") ? 'active' : ''}">
                <a href="/" class="nav-link">
                    <i class="bi bi-dashboard"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            {#each menuTree as parent}
                <li class="nav-item parent-menu">

                    <!-- Parent -->
                    <a
                        class="nav-link parent-toggle"
                        data-bs-toggle="collapse"
                        onclick={() => toggleMenu(parent.menuCode)}
                        href={"#collapse-" + parent.menuCode}
                        >
                        <span class="icons">
                            <i class={"bi bi-" + parent.icon}></i>
                        </span>

                        <span class="content">{parent.name}</span>

                        <span class="ms-auto menu-arrow">
                            <i class="bi bi-stroke-bottom arrow-icon" 
                                style="font-size: 0.8rem;transition: transform 0.3s ease;transform: rotate({openMenu[parent.menuCode] ? 180 : 0}deg);">
                            </i>
                        </span>
                    </a>
                    <!-- Child -->
                    <div class="collapse mt-2" id={"collapse-" + parent.menuCode}>
                        <ul class="nav-menu-sub list-unstyled">
                            {#each parent.children as child}
                                <li class="{isActive(child.link) ? 'active' : ''}">
                                    <a
                                        href={child.link}
                                        class="nav-link"
                                    >
                                        {child.name}
                                    </a>
                                </li>
                            {/each}
                        </ul>
                    </div>

                </li>
            {/each}
        </ul>
    </div>
    <div class="sidebar-footer">
        <div class="d-flex align-items-center">
            <div class="input-group">
                <span class="input-group-text">$</span>
                <span class="form-control">Dark Mode</span>
                <span class="input-group-text">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" checked>
                    </div>
                </span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .sidebar {
        border: 1px solid #E0E2E6;
        position: fixed;
        background-color: #F5F7F9;
        width: 4rem;
        height: 100vh;
        transition: width 0.3s ease;
        display: flex;
        flex-direction: column;
        height: 100vh; 

        .toggle-icon {
            transform: rotate(180deg);
        }

        .toggle-icon {
            display: inline-block;
            transition: transform 0.3s ease;
        }

        .sidebar-header {
            padding: 1.5rem;

            button {
                border: none;
                background-color: transparent;
                font-size: 0.8rem !important;

                i {
                    color: #7E7695 !important;
                }
            }
        }

        .sidebar-menu {
            flex: 1;
            overflow-y: auto; /* kalau menu panjang */
            .navbar-nav-menu {
                padding: 0 0.5rem;

                .parent-menu {
                    padding: 0.5rem 1rem;

                    .active {
                        background-color: #fff;
                        border: 1px solid #E0E2E6;
                        
                        a {
                            color: #9C52FB !important;
                        }
                    }
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .nav-menu-sub {
                    padding-left: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .active {
                        border: none;
                        background-color: #F5F7F9;
                        a {
                            color: #9C52FB !important;
                        }
                    }
                }
            }
        }

        &.show {
            width: 22.5rem;

            .toggle-icon {
                transform: rotate(0);
            }

            .sidebar-header {
                h3 {
                    text-align: center;
                    margin-top: 0.5rem;
                    line-height: 0 !important;
                }
            } 
        }

        .sidebar-footer {
            padding: 1.5rem;
        }

    }

</style>