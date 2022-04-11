<template>
  <div class="pr-8">
    <v-timeline dense align-top>
      <v-timeline-item small v-for="(it, i) in list" :key="i">
        <v-img
          :src="
            /^http/.test(it.img)
              ? it.img
              : 'https://4ever-web.4everland.store/' + it.img
          "
          class="w100p mb-4 bdrs-10 bd-1"
          contain
          max-height="360"
          min-height="300"
          v-if="it.img"
        />
        <div class="color-1 fw-b">
          {{ it.time.toDate().format("date") }}
        </div>
        <div class="mt-3 mb-5">
          <div class="lh-2 gray-6 fz-14" v-html="it.con"></div>
        </div>
        <!-- <v-divider></v-divider> -->
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  computed: {
    asMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  data() {
    return {
      list: [
        {
          time: "2022-04-07",
          img: "https://tever.4everland.store/2022-4-7.jpg",
          con: `<h3>4EVERLAND new Dashboard is officially launched!</h3>
          <ul>
          <li>Redesign the official website's UI and merge Hosting & Bucket display page.</li>
          <li>Add MetaMask login in Hosting and Bucket. </li>
          <li>Keep the original GitHub login, but users can login with wallet after connecting a new wallet account.</li>
          <li>Bucket and Hosting Docs are integrated into one.</li>
          <li>Adjust the secondary modules.</li>
          <li>Support: Docs, Bug Bounty, and Changelog
Personal center: Setting, My Collections, My Referral, Report, and Disconnect</li>
          <li>Optimize the Hosting project display style and adjust the deployment process.</li>
          </ul>`,
        },
        {
          time: "2022-03-11",
          img: "https://docs-images.4everland.store/bucketchangelog.gif",
          con: `<h3>Add AR storage to 4EVERLAND Bucket</h3>
          <ul>
          <li>Added the function to automatically sync to AR when creating a Bucket</li>
          <li>Add the AR synchronization function for a particular file.</li>
          <li>Added AR History module.</li>
          <li>Add AR-related fields to file info.</li>
          <li>Modified the display style of the remaining storage.</li>
          </ul>`,
        },
        {
          time: "2022-01-10",
          img: "img/log/2022-1-10.png",
          con: `<h3>Added some new features</h3>
          <ul>
          <li>Support ENS and IPNS</li>
          </ul>`,
        },
        {
          time: "2022-01-07",
          img: "img/log/2022-1-7.png",
          con: `<h3>Improved some details of 4EVERLAND HOSTING</h3>
          <ul>
          <li>Optimized the custom pricing plan and its payment process </li>
          <li>Fixed some known issues</li>
          </ul>`,
        },
        {
          time: "2021-12-10",
          img: "img/log/2021-12-10.gif",
          con: `<h3>We support the CLI now !</h3>
          <ul>
          <li>Hosting offers a command-line interface for the 4everland CLI, which enables you to deploy and manage projects with a set of commands. </li>
          <li>Please check the following link to access  <a href="https://docs.hosting.4everland.org/cli/" target="_blank">Docs-Cli</a></li>
          </ul>`,
        },
        {
          time: "2021-12-06",
          img: "img/log/2021-12-06.jpeg",
          con: `<h3>We offered you pricing plans to subscribe.</h3>
          <ul>
          <li>Added pricing plan, you can subscribe it based on your specific needs.</li>
          <li>Offered four different versions: free, pro, business, and custom.</li>
          <li>Supported DAI, USDC, and USDT payment methods. </li>
          </ul>`,
        },
        {
          time: "2021-12-06",
          img: "img/log/2021-12-06-2.jpeg",
          con: `<h3>Modified the billing model and bill display page.</h3>
          <ul>
          <li>Billing statistics are modified to the three dimensions of bandwidth, storage, and build minutes. Users before the HOSTING beta release will have access to 100M bandwidth and 40G storage until December 31, 2021.</li>
          <li>Added payment record, you can view payment details.</li>
          <li>Added status reminder function. </li>
          </ul>`,
        },
        {
          time: "2021-12-06",
          img: "img/log/2021-12-06-3.jpeg",
          con: `<h3>Optimized statistics function.</h3>
          <ul>
          <li>Added the function to view new user retention rate by date filter.</li>
          <li>Added statistics modules of total requests, request by source, and request by county.</li>
          <li>The source statistics include: References, Browsers, Device types, Operating systems, Paths. </li>
          </ul>`,
        },
        {
          time: "2021-10-25",
          img: "img/log/2021-10-25.jpeg",
          con: `<h3>Published new functions in 4EVERLAND-HOSTING.</h3>
          <ul>
          <li>Published new gateway </li>
          <li>Claim' button in First Landing page now available </li>
          </ul>`,
        },
        {
          time: "2021-10-11",
          img: "img/log/2021-10-11.jpeg",
          con: `<h3>More details in 4EVERLAND HOSTING have improved.</h3>
          <ul>
          <li>Set the corresponding browser title according to the page route </li>
          <li>Added a prompt of A record or AAAA record conflict when adding a first-level domain name in the project settings</li>
          </ul>`,
        },
        {
          time: "2021-9-27",
          img: "img/log/2021-9-27.jpeg",
          con: `<h3>Improvements on the statistics page and breadcrumb navigation is added.</h3>
          <ul>
          <li>Breadcrumb navigation added on project details and build page</li>
          <li>Added refresh data button added on  the Statistics page </li>
          <li>Optimized UI of the statistics page, added different colour for retention rate</li>
          </ul>`,
        },
        {
          time: "2021-9-13",
          img: "img/log/2021-9-13.jpeg",
          con: `<h3>Optimized the deployment process.</h3>
          <ul>
          <li>Optimized the construction process and added branch selection function</li>
          <li>Optimized the build process and increased the Deploy Hooks option</li>
          <li>Added commits history to the project details page, and specific commits can be selected for deployment</li>
          </ul>`,
        },
        {
          time: "2021-9-6",
          img: "img/log/2021-9-6.jpeg",
          con: `<h3>Intercom is now up. Now you can speak to us in no time and also we have optimized couples details such as import Git repository etc.</h3>
          <ul>
          <li>Optimized the Build command, scroll down for the default scripts in package.json</li>
          <li>Optimized Git repository search</li>
          <li>Optimized Git Repo import process and support branch selection </li>
          <li>Set the Clone Flow page defaults to project name to the git name and added branch display</li>
          <li>Integrated Intercom</li>
          </ul>
          `,
        },
        {
          time: "2021-8-31",
          img: "img/log/2021-8-31.jpg",
          con: `<h3>We have done more functional support and detailed optimization for 4EVERLAND HOSTING, as follows:</h3>
<ul>
<li>Support multiple GitHub accounts login and also org Github accounts. </li>
<li>Enable search on Github projects and display in pages.</li>
<li>Added project titles on the build page and with links direct to project details.</li>
<li>Added the 'go to last line' button to return the bottom of the build logs. (This button shows the number of new build logs while building).</li>
<li>Fixed no updates on output contents issue after rebuild.</li>
<li>Updated default background image and changelog icon.</li>
<li>Optimized line chart on the statistics page.</li>
</ul>`,
        },
        {
          time: "2021-8-16",
          img: "https://www.4everland.org/imgs/blogs/Hosting_Launch.png",
          con: `
<h3>4EVERLAND HOSTING is officially launched, you can deploy and host your website through "HOSTING" with one click. The specific features are as follows.</h3>
<ul>
<li>Authorize login via github</li>
<li>Connect to a github repository</li>
<li>Select a framework or custom build command, output dir, root dir</li>
<li>Add environment variables</li>
<li>Execute the compilation, log view real-time build process</li>
<li>Access to the build project website</li>
<li>A new account to receive trial credits and view credit usage (40GB storage + unlimited flow)</li>
<li>Support for project templates, clone any github repository, support for subfolders</li>
<li>Access to any imported project to: check build history, statistics (PV/UV/retention), change compilation configuration, customize domain name, configure environment variables, configure webhooks, etc.</li>
<li>Support for viewing Docs documentation</li>
<li>Support for automated content risk identification and review services</li>
<li>Support for Feedback and reporting features</li>
</ul>
`,
        },
      ],
    };
  },
};
</script>