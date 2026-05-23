<script lang="ts">
    import Modal from "../../common/modal/Modal.svelte";
    import MicrosoftAccountTab from "./MicrosoftAccountTab.svelte";
    import TheAlteningAccountTab from "./TheAlteningAccountTab.svelte";
    import Tabs from "../../common/modal/Tabs.svelte";
    import CrackedAccountTab from "./CrackedAccountTab.svelte";
    import SessionAccountTab from "./SessionAccountTab.svelte";
    import {setItem} from "../../../../integration/persistent_storage";

    export let visible: boolean;

    const tabs = [
        {
            title: "Microsoft",
            icon: "icon-microsoft.svg",
            component: MicrosoftAccountTab
        },
        {
            title: "TheAltening",
            icon: "icon-thealtening.svg",
            component: TheAlteningAccountTab
        },
        {
            title: "Cracked",
            icon: "icon-cracked.png",
            component: CrackedAccountTab
        },
        {
            title: "Session",
            icon: "icon-session.svg",
            component: SessionAccountTab
        }
    ];

    let activeTab = parseInt(localStorage.getItem("altmanager_add_account_active_tab") ?? "0");

    async function handleChangeTab(newActiveTab: number) {
        activeTab = newActiveTab;
        await setItem("altmanager_add_account_active_tab", newActiveTab.toString());
    }
</script>

<Modal title="Add Account" bind:visible={visible}>
    <Tabs {tabs} {activeTab} onchangeTab={handleChangeTab}/>
</Modal>
