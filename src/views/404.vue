<template>
  	<div class="hero">  
  		<div class="has-overlay"></div>	
  		<div class="hero-content">
			<div class="container h-100">
				<div class="row h-100 align-items-center justify-content-between">
					<div class="col-12 left">
						<div class="row top">
							<div class="col">
								<img src="../assets/sarascare-logo.png" alt="Sarascare" id="logo"/>
							</div>
						</div>

						<div class="row bottom">
							<div class="col">
								<h1><i class="fas fa-exclamation-triangle"></i> 404 Not Found<br/></h1>
								<p>Looking to report an offense or login? <a class="ahref solid primary" href="/">Click here.</a></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  	</div>
</template>

<script>
	export default {
  		name: "404",
	};
</script>

<style lang="scss">
	@import '@/styles/theme.scss';
	@import '@/styles/public/default.scss';

	.hero { background-blend-mode: soft-light; }
</style>


