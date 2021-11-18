<script>
    export let title;
    export let minimize;

    function minWin() {
        window.api.send('window', ['minimize', title]);
    }

    function closeWin() {
        window.api.send('window', ['close', title]);
    }
</script>

<div id="windowBar">
    <div class="window-header">
        <!-- svelte-ignore a11y-missing-attribute -->
        <img src="./asset/img/EMU.png" height="15" class="window-img"/>
        <div class="window-name">{title}</div>
        <div class="window-btns-wrapper">
            <div class="title-btn{minimize ? ' title-btn-disabled' : ''}" on:click="{minWin}">
                <svg width="11" height="2" viewbox="0 0 11 2">
                    <path d="m11 0v1h-11v-1z" strokeWidth=".26208" style="stroke: white;"/>
                </svg>
            </div>
            <div class="title-btn close-win-btn" on:click="{closeWin}">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="./assets/img/CloseWindow.png" height="20"/>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    $font-color: rgb(231, 231, 231);
    $grey-dark: #1a1a1a;
    $grey-dark-hover: #353535;
    $warning-red: #e24a4a;
    
    #windowBar {
        width: 100%;
        height: 30px;
        background-color: $grey-dark;
        color: $font-color;
        font-family: 'Eurofont';
        font-size: 12px;
        font-weight: lighter;
        -webkit-app-region: drag;

        .window-header {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;

            .window-img {
                padding: 0px 7.5px
            }

            .window-name { color: white; }

            .window-btns-wrapper {
                height: 100%;
                width: auto;
                margin-left: auto;
                display: flex;
                flex-direction: row;
                align-items: center;

                .title-btn {
                    height: 100%;
                    width: 40px;
                    color: $font-color;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    -webkit-app-region: no-drag;

                    &:hover {
                        background-color: $grey-dark-hover;
                        cursor: pointer;
                    }
                }

                .close-win-btn {
                    font-size: 18px;

                    &:hover {
                        background-color: $warning-red;
                    }
                }
            }
        }
    }
</style>