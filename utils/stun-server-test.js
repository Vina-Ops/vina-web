/**
 * STUN Server Connectivity Test
 *
 * This utility tests the connectivity to various STUN servers
 * to help diagnose WebRTC connection issues.
 */

// List of STUN servers to test
const STUN_SERVERS = [
  { name: "Google STUN 1", url: "stun:stun.l.google.com:19302" },
  { name: "Google STUN 2", url: "stun:stun1.l.google.com:19302" },
  { name: "Google STUN 3", url: "stun:stun2.l.google.com:19302" },
  { name: "Cloudflare STUN", url: "stun:stun.cloudflare.com:3478" },
  { name: "STUN Protocol", url: "stun:stun.stunprotocol.org:3478" },
  { name: "VoipAround", url: "stun:stun.voiparound.com" },
  { name: "VoipBuster", url: "stun:stun.voipbuster.com" },
  { name: "VoipStunt", url: "stun:stun.voipstunt.com" },
  { name: "CounterPath", url: "stun:stun.counterpath.com" },
  { name: "1und1", url: "stun:stun.1und1.de" },
  { name: "GMX", url: "stun:stun.gmx.net" },
  { name: "NextCloud", url: "stun:stun.nextcloud.com:443" },
  { name: "BlackBerry", url: "stun:stun.voip.blackberry.com:3478" },
];

// Test a single STUN server
async function testStunServer(server) {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: server.url }],
    });

    const timeout = setTimeout(() => {
      pc.close();
      resolve({
        name: server.name,
        url: server.url,
        status: "timeout",
        error: "Connection timeout after 5 seconds",
      });
    }, 5000);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        clearTimeout(timeout);
        pc.close();
        resolve({
          name: server.name,
          url: server.url,
          status: "success",
          candidate: event.candidate,
        });
      }
    };

    pc.onicecandidateerror = (event) => {
      clearTimeout(timeout);
      pc.close();
      resolve({
        name: server.name,
        url: server.url,
        status: "error",
        error: `${event.errorCode}: ${event.errorText}`,
      });
    };

    // Create a data channel to trigger ICE gathering
    pc.createDataChannel("test");
    pc.createOffer().then((offer) => pc.setLocalDescription(offer));
  });
}

// Test all STUN servers
async function testAllStunServers() {
  console.log("🧪 Testing STUN server connectivity...\n");

  const results = [];

  for (const server of STUN_SERVERS) {
    console.log(`Testing ${server.name}...`);
    const result = await testStunServer(server);
    results.push(result);

    if (result.status === "success") {
      console.log(`✅ ${server.name}: Working`);
    } else if (result.status === "error") {
      console.log(`❌ ${server.name}: ${result.error}`);
    } else {
      console.log(`⏰ ${server.name}: Timeout`);
    }
  }

  console.log("\n📊 Test Results Summary:");
  console.log("========================");

  const working = results.filter((r) => r.status === "success");
  const failed = results.filter((r) => r.status === "error");
  const timeout = results.filter((r) => r.status === "timeout");

  console.log(`✅ Working servers: ${working.length}`);
  console.log(`❌ Failed servers: ${failed.length}`);
  console.log(`⏰ Timeout servers: ${timeout.length}`);

  if (working.length > 0) {
    console.log("\n✅ Working STUN servers:");
    working.forEach((server) => {
      console.log(`  - ${server.name} (${server.url})`);
    });
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed STUN servers:");
    failed.forEach((server) => {
      console.log(`  - ${server.name}: ${server.error}`);
    });
  }

  if (timeout.length > 0) {
    console.log("\n⏰ Timeout STUN servers:");
    timeout.forEach((server) => {
      console.log(`  - ${server.name}`);
    });
  }

  console.log("\n💡 Recommendations:");
  if (working.length >= 3) {
    console.log("✅ Good connectivity - WebRTC should work well");
  } else if (working.length >= 1) {
    console.log("⚠️ Limited connectivity - WebRTC may have issues");
    console.log("   Consider using TURN servers for better reliability");
  } else {
    console.log("❌ Poor connectivity - WebRTC will likely fail");
    console.log("   Check firewall settings and network configuration");
    console.log("   TURN servers are essential for this network");
  }

  return results;
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testStunServers = testAllStunServers;
  console.log(
    "🧪 STUN server test loaded. Run testStunServers() to test connectivity."
  );
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { testStunServers: testAllStunServers, testStunServer };
}
