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

// List of TURN servers to test
const TURN_SERVERS = [
  { name: "Metered TURN 80", url: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
  { name: "Metered TURN 443", url: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
  { name: "Relay TURN 80", url: "turn:relay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
  { name: "Relay TURN 443", url: "turn:relay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
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

// Test a single TURN server
async function testTurnServer(server) {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{
        urls: server.url,
        username: server.username,
        credential: server.credential
      }],
    });

    const timeout = setTimeout(() => {
      pc.close();
      resolve({
        name: server.name,
        url: server.url,
        status: "timeout",
        error: "Connection timeout after 8 seconds",
      });
    }, 8000); // Longer timeout for TURN servers

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

  console.log("\n📊 STUN Server Results:");
  console.log("========================");

  const working = results.filter((r) => r.status === "success");
  const failed = results.filter((r) => r.status === "error");
  const timeout = results.filter((r) => r.status === "timeout");

  console.log(`✅ Working STUN servers: ${working.length}`);
  console.log(`❌ Failed STUN servers: ${failed.length}`);
  console.log(`⏰ Timeout STUN servers: ${timeout.length}`);

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

  return results;
}

// Test all TURN servers
async function testAllTurnServers() {
  console.log("\n🔄 Testing TURN server connectivity...\n");

  const results = [];

  for (const server of TURN_SERVERS) {
    console.log(`Testing ${server.name}...`);
    const result = await testTurnServer(server);
    results.push(result);

    if (result.status === "success") {
      console.log(`✅ ${server.name}: Working`);
    } else if (result.status === "error") {
      console.log(`❌ ${server.name}: ${result.error}`);
    } else {
      console.log(`⏰ ${server.name}: Timeout`);
    }
  }

  console.log("\n📊 TURN Server Results:");
  console.log("========================");

  const working = results.filter((r) => r.status === "success");
  const failed = results.filter((r) => r.status === "error");
  const timeout = results.filter((r) => r.status === "timeout");

  console.log(`✅ Working TURN servers: ${working.length}`);
  console.log(`❌ Failed TURN servers: ${failed.length}`);
  console.log(`⏰ Timeout TURN servers: ${timeout.length}`);

  if (working.length > 0) {
    console.log("\n✅ Working TURN servers:");
    working.forEach((server) => {
      console.log(`  - ${server.name} (${server.url})`);
    });
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed TURN servers:");
    failed.forEach((server) => {
      console.log(`  - ${server.name}: ${server.error}`);
    });
  }

  if (timeout.length > 0) {
    console.log("\n⏰ Timeout TURN servers:");
    timeout.forEach((server) => {
      console.log(`  - ${server.name}`);
    });
  }

  return results;
}

// Test all servers (STUN + TURN)
async function testAllServers() {
  console.log("🧪 Testing WebRTC server connectivity...\n");
  
  const stunResults = await testAllStunServers();
  const turnResults = await testAllTurnServers();
  
  const allWorking = stunResults.filter(r => r.status === "success").length + 
                    turnResults.filter(r => r.status === "success").length;
  const allFailed = stunResults.filter(r => r.status === "error").length + 
                   turnResults.filter(r => r.status === "error").length;
  const allTimeout = stunResults.filter(r => r.status === "timeout").length + 
                    turnResults.filter(r => r.status === "timeout").length;

  console.log("\n📊 Overall Results:");
  console.log("===================");
  console.log(`✅ Total working servers: ${allWorking}`);
  console.log(`❌ Total failed servers: ${allFailed}`);
  console.log(`⏰ Total timeout servers: ${allTimeout}`);

  console.log("\n💡 Recommendations:");
  const workingStun = stunResults.filter(r => r.status === "success").length;
  const workingTurn = turnResults.filter(r => r.status === "success").length;
  
  if (workingStun >= 3 && workingTurn >= 1) {
    console.log("✅ Excellent connectivity - WebRTC should work very well");
  } else if (workingStun >= 2 && workingTurn >= 1) {
    console.log("✅ Good connectivity - WebRTC should work well");
  } else if (workingStun >= 1 && workingTurn >= 1) {
    console.log("⚠️ Limited connectivity - WebRTC may have issues");
  } else if (workingStun >= 2) {
    console.log("⚠️ STUN only - WebRTC may work but TURN servers recommended");
  } else if (workingStun >= 1) {
    console.log("⚠️ Very limited connectivity - WebRTC will likely have issues");
    console.log("   TURN servers are essential for this network");
  } else {
    console.log("❌ Poor connectivity - WebRTC will likely fail");
    console.log("   Check firewall settings and network configuration");
    console.log("   Both STUN and TURN servers are essential for this network");
  }

  return { stun: stunResults, turn: turnResults };
}

// Export for use in browser console
if (typeof window !== "undefined") {
  window.testStunServers = testAllStunServers;
  window.testTurnServers = testAllTurnServers;
  window.testAllServers = testAllServers;
  console.log(
    "🧪 WebRTC server test loaded. Available functions:"
  );
  console.log("  - testStunServers() - Test STUN servers only");
  console.log("  - testTurnServers() - Test TURN servers only");
  console.log("  - testAllServers() - Test all servers (recommended)");
}

// Export for Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = { 
    testStunServers: testAllStunServers, 
    testTurnServers: testAllTurnServers,
    testAllServers: testAllServers,
    testStunServer, 
    testTurnServer 
  };
}
