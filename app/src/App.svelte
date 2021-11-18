<script>
	import WindowBar from './lib/WindowBar.svelte';
</script>

<main>
	<WindowBar title={'SWTOR Launcher Replacement'} minimize={true}/>
	<div class="content">

	</div>
</main>

<style lang="scss">
	$font-color: rgb(231, 231, 231);
    $grey-dark: #1a1a1a;
    $grey-dark-hover: #2b2b2b;
	$grey-med: #333;
    $medium-grey-bright: rgb(97, 97, 97);
    $yellow-slicers: #ffce00;
    $grey-black-alt: #292929;
    $warning-red: #e24a4a;

	main {
		width: 100%;
		height: 100%;
		color: $font-color;
		background-color: $grey-dark;
	}
</style>