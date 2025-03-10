/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* import-globals-from head.js */
"use strict";

// test without target switching
add_task(async function() {
  // FIXME: The last part of the test is failing with bfcache in parent enabled (when
  // going back, the host item isn't displayed in the storage tree).
  // This should be fixed in Bug 1717625.
  await pushPref("fission.bfcacheInParent", false);
  await testNavigation();
});

// test with target switching enabled
add_task(async function() {
  enableTargetSwitching();
  await testNavigation();
});

async function testNavigation() {
  const URL1 = buildURLWithContent(
    "example.com",
    `<h1>example.com</h1>` + `<script>document.cookie = "lorem=ipsum";</script>`
  );
  const URL2 = buildURLWithContent(
    "example.net",
    `<h1>example.net</h1>` +
      `<iframe></iframe>` +
      `<script>document.cookie = "foo=bar";</script>`
  );
  const URL_IFRAME = buildURLWithContent(
    "example.org",
    `<h1>example.org</h1>` + `<script>document.cookie = "hello=world";</script>`
  );

  // open tab
  await openTabAndSetupStorage(URL1);
  const doc = gPanelWindow.document;

  // Check first domain
  // check that both host appear in the storage tree
  checkTree(doc, ["cookies", "http://example.com"]);
  // check the table for values
  await selectTreeItem(["cookies", "http://example.com"]);
  checkCookieData("lorem", "ipsum");

  // NOTE: No need to clean up cookies since Services.cookies.removeAll() from
  // the registered clean up function will remove all of them.

  // Check second domain
  await navigateTo(URL2);
  // wait for storage tree refresh, and check host
  info("Waiting for storage tree to refresh and show correct host…");
  await waitUntil(
    () =>
      isInTree(doc, ["cookies", "http://example.net"]) &&
      !isInTree(doc, ["cookies", "http://example.com"])
  );

  ok(
    !isInTree(doc, ["cookies", "http://example.com"]),
    "example.com item is not in the tree anymore"
  );

  // check the table for values
  // NOTE: there's an issue with the TreeWidget in which `selectedItem` is set
  //       but we have nothing selected in the UI. See Bug 1712706.
  //       Here we are forcing selecting a different item first.
  await selectTreeItem(["cookies"]);
  await selectTreeItem(["cookies", "http://example.net"]);
  info("Waiting for table data to update and show correct values");
  await waitUntil(() => hasCookieData("foo", "bar"));

  // reload the current page, and check again
  await refreshTab();
  // wait for storage tree refresh, and check host
  info("Waiting for storage tree to refresh and show correct host…");
  await waitUntil(() => isInTree(doc, ["cookies", "http://example.net"]));
  // check the table for values
  // NOTE: there's an issue with the TreeWidget in which `selectedItem` is set
  //       but we have nothing selected in the UI. See Bug 1712706.
  //       Here we are forcing selecting a different item first.
  await selectTreeItem(["cookies"]);
  await selectTreeItem(["cookies", "http://example.net"]);
  info("Waiting for table data to update and show correct values");
  await waitUntil(() => hasCookieData("foo", "bar"));

  // make the iframe navigate to a different domain
  const onStorageTreeUpdated = gUI.once("store-objects-edit");
  await SpecialPowers.spawn(
    gBrowser.selectedBrowser,
    [URL_IFRAME],
    async function(url) {
      const iframe = content.document.querySelector("iframe");
      iframe.src = url;
    }
  );
  info("Waiting for storage tree to update");
  await onStorageTreeUpdated;

  info("Waiting for storage tree to refresh and show correct host…");
  await waitUntil(() => isInTree(doc, ["cookies", "http://example.org"]));
  info("Checking cookie data");
  await selectTreeItem(["cookies", "http://example.org"]);
  checkCookieData("hello", "world");

  info(
    "Navigate to the first URL to check that the multiple hosts in the current document are all removed"
  );
  await navigateTo(URL1);
  ok(true, "navigated");
  await waitUntil(() => isInTree(doc, ["cookies", "http://example.com"]));
  ok(
    !isInTree(doc, ["cookies", "http://example.net"]),
    "host of previous document (example.net) is not in the tree anymore"
  );
  ok(
    !isInTree(doc, ["cookies", "http://example.org"]),
    "host of iframe in previous document (example.org) is not in the tree anymore"
  );

  info("Navigate backward to test bfcache navigation");
  gBrowser.goBack();
  await waitUntil(() => isInTree(doc, ["cookies", "http://example.net"]));

  ok(
    !isInTree(doc, ["cookies", "http://example.com"]),
    "host of previous document (example.com) is not in the tree anymore"
  );

  info("Check that the Cookies node still has the expected label");
  is(
    getTreeNodeLabel(doc, ["cookies"]),
    "Cookies",
    "Cookies item is properly displayed"
  );
}
