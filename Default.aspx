<%@ Register TagPrefix="uc" TagName="head" Src="~/controls/head.ascx" %>
<%@ Register TagPrefix="uc" TagName="header" Src="~/controls/header.ascx" %>
<%@ Register TagPrefix="uc" TagName="footer" Src="~/controls/footer.ascx" %>
<%@ Register TagPrefix="uc" TagName="includedScripts" Src="~/controls/includedScripts.ascx" %>
<%@ Register TagPrefix="uc" TagName="googleAnalytics" Src="~/controls/googleAnalytics.ascx" %>
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <uc:head runat="server" ID="ucHead" />
</head>
<body runat="server" id="body" class="nocomponents">
	<uc:header runat="server" ID="ucHeader" />
    <main id="main" role="main">
		<div class="banner">
			<div class="content-container">
				<div class="row row-cols-2">
					<div class="col">
						<h1 class="banner-hdr"><img src="/img/logos/select-interactive-white.v1.svg" width="400" height="120" alt="Select Interactive Website Design and Website Development" /></h1>
						<h2 class="banner-tagline">Building a better web.</h2>
					</div>
					<div class="col">
						<h2 class="banner-tagline">Passionate Web Developers<br />that produce the highest quality work using<br />innovative development strategies.</h2>
					</div>
				</div>
			</div>
		</div>
		<div class="paper paper-gray-light copy">
			<div class="row row-cols-3">
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">code</i>Fast, Creative, User-Friendly Websites</h2>
					<p><strong class="color-primary">Select Interactive</strong> creates fast, creative, and user-friendly websites and web applications built with cutting-edge web technologies. We are a team of passionate developers working to produce the highest quality work with innovative development strategies.</p>
					<p><a href="/about/">Get to Know Our Team</a></p>
				</div>
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">cloud</i>Modern Web Development</h2>
					<p>Our goal is to help build a better web with every project, and we achieve that by using the latest web technologies and following web standards. We implement performance best practices in every website and application so your project loads and runs as fast as possible -- making the end-user happy.</p>
					<p><a href="/news/tag/building-a-better-web">We&rsquo;re Building a Better Web</a></p>
				</div>
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">filter</i>Customized Content Management</h2>
					<p>We specialize in &ldquo;Making the web easy&rdquo; for you. Custom content management systems that are quick to learn and built specifically for your project needs. No additional bloated software or confusing admin options that only slow you down. Take control of your content at anytime, from anywhere.</p>
					<p><a href="/services/">Customized Just For You</a></p>
				</div>
			</div>
			<div class="row row-cols-3">
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">important_devices</i>Mobile Friendly, Responsive Web Design</h2>
					<p>With the ever growing number of mobile devices, it&rsquo;s now expected to have a site that is fully functional, accessible, and FAST on all of them. To accomplish this goal, we implement site designs using Responsive Web Design (RWD) to allow site layout and content to adapt to the device dimensions and render as optimal as possible.</p>
					<p><a href="/news/tag/responsive-web-design">Driving Your Mobile Web</a></p>
				</div>
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">whatshot</i>On the Cutting-Edge</h2>
					<p>We love pushing the boundaries of the web and finding ways to use new technologies to improve our products. Whether that&rsquo;s a faster turnaround time, improved site speed, search engine results, design strategies, and more, we&rsquo;re always searching for better solutions.</p>
					<p><a href="/news/tag/conference">How We Stay Ahead of the Game</a></p>
				</div>
				<div class="col">
					<h2 class="copy-hdr"><i class="material-icons">trending_up</i>Search Engine Optimization (SEO)</h2>
					<p>In order to get your brand and product more attention, it&rsquo;s important that people can find you when they search the web -- especially people that have never heard of you. That&rsquo;s why with every website we include SEO best practices to help prospective clients discover your business online.</p>
					<p><a href="/news/2012/08/lets-talk-seo">Improve Your SEO and Expand Your Brand</a></p>
				</div>
			</div>
		</div>
		<div class="paper paper-pad-med">
			<h2 class="copy-hdr copy-hdr-xl text-center">Some Friends</h2>
			<ul class="clients">
				<li class="client"><img src="/img/logos/nimble.v1.png" width="311" height="40" alt="Nimble Design Co." /></li>
				<li class="client"><img src="/img/logos/slant.v1.png" width="150" height="40" alt="Slant Parnters" /></li>
				<li class="client"><img src="/img/logos/ip.v1.png" width="399" height="40" alt="IP DFW" /></li>
				<li class="client"><img src="/img/logos/branded.v1.png" width="236" height="40" alt="The Branded Company" /></li>
				<li class="client"><img src="/img/logos/williams-trew.v1.png" width="293" height="40" alt="Williams Trew Real Estate" /></li>
			</ul>
		</div>
		<div class="paper paper-gray-dark">
			<div class="content-container">
				<h2 class="copy-hdr copy-hdr-xl text-center">What&rsquo; Happening</h2>
				<ul class="articles">
					<li class="article">
						<div class="card">
							<div class="card-img"><img src="/img/news/si.v1.png" /></div>
							<h2 class="card-hdr">Development Tools and Workflow</h2>
							<div class="card-copy">
								<p>As more developer tools have recently become available, we&rsquo;ve had to modify our development envrionment and workflow to take advantage of them. Take a look at what we use and how we advance through web projects.</p>
							</div>
							<div class="card-footer">
								<a href="#" class="btn btn-no-pad">Read More</a>
							</div>
						</div>
					</li>
					<li class="article">
						<div class="card">
							<div class="card-img"><img src="/img/news/lv.v1.jpg" /></div>
							<h2 class="card-hdr">Development Tools and Workflow</h2>
							<div class="card-copy">
								<p>As more developer tools have recently become available, we&rsquo;ve had to modify our development envrionment and workflow to take advantage of them. Take a look at what we use and how we advance through web projects.</p>
							</div>
							<div class="card-footer">
								<a href="#" class="btn btn-no-pad">Read More</a>
							</div>
						</div>
					</li>
					<li class="article">
						<div class="card">
							<div class="card-img"><img src="/img/news/si.v1.png" /></div>
							<h2 class="card-hdr">Development Tools and Workflow</h2>
							<div class="card-copy">
								<p>As more developer tools have recently become available, we&rsquo;ve had to modify our development envrionment and workflow to take advantage of them. Take a look at what we use and how we advance through web projects.</p>
							</div>
							<div class="card-footer">
								<a href="#" class="btn btn-no-pad">Read More</a>
							</div>
						</div>
					</li>
					<li class="article">
						<div class="card">
							<div class="card-img"><img src="/img/news/lv.v1.jpg" /></div>
							<h2 class="card-hdr">Development Tools and Workflow</h2>
							<div class="card-copy">
								<p>As more developer tools have recently become available, we&rsquo;ve had to modify our development envrionment and workflow to take advantage of them. Take a look at what we use and how we advance through web projects.</p>
							</div>
							<div class="card-footer">
								<a href="#" class="btn btn-no-pad">Read More</a>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
    </main>
    <uc:footer runat="server" ID="ucFooter" />

    <uc:includedScripts runat="server" ID="ucIncludedScripts" />
    <uc:googleAnalytics runat="server" ID="ucGoogleAnalytics" />
</body>
</html>