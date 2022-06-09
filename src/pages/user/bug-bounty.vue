<style lang="scss">
.bug-bounty {
  h4 {
    margin-top: 20px;
    color: #333;
    font-size: 16px;
  }
}
</style>

<template>
  <div class="con-3 bug-bounty">
    <v-img
      src="https://static1.4everland.org/bg/bug-bounty.png"
      class="wh100p d-b hover-1"
      min-height="100"
      alt="Submit Report"
      @click="onReport"
    />
    <div class="mt-6">
      <h3>4EVERLAND Bug Bounty Campaign</h3>
      <div class="mt-5 fz-14 gray-6 lh-2">
        <div v-html="html"></div>
      </div>
    </div>
  </div>
</template>

<script>
const html = `Dear users:

4EVERLAND Alpha version has been officially launched on August 16. This version supports DWeb hosting, decentralized gateway, decentralized domain name, data services and other products and protocols, you can quickly access Web3.0 through 4EVERLAND HOSTING.

To ensure the long-term and stable development of 4EVERLAND, 4EVERLAND is now launching a bug bounty program with total $1 million dollars initial bounty. In addition, we are offering a maximum reward of $20,000 dollars for identified bugs. We hope to have more professional security researchers through this activity and join in the ecological construction of 4EVERLAND together. 

<h4>Scope of application</h4>
This program is limited to bugs found on *.4everland.org. 4EVERLAND will evaluate the rewards based on the security impact of the bug report.

The following situations are out of the scope of this Bug Bounty Campaign:
<ul>
<li>Third-party applications deployed on 4EVERLAND;</li>
<li>Bugs that have already been reported or discovered in third parties' contracts built on 4EVERLAND;</li>
<li>Bugs caused by the following activities: front-end errors, DDOS attacks, automated tools, damage or abuse of third-party systems or services.</li>
</ul>
<h4>Reward Plan</h4>
On August 16 2021,4EVERLAND officially launched the 4EVERLAND Bug Bounty Campaign with total $1 million dollars initial bounty. We will launch the next phase of Bug Bounty Campaign after the initial bonus is distributed.

The severity of those bugs will be calculated using the Common Vulnerability Scoring System (CVSS):

<table class="e-table-1 mt-3 mb-3 ta-c" style="max-width: 500px">
  <tr>
    <td>Rating</td>
    <td>4EVER Reward</td>
  </tr>
  <tr>
    <td>Critical(9.0-10.0)</td>
    <td>$10,000 - $20,000 4EVER</td>
  </tr>
  <tr>
    <td>High(7.0-8.9)</td>
    <td>$5,000 - $10000 4EVER</td>
  </tr>
  <tr>
    <td>Medium(4.0-6.9)</td>
    <td>$2,000 - $5,000 4EVER</td>
  </tr>
  <tr>
    <td>Low(0.1-3.9)</td>
    <td>$200 - $2,000 4EVER</td>
  </tr>
</table>

In addition to severity, rewards will also be weighed against the impact of bugs found and the difficulty level of finding them. 4EVERLAND may award an additional reward bonus for exceptional reports. This will be done at 4EVERLAND's discretion .

<h4>How to submit your report</h4>
Please submit your report at this page. Prior to the disclosure in the above report, no disclosure to any other person, entity or e-mail address is allowed.

Please include as much bug-related information as possible, including but not limited to:
<ul>
<li>The definite conditions for recurrence of the bug.</li>
<li>The steps needed to reproduce the bug.</li>
<li>The potential impact if the bug is exploited.</li>
<li>Detailed bug reports and analysis will not only increase the possibility of getting rewards but also the possibility of getting higher rewards.</li>
</ul>

<h4>Terms</h4>
<ul>
<li>4EVERLAND reserves the right to cancel or amend the bounty or bounty rules at our sole discretion.</li>
<li>Rewards will be issued within 2 weeks after the vulnerability report is verified. </li>
<li>Rewards will be paid out in 4EVER. 4EVERLAND may award an additional reward bonus for exceptional reports at our discretion.</li>
<li>4EVERLAND will only reward the first verified report of a vulnerability, similar reports that are submitted will not be rewarded.</li>
</ul>`;

export default {
  computed: {
    html() {
      return html
        .split(/\n/)
        .map((txt) => {
          if (/^<.+>$/.test(txt.trim())) return txt;
          return `<div>${txt}</div>`;
        })
        .join("");
    },
  },
  methods: {
    onReport() {
      this.$setMsg({
        name: "feedback",
        data: { label: "Bug Bounty" },
      });
    },
  },
};
</script>